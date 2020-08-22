---
typora-copy-images-to: images

---

[toc]

# Introduction

Ankify allows you to convert your markdown notes into Anki cards. By using a predefined template as the container for the front of the card, the content that comes after become the back of the card. 

Here’s an example card in markdown format:

![image-20200818212923975](images/image-20200818212923975.png)

The text within `<!--` and `-->` becomes the front of the card, while the bullet points that come after become the back of the card. When you run Ankify, it generates an html file. You can then import the file into Anki. This would become the result card:

![image-20200818214259292](images/image-20200818214259292.png)



# Todo

- [ ] Add anki user profile folder
- [ ] Add custom basic card definition
- [ ] Add cloze deletion
- [ ] User GUI
- [ ] Option to upload images

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

# Making Cards

## Simple Card

In any note, make a card using html comment `<!-- -->` notation. The content inside `<!-- -->` will become the front of the anki card on rendering. The content following the comment will become the back of the card. 

![image-20200821110733970](images/image-20200821110733970.png)

The best way to quickly type in the `<!-- -->` is to use a text expander. I have it set up so that `,,` corresponds to `<!--` and that `..` corresponds to `-->`.

Anki uses first field to check for duplicates, which is what's inside  `<!-- -->`. If you change the text inside the comment, Anki will import a new card instead. On the other hand, if you change the content after the comment, Anki will update the card instead.

Headers are ignored.

## Using Html Comments

Original Ankify used `{{}}` to define the front of the card. I found this leaves the front of the card visible when rendered to html:

![Group 2](images/Group 3.jpg)

- Left: editor mode; right: rendered mode

In the current version of Anki, html comment `<-- -->` is used as card front. The front of the card disappears on rendering to html. This is especially useful when publishing notes online:

![Group 2](images/Group 2.jpg)

- Left: editor mode; right: rendered mode showing html comments not visible


## Notes Without a Card

Notes without any cards will be ignored. 

## Multiple Cards in a Note

To have multiple cards in a note, simply add more `<-- -->` blocks. The content of each cards ends once a new card begins. For example, the following note will render two cards:

![image-20200821105929352](images/image-20200821105929352.png)

## Exclude Contents in a Note

Sometimes you want to exclude parts of the note from being made into a card. I use a ignore card to make this happen. In the following example, only the first and third cards are made:

![image-20200821110140560](images/image-20200821110140560.png)

This is because of first field match that Anki uses. If you have multiple ignore cards, Anki will use the last one instead of importing multiple.



