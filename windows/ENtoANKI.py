import os
import glob2
import datetime
from pathlib import Path
from bs4 import BeautifulSoup
from jinja2 import Environment, FileSystemLoader

'''beautifulsoup for parsing out evernote notes'''

PATH = os.path.dirname(os.path.abspath(__file__))
os.chdir(PATH)
ANKI_PATH = os.path.join(Path.home(), 'Library', 'Application Support', 'Anki2', 'User 1', 'collection.media')
current_time = str(datetime.datetime.now().date()) + '_' + str(datetime.datetime.now().time()).replace(':', '.') + '_'    

def makefolder():
    '''makes html folder'''

    if not os.path.exists("_html"):
        print("Making html folder")
        os.mkdir("_html")

def soupify(FILE):
    '''parses initial soup'''

    with open(FILE, encoding='utf-8') as text:
        raw = text.read()
        soup = BeautifulSoup(raw, "html.parser")

    return soup

def create_import(soup):

    soup.body.hidden = True

    for img in soup.body.find_all('img'):
        img_urls = img['src']
        img_urls = img_urls.split('/')[-1]
        img_urls = current_time + img_urls
        img['src'] = img_urls
        # print(img['src'])

    html = soup.body
    html = str(html)
    html = html.replace('<div>{', '\n')
    html = html.replace('}</div>', '~')
    html = html.replace('\n', '', 1)
    
    return html

def writefile(filename, html_content):
    '''writes html to file'''

    with open(filename, 'w+', encoding='utf-8') as file:
        print(f"Converting {filename}")
        file.write(html_content)

def recursive():
    '''generates html for all md files'''

    html_files = glob2.glob('My Notes/*.html')
    for html_file in html_files:
        soup = soupify(html_file)
        folder, filename = os.path.split(html_file)
        filename, ext = os.path.splitext(filename)
        html_file = os.path.join('_html', filename + '.html')
        html = create_import(soup)
        writefile(html_file, html)


def move_images():
    '''moves images to anki directory'''

    imgs = glob2.glob('**/*.jpeg')
    imgs.extend(glob2.glob('**/*.png'))
    imgs.extend(glob2.glob('**/*.jpg'))
    imgs.extend(glob2.glob('**/*.gif'))
    imgs.extend(glob2.glob('**/*.tiff'))
    for img in imgs:
        img_folder, img_name = os.path.split(img) 
        img_name, img_ext = os.path.splitext(img_name) 
        dest = os.path.join(ANKI_PATH, current_time+ img_name + img_ext)
        os.rename(img, dest)
        # print(img, dest)

def main():
    makefolder()
    recursive()
    move_images()

if __name__ == "__main__":
    main()
