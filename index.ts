#!/usr/bin/env node

import { join } from "path";
import { readFile } from "fs/promises";
import { createDir, getAnkiPath, getAnkiUserPath, getMDFiles, getImageFiles, writeToFile, copyImageFiles, deleteDir } from "./lib/utils.ts";
import { AnkiCard, findTags } from "./lib/converter.ts";

import { program } from 'commander'

program
    .name("ankify")
    .description('CLI version of Ankify to convert markdown notes to anki cards')

program
    .option('-l, --listProfiles', 'list found Anki user profiles', false)
    .option('-u, --profile <USERNAME>', 'use Anki user profile')
    .option('-p, --MDPath <MDPATH>', 'path of markdown files to convert')
    .option('-i, --imagePath <IMAGEPATH>', 'path of images to copy')
    .option('-d, --delimiter <DELIMITER>', 'delimiter to use to separate cards', '\t')
    .option('--cardLeft <LEFT>', 'defines left side of card', '<!--')
    .option('--cardRight <RIGHT>', 'defines right side of card', '-->')
    .option('-w, --clozeWrap <CLOZE>', 'defines cloze wrap option', '==')
    .option('-c, --convert', 'triggers conversion', true)

if (!process.argv.slice(2).length) {
    program.help(); // print help if no argument is listed
}

program.parse()
const { listProfiles, profileName, delimiter, cardLeft, cardRight, clozeWrap, imagePath, MDPath } = program.opts()
let { convert } = program.opts()

const ankiPath = getAnkiPath()
const ankiUserPath = await getAnkiUserPath(ankiPath)
const ankiUser = profileName ? profileName : ankiUserPath[0]
const ankiMediaPath = join(ankiPath, ankiUser, "collection.media");
const imageSource = imagePath ? imagePath : MDPath

async function mainFunc() {
    const basicTXTPath = join(MDPath, "_txt", "basic.txt")
    const clozeTXTPath = join(MDPath, "_txt", "cloze.txt")
    let MDFileList = await getMDFiles(MDPath, true)
    await deleteDir(join(MDPath, "_txt"))
    await createDir(join(MDPath, "_txt"));

    const total = MDFileList.length
    let count = 0
    for (const file of MDFileList) {
        count++
        console.log(`converting ${count}/${total}: ${file}`);

        const fileContent = await readFile(file, "utf-8");
        const tags = findTags(fileContent);

        const cards = new AnkiCard(fileContent, delimiter, cardLeft, cardRight, clozeWrap, tags)

        // adds unique ID and save to original MD
        cards.addBasicID()
        cards.addClozeID()
        await writeToFile(file, cards.MDContent);

        cards.splitToCardsObject()

        if (!cards.cards || cards.cards.length === 0) continue

        await cards.convertAllToHTML()
        await cards.saveBasicCards(basicTXTPath)
        await cards.saveClozeCards(clozeTXTPath)
    }

    console.log("Moving images...")
    const imageFileList = await getImageFiles(imageSource)
    await copyImageFiles(imageFileList, ankiMediaPath);
    console.log("Finished")
}

if (listProfiles) {
    console.log('Found anki users:', ankiUserPath)
    convert = false
}

if (convert) {
    mainFunc()
}