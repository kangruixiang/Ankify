import os from "os";
import { join, basename } from "path";
import { existsSync } from "fs";
import { readdir, mkdir, copyFile, writeFile, rm } from "fs/promises";
import { glob } from "glob";


// Types for the result object with discriminated union
type Success<T> = {
    data: T;
    error: null;
};

type Failure<E> = {
    data: null;
    error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error>(
    promise: Promise<T>,
): Promise<Result<T, E>> {
    try {
        const data = await promise;
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as E };
    }
}

/** Returns the anki path of the user based on operating system */
export function getAnkiPath() {
    // sets anki path based on system
    if (os.platform() === "win32") {
        return join(process.env.APPDATA ?? "", "Anki2");
    }

    if (os.platform() === 'darwin') {
        return join(
            process.env.HOME ?? "",
            "Library", "Application Support", "Anki2"
        )
    }

    if (os.platform() === "linux") {
        const home = process.env.HOME ?? os.homedir();

        const candidates = [
            // XDG base directory spec
            process.env.XDG_DATA_HOME ? join(process.env.XDG_DATA_HOME, "Anki2") : null,
            // default local share
            join(home, ".local", "share", "Anki2"),
            // flatpak
            join(home, ".var", "app", "net.ankiweb.Anki", "data", "Anki2"),
            // snap
            join(home, "snap", "anki", "current", ".local", "share", "Anki2"),
        ].filter(Boolean) as string[];

        for (const path of candidates) {
            if (existsSync(path)) {
                return path;
            }
        }

        throw Error('Could not find Anki Path.')
    }

    throw Error('Could not detect correct OS.')
}

/**
 * Returns anki user path in addon21
 */
export async function getAnkiUserPath(ankiPath: string) {
    const { data: ankiPathFolders, error } = await tryCatch(readdir(ankiPath, { withFileTypes: true }))

    if (error) {
        throw Error("Error reading Anki Path", error)
    }

    if (ankiPathFolders.length === 0) {
        throw Error("No user found")
    }

    const ankiUserPath = ankiPathFolders.filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .filter((dirent) => dirent !== "addons21" && dirent !== 'logs');

    if (ankiUserPath.length === 0) {
        throw Error("No user found")
    }

    return ankiUserPath
}

/**
 * Gets list of markdown files from folder, recursively as option
 */
export async function getMDFiles(folderPath: string, recursive: boolean) {
    if (recursive) {
        return await glob(
            join(folderPath, "**", "*.md").replace(/\\/g, "/")
        );
    }

    return await glob(
        join(folderPath, "**", "*.md").replace(/\\/g, "/")
    );
}

/**
 * Gets list of images from folder recursively
 */
export async function getImageFiles(folderPath: string) {
    return await glob(
        join(folderPath, "**", "*.+(jpg|jpeg|gif|png|webp)").replace(/\\/g, "/")
    );
}

/**
 * Write content to file
 */
export async function writeToFile(filePath: string, fileData: string) {
    const { data, error } = await tryCatch(writeFile(filePath, fileData, "utf8"))

    if (error) {
        throw Error(`Error writing to file: ${filePath}`)
    }

    return data
}

/**
 * Creates folder if not already exists
 */
export async function createDir(folderPath: string) {
    if (existsSync(folderPath)) return

    const { data, error } = await tryCatch(mkdir(folderPath))

    if (error) {
        throw Error(`Error making folder: ${folderPath}`)
    }

    return data
}

/**
 * Deletes folder if exists
 */
export async function deleteDir(folderPath: string) {
    if (!existsSync(folderPath)) return

    const { data, error } = await tryCatch(rm(folderPath, { recursive: true, force: true }))

    if (error) {
        throw Error(`Error deleting folder: ${folderPath}`)
    }

    return data
}


/**
 * Copies image files to folder
 */
export async function copyImageFiles(images: string[], destFolder: string) {
    for (const image of images) {
        const imgName = basename(image);
        if (!imgName) return

        const destImage = join(destFolder, imgName);

        if (existsSync(destImage)) return

        await copyFile(image, destImage);
    }
}

// /**
//  * Takes string and separates into array by line then into card properties
//  */
// export function arrayOfObjectsToString(data, addToString) {
//     data.forEach((item) => {
//         item.type == "cloze" // if cloze, deletes the ID and note type. Otherwise just note type
//             ? delete item.basicID && delete item.type
//             : delete item.type;
//         let card = Object.values(item).join("\t");
//         addToString
//             ? (addToString = addToString + "\n" + card)
//             : (addToString = card);
//     });
//     return addToString;
// }

