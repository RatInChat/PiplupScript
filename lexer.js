#!/usr/bin/env node
const moo = require('moo');

let lexer = moo.compile({
    WS: /[ \t]+/,
    comment: /\/\/.*?$/,
    multilineComment: {
        match: /\/\*[\s\S]*?\*\//,
        lineBreaks: true
    },
    number: /0|[1-9][0-9]*/,
    string: /"(?:\\["\\]|[^\n"\\])*"/,
    lparen: '(',
    rparen: ')',
    lbrace: '{',
    rbrace: '}',
    identifier: /[a-zA-Z_][a-zA-Z_0-9]*/,
    class_call: /[A-Z_][a-zA-Z_0-9]*/,
    fatarrow: '=>',
    asign: '=',
    NL: { match: /\n/, lineBreaks: true },
});

module.exports = lexer;
