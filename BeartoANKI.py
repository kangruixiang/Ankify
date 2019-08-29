import re
import os
import datetime
from pathlib import Path
import glob2
import mistune

PATH = os.path.dirname(os.path.abspath(__file__))
os.chdir(PATH)
ANKI_PATH = os.path.join(Path.home(), 'Library', 'Application Support', 'Anki2', 'User 1', 'collection.media')
current_time = str(datetime.datetime.now().date()) + '_' + str(datetime.datetime.now().time()).replace(':', '.') + '_'    

class simple(mistune.Renderer):
    '''generates simple and reverse cards using link as divider'''

    def header(self, text, level, raw=None):
        return ''

    def image(self, src, title, alt_text):
        src = src.split('/')
        src = current_time + src[1]
        # print(src)
        return f"<br><img src='{src}' alt='{alt_text}' /><br>"

    # def link(self, link, title, content):
    #     return f'`{link}~\n'

    def newline(self):
        return ''

def singlecard(md_file):
    '''converts single md file'''

    renderer = simple() #Picks which generator to use, cloze or simple
    md = mistune.Markdown(renderer=renderer)
    text = open(md_file, encoding='utf-8').read()
    html = md.render(text)
    html = html.replace('\n', '')
    # html = html.replace('<p>', '\n<p>')
    html = html.replace('{', '\n')
    html = html.replace('}', '~')
    html = html.replace('<p>\n', '', 1)
    # html = html.replace('\n', '', 1)
    html = html.replace('images/', '')
    return html

def makefolder():
    '''makes html folder'''

    if not os.path.exists("_html"):
        print("Making html folder")
        os.mkdir("_html")

def writefile(html_file, html_content):
    '''writes html to file'''

    with open(html_file, 'w+', encoding='utf-8') as file:
        print(f"Converting {html_file}")
        file.write(html_content)

def recursive():
    '''generates html for all md files'''

    md_files = glob2.glob('*.md')
    for md_file in md_files:
        folder, filename = os.path.split(md_file)
        filename, ext = os.path.splitext(filename)
        html_file = os.path.join(folder, '_html', filename + '.html')
        html_content = singlecard(md_file)
        # print(html_file, html_content)
        writefile(html_file, html_content)

def move_images():
    '''moves images to anki directory'''

    imgs = glob2.glob('**/*.jpg')
    imgs.extend(glob2.glob('**/*.png'))
    imgs.extend(glob2.glob('**/*.jpeg'))
    imgs.extend(glob2.glob('**/*.gif'))
    for img in imgs:
        img_folder, img_name = os.path.split(img)
        img_name, img_ext = os.path.splitext(img_name) 
        dest = os.path.join(ANKI_PATH, current_time+ img_name + img_ext)
        os.rename(img, dest)
        # print(img, dest)


def deleteline():
    '''deletes first line'''

    with open('file.txt', 'r') as fin:
        data = fin.read().splitlines(True)
    with open('file.txt', 'w') as fout:
        fout.writelines(data[1:])


def main():
    makefolder()
    recursive()
    move_images()

if __name__ == '__main__':
    main()
