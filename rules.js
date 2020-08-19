function card() {
  let highlighter = {
    type: "lang",
    regex: /(==)([\s\S]+?)(==)/s,
    replace: "<mark>$2</mark>",
  };
  let noHeader = {
    type: "lang",
    regex: /^#+.*\n/gm,
    replace: "",
  };
  return [noHeader, highlighter];
}

exports.card = card;
