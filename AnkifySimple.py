import os
import argparse
import re
import glob2
from mistune import Renderer, InlineGrammar, InlineLexer, Markdown


'''simple commandline ankify'''

card_left = '<!--'
card_right = '-->'
delimiter = '~'


class simple(Renderer):
    '''Renderer for Ankify'''

    def header(self, text, level, raw=None):
        return ''

    def image(self, src, title, alt_text):
        return f"<br><img src='{src}' alt='{alt_text}' /><br>"

    def newline(self):
        return ''

    def hrule(self):
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

    renderer = simple()  # Picks which generator to use, cloze or simple
    inline = HighlightsInlineLexer(renderer)
    inline.enable_highlights()
    md = Markdown(renderer=renderer, inline=inline)
    text = open(md_file, encoding='utf-8').read()
    html = md.render(text)
    html = html.replace('\n', '')
    html = html.replace(f'{card_left}', '\n')
    html = html.replace(f'{card_right}', f'{delimiter}')
    # html = html.replace('<hr>\n', '', 1)
    html = html.replace('<p>\n', '', 1)
    # html = html.replace('\n', '', 1)
    # html = html.replace('images/', '')
    return html


def makefolder():
    '''makes html folder'''
    if not os.path.exists('_html'):
        print("Making html folder")
        os.mkdir("_html")


def writefile(html_content, folder):
    '''writes html to file'''

    htmlFile = os.path.join(folder, 'anki.html')
    with open(htmlFile, 'a', encoding='utf-8') as file:
        file.write(html_content)


def recursive(folder):
    '''generates html for all md files'''

    md_files = glob2.glob(os.path.join(folder, '*.md'))
    print("Converting file")
    for md_file in md_files:
        html_content = singlecard(md_file)
        # print(html_file, html_content)
        writefile(html_content, folder)


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('folder', action='store',
                        help='folder name')
    return parser.parse_args()


def deleteline():
    '''deletes first line'''

    with open('file.txt', 'r') as fin:
        data = fin.read().splitlines(True)
    with open('file.txt', 'w') as fout:
        fout.writelines(data[1:])


def main():
    args = parse_args()
    folder = args.folder
    recursive(folder)


if __name__ == '__main__':
    main()
