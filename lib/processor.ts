import { basename } from "path";
import { marked } from "marked";

const re = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm
const remoteURL = new RegExp(re, "i");

export async function processorProd(MDData: string, border: string, cardType: 'cloze' | 'basic') {
    const renderer = {
        heading({ tokens, depth }) {
            return ""
        },
        image({ href, text }) {
            if (href.match(remoteURL)) {
                return `<img src="${href}" alt="${text}">`
            }

            const localHref = basename(href)
            return `<img src="${localHref}" alt="${text}">`
        },
        text({ text }: { text: string }) {
            const TyporaRegex = /(!\[[^\]]*\])\(([^)]+)\)/g
            const wikiImgRegex = /!\[\[(.*?)\]\]/g
            const highlightRegexString = `${border}([\\s\\S]+?)${border}`
            const highlightRegex = new RegExp(highlightRegexString, 'g')

            const typoraContent = text.replace(TyporaRegex, (_, alt, url) => {
                return `${alt}(${url.trim().replace(/ /g, "%20")})`
            });

            const wikiContent = typoraContent.replace(wikiImgRegex, (_, url) => {
                const trimmed = url.trim();
                const newURL = trimmed.replace(/ /g, "%20");
                return `![${trimmed}](${newURL})`;
            });

            const highlightContent = wikiContent.replace(highlightRegex, (match, inner) => {
                if (cardType === 'basic') {
                    return `<mark>${inner.trim()}</mark>`;
                }

                const clozeMatch = inner.match(/^(\d+)\.(.+)$/s);
                if (clozeMatch) {
                    const [, digit, content] = clozeMatch;
                    return `{{c${digit}::${content.trim()}}}`;
                }
                // No digit, default to {{c1::...}}
                return `{{c1::${inner.trim()}}}`;
            });

            return highlightContent
        }
    }
    marked.use({ renderer })
    return await marked.parse(MDData)
}

// export function processor(data) {
//     const renderer = {
//         heading(text, level) {
//             return ""
//         },
//         image(href, title, text) {
//             if (href.match(remoteURL)) {
//                 console.log('online URL found', href)
//                 return `<img src="${href}" alt="${text}">`
//             } else {
//                 let newHref = join(tempImgFolder, basename(href))
//                 console.log("img processor", newHref)
//                 return `<img src="${newHref}" alt="${text}">`
//             }
//         }
//     }
//     marked.use({ renderer })
//     return marked.parse(data)
// }


