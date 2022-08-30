#!/usr/bin/env node
const nearley = require("nearley");
const grammar = require("./piplup.js");
const fs = require("mz/fs");
// Create a Parser object from our grammar.

async function main() {

    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide a .piplup file.");
        return;
    } else if (filename != `${filename.replace(".piplup", "")}.piplup`) {
        console.log("Please provide a .piplup file.")
        return;
    }
    const code = (await fs.readFile(filename)).toString();

    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    // Parse something!
    parser.feed(code);
    if (parser.results.length > 1){
        console.log("Syntax Error.");
    } else if (parser.results.length == 1) {
    // parser.results is an array of possible parsings.
        const ast = parser.results[0];
        const outputFilename = filename.replace(".piplup", ".ast");
        await fs.writeFile(outputFilename, JSON.stringify(ast, null, "  "));
    } else {
        console.log("Error: no parse found.");
    }
}

main().catch(err => console.log(err.stack));
