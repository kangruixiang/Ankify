const path = require("path");
const unified = require("unified");
const markdown = require("remark-parse");
const remark2rehype = require("remark-rehype");
const html = require("rehype-stringify");
const visit = require("unist-util-visit");
const remove = require("unist-util-remove");

const onlineURL = new RegExp("^(?:[a-z]+:)?//", "i");

function replaceURL() {
  return function (tree) {
    visit(tree, "image", (node) => {
      if (!node.url.match(onlineURL)) {
        let newURL = path.basename(node.url);
        node.url = newURL;
      }
    });
  };
}

function removeHeading() {
  return function (tree) {
    remove(tree, "heading");
  };
}

const processor = unified()
  .use(markdown)
  .use(replaceURL)
  .use(removeHeading)
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(html);

exports.default = processor;
