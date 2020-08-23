var unified = require("unified");
var markdown = require("remark-parse");
var remark2rehype = require("remark-rehype");
var html = require("rehype-stringify");

unified()
  .use(markdown)
  .use(remark2rehype)
  .use(html)
  .process("# Hello world!", function(err, file) {
    if (err) {
      console.log(err);
    }
    console.log(String(file));
  });
