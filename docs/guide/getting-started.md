# Getting Started

Ankify works great but requires a bit of a setup in the beginning. 

## Installation



## Setting up Configuration

First, you need to tell Ankify where to look for the image folder and your Anki profile location. Create a config.json file in the folder with your markdown files and add the following lines, where “attachmentFolder” is where you keep your image folder and “ankiProfile” the name of your Anki profile folder:

```
{
  "attachmentFolder": "D:\\Drive\\My-Notes\\Attachments",
  "ankiProfile": "Anki2\\User 1"
}
```

The default profile folder for Anki is “User 1”. 

## Running the Script

Open up command prompt and navigate to the folder with your markdown file. For example, if "D:\\Drive\\My-Notes\\" were the folder where you keep your markdown files, you would type:

```
cd "D:\\Drive\\My-Notes"
```

Then type in ankify and enter to run the script:

```
ankify
```

Alternatively, you could also add the path to your notes folder without first navigating to your folder with the following command:

```
ankify -p "D:\\Drive\\My-Notes"
```

The script does several things:

1. copies all the images to anki media folder
2. makes an html folder inside your markdown folder
3. converts all of the markdown files into one html file

## Setting up Anki

Now you have the html file that you can use to import to Anki. Use the following settings in Anki (you can change the deck):

![1567041846443](images/1567041846443.png)