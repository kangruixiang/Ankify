import re, os, shutil, datetime, copy
import glob2
from mistune import Renderer, InlineGrammar, InlineLexer, Markdown
from Preference import mac_ANKI_PATH, win_ANKI_PATH, card_left, card_right, delimiter


anki_path = win_ANKI_PATH
current_time = str(datetime.datetime.now().date()) + '_' + str(datetime.datetime.now().time()).replace(':', '.') + '_'    


class simple(Renderer):
    '''Renderer for Ankify'''

    def header(self, text, level, raw=None):
        return ''

    def image(self, src, title, alt_text):
        if src.startswith('http') == False:
            src = src.split('/')
            src = current_time + src[1]
        # print(src)
        return f"<br><img src='{src}' alt='{alt_text}' /><br>"

    def newline(self):
        return ''

    def highlights(self, alt, text):
        '''generates hightlights into mark html'''

        return f'{alt}<mark>{text}</mark>' 
 

class HighlightsInlineLexer(InlineLexer):
    '''class for highlights'''

    def enable_highlights(self):
        # add highlights rules
        self.rules.highlights = re.compile(r'^([\s\S]+?)(==)([\s\S]+?)(==)')
        self.default_rules.insert(1, 'highlights')

    def output_highlights(self, m):
        alt = m.group(1)
        text = m.group(3)
        return self.renderer.highlights(alt, text)


def singlecard(md_file):
    '''converts single md file'''

    renderer = simple() #Picks which generator to use, cloze or simple
    inline = HighlightsInlineLexer(renderer)
    inline.enable_highlights()
    md = Markdown(renderer=renderer, inline=inline)
    text = open(md_file, encoding='utf-8').read()
    html = md.render(text)
    html = html.replace('\n', '')
    html = html.replace(f'{card_left}', '\n')
    html = html.replace(f'{card_right}', f'{delimiter}')
    html = html.replace('<p>\n', '', 1)
    html = html.replace('images/', '')
    return html

def makefolder():
    '''makes html folder'''
    if not os.path.exists('_html'):
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
        dest = os.path.join(anki_path, current_time+ img_name + img_ext)
        shutil.copy(img, dest)
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
