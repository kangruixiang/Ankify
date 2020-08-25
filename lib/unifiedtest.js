var unified = require("unified");
var markdown = require("remark-parse");
var remark2rehype = require("remark-rehype");
var html = require("rehype-stringify");
var find = require("unist-util-find");
var remark = require("remark");

remark()
  .use(function () {
    return transformer;

    function transformer(tree) {
      find(tree, "emphasis", function (node, index, parent) {
        console.log(node.type, index, parent.type);
      });
    }
  })
  .process("Some _emphasis_, **strongness**, _more emphasis_, and `code`.");
