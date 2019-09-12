import copy, re
from mistune import Renderer, InlineGrammar, InlineLexer, Markdown

class WikiLinkRenderer(Renderer):
    def wiki_link(self, text):
        return f'<mark>{text}</mark>' 

class WikiLinkInlineLexer(InlineLexer):
    def enable_wiki_link(self):
        # add wiki_link rules
        self.rules.wiki_link = re.compile(
            r'=='                   # [[
            r'([\s\S]+?)'   # Page 2|Page 2
            r'=='             # ]]
        )

        # Add wiki_link parser to default rules
        # you can insert it some place you like
        # but place matters, maybe 3 is not good
        self.default_rules.insert(1, 'wiki_link')

    def output_wiki_link(self, m):
        text = m.group(1)
        # you can create an custom render
        # you can also return the html if you like
        return self.renderer.wiki_link(text)

renderer = WikiLinkRenderer()
inline = WikiLinkInlineLexer(renderer)
# enable the feature
inline.enable_wiki_link()
markdown = Markdown(renderer, inline=inline)
text = '==Works only== for Mac as of now. Will add Windows version later.'
html = markdown.render(text)
print(html)