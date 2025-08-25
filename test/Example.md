# Heading example. It will not show up when converted to cards

Tags: #tag1, #tag-with-dash, #tag/with/slash

<!-- This is the front of the first basic card b:102784606919-->

This is the back of the first card. Ankify will keep adding to this card until you reach another card. 

You can have multiple paragraphs in each card. 

When you click Convert in Ankify, an automatic ID will be added to the front of each card. This will let Anki know on each import to update the existing card instead of importing a new one. 

There will be three types tags added to each card: the folder the file is in, the filename, and tags inside the file.

## Subheading example

<!-- This is the front of the second basic card b:1480632795367-->

You can have ==highlights== in basic cards. You can also have **bold** texts, *italic* texts, or ***both***.

- `==highlight==`
- `**bold**`
- `*italic*`
- `***both bold and italic***`

You can have lists:
- list item 1
- list item 2
  - sublist
	  - sub-sublist

And [links](http://google.com), and wikiLinks [[this is a wikilink]].

---

- [ ] To do lists works too
- [x] Checked todo 

You can have images:

![](images/20220306_221723.jpg) 
![](images/20220306 221723.jpg) // images with space in file name
![](http://google.com/images/20220306_221723.jpg) //remote images
![[wikiImageLinks.jpg]]
- I like to add captions like this.

Basic tables work ok but become harder to edit the more complicated they are:

|     Column 1    |             Column 2            |
|-----------------|---------------------------------|
|tables are tough | because the format is difficult |

If I have a complicated table, I just add a screenshot of it instead. 

You can learn more about markdown references from [Typora](https://support.typora.io/Markdown-Reference/). 

## Ignore Cards

<!-- ignore -->

This is a ignore card. It will not be converted to an Anki card.

I use ignore cards to skip parts of the texts when making cards. This is also great for [incremental reading](https://en.wikipedia.org/wiki/Incremental_reading). I would make cards up to one point and make an ignore card for the rest of the document. After studying the previous cards, I would go back and make more. 

## Cloze

Make cloze cards by using the word `cloze` inside the front of the card:

<!-- c:310864128579-->

Use ==highlights== within a cloze card to make ==cloze==. All highlights without numbers will be converted to ==one card==. 

<!-- c:1596942067 -->

Use ==1.number followed by period== within a highlight in a cloze card to make ==2.multiple cards from cloze deletions==. You can make ==3.as many as you want==. This is all done with readability in mind within the document. There is minimum amount of distraction from actual reading/writing. 

Images will work inside cloze deletions but can be tough to see in your markdown file.

==![](images/20220306_221723.jpg)== 

