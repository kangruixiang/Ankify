import { appendFile } from "fs/promises";
import { processorProd } from "./processor.ts";

export function findTags(MDData: string) {
    const contentTags = MDData.match(/\B#[\w\d-_/]+/g);
    const tags = contentTags?.map(tag => tag.replace(/#/, "")).join(" ") ?? ""

    return tags;
}


type Card = {
    id: string
    header: string
    type: 'basic' | 'cloze' | 'ignore'
    MDContent: string
    HTMLContent?: string
}

export class AnkiCard {
    MDContent: string
    delimiter: string;
    cardLeft: string;
    cardRight: string;
    highlightBorder: string;
    tags: string
    cards: Card[]


    constructor(MDContent: string, delimiter: string, cardLeft: string, cardRight: string, highlightBorder: string, tags: string) {
        this.MDContent = MDContent
        this.delimiter = delimiter
        this.cardLeft = this.escapeRegex(cardLeft)
        this.cardRight = this.escapeRegex(cardRight)
        this.highlightBorder = highlightBorder
        this.tags = tags
        this.cards = []
    }

    /**
    * Escape function in case cardleft/right includes special characters
    */
    escapeRegex(str: string) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    /**
     * Replaces cloze card with time for unique ID
     */
    addClozeID() {

        const clozeMatch = new RegExp(`${this.cardLeft}(.+?)${this.cardRight}`, "g");

        this.MDContent = this.MDContent.replace(clozeMatch, (_, inner) => {
            const newDate = Math.floor(Date.now() * Math.random()).toString();
            const newCloze = `c:${newDate}`;
            const replaced = inner.replace(/cloze/g, newCloze);
            return this.cardLeft + replaced + this.cardRight
        });
    }

    /**
     * Adds unique ID to basic cards if doesn't exist
     */
    addBasicID() {

        const basicMatch = new RegExp(`${this.cardLeft}(.+?)${this.cardRight}`, "g");
        const basicID = /[cb]:\d+/s

        this.MDContent = this.MDContent.replace(basicMatch, (_, content) => {

            // return content if already has ID or if equals ignore or cloze
            if (basicID.test(content) || content.trim() === 'ignore' || content.trim() === 'cloze') {
                return this.cardLeft + content + this.cardRight
            }

            const newDate = Math.floor(Date.now() * Math.random()).toString();
            const newContent = `${content.trimEnd()} b:${newDate}`
            return this.cardLeft + newContent + this.cardRight
        });

    }

    /**
     * returns card type based on header and basic or cloze
     */
    getMatchType(header: string, matchType: string) {
        if (header === 'ignore') return 'ignore'

        if (matchType === 'b') return 'basic'

        return 'cloze'
    }

    /** finds cards in MDContent and saves into individual objects */
    splitToCardsObject() {
        const cardRegex = new RegExp(
            `${this.cardLeft}\\s*([^]*?)\\s*(?:([bc]):(\\d+))?\\s*${this.cardRight}\\s*([^]*?)(?=${this.cardLeft}|$)`,
            "g"
        );

        for (const match of this.MDContent.matchAll(cardRegex)) {
            const header = match[1].trim();
            const type = this.getMatchType(header, match[2])
            const id = `${match[2]}:${match[3]}`
            const body = match[4];

            this.cards.push({
                header: header,
                type: type,
                MDContent: body,
                id: id
            });
        }
    }


    /**
     * converts individual card MDContent to HTMLContent
     */
    async convertAllToHTML() {
        for (const card of this.cards) {
            if (!card.MDContent) continue

            if (card.type === 'basic') {
                card.HTMLContent = await processorProd(card.MDContent, this.highlightBorder, 'basic')
            } else if (card.type === 'cloze') {
                card.HTMLContent = await processorProd(card.MDContent, this.highlightBorder, 'cloze')
            }

            if (!card.HTMLContent) {
                card.HTMLContent = ''
                continue
            }
            card.HTMLContent = card.HTMLContent.replace(/\n/g, '').replace(/\t/g, '')
        }
    }


    /**
     * converts card back to string to be saved to file
     */
    convertCardsToString(cards: Card[]) {
        let fileString = ''
        for (const card of cards) {
            const cardString = [card.id, card.header, card.HTMLContent, this.tags].map(v => v ?? "").join('\t')
            fileString = fileString + cardString + '\n'
        }
        return fileString
    }

    async saveBasicCards(filePath: string) {
        const basicCards = this.cards.filter(card => card.type === 'basic')
        const basicString = this.convertCardsToString(basicCards)

        await appendFile(filePath, basicString, 'utf-8')
    }

    async saveClozeCards(filePath: string) {
        const clozeCards = this.cards.filter(card => card.type === 'cloze')
        const clozeString = this.convertCardsToString(clozeCards)

        await appendFile(filePath, clozeString, 'utf-8')
    }
}


