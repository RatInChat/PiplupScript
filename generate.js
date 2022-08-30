#!/usr/bin/env node

const fs = require("mz/fs");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Generator Error. (try to reinstall PiplupScript?)");
        return;
    }
    
    const astJson = (await fs.readFile(filename)).toString();
    const runtimeJs = (await fs.readFile("runtime.js")).toString();
    const statements = JSON.parse(astJson);
    const jsCodeBeforeEdit = runtimeJs + "\n" + generateJsForStatements(statements);
    const outputFilename = filename.replace(".ast", ".js");
    const jsCode = await jsCodeBeforeEdit.replace(/pip, /g, "");
    await fs.writeFile(outputFilename, jsCode);
}

function generateJsForStatements(statements) {
    const lines = [];
    for (let statement of statements) {
        const line = generateJsForStatementOrExpr(statement);
        lines.push(line);
    }
    return lines.join("\n");
}

function generateJsForStatementOrExpr(node) {
    if (node.type === "var_assign") {
        const varName = node.var_name.value;
        const jsExpr = generateJsForStatementOrExpr(node.value);
        const js = `var ${varName} = ${jsExpr};`;
        return js;
    } else if (node.type === "const_assign") {
        const constName = node.const_name.value;
        const jsExpr = generateJsForStatementOrExpr(node.value);
        const js = `const ${constName} = ${jsExpr};`;
        return js;
    } else if (node.type === "fun_call") {
        let funName = node.fun_name.value;
        if (funName === "if") {
            funName = "$if";
        }
        const argList = node.arguments.map((arg) => {
            const jsCode = generateJsForStatementOrExpr(arg);
                return jsCode;
        }).join(", ");
        return `${funName}(${argList})`;
    } else if (node.type === "string") {
        return node.value;
    } else if (node.type === "number") {
        return node.value;
    } else if (node.type === "identifier") {
        return node.value;
    } else if (node.type === "lambda") {
        const paramList = node.parameters
            .map(param => param.value)
            .join(", ");
        const jsBody = node.body.map((arg, i) => {
            const jsCode = generateJsForStatementOrExpr(arg);
                if (i === node.body.length - 1) {
                    return "return " + jsCode + ";";
                } else {
                    return jsCode;
                }
        }).join(";\n");
        return `function (${paramList}) {\n${indent(jsBody)}\n} \n`;
    } else if (node.type == "function") {
        const paramList = node.parameters
            .map(param => param.value)
            .join(", ");
        const jsBody = node.body.map((arg, i) => {
            const jsCode = generateJsForStatementOrExpr(arg);
                if (i === node.body.length - 1) {
                    return "return " + jsCode + ";";
                } else {
                    return jsCode;
                }
        }).join(";\n");
        let functionName = node.func_name.value;
        return `function ${functionName}(${paramList}) {\n${indent(jsBody)}\n} \n`;
    } else if (node.type === "comment") {
        return `${node.value}`;
    // } else if (node.type === "if_statement") {
    //     const paramList = node.parameters
    //         .map(param => param.value)
    //         .join(", ");
    //     const jsBody = node.body.map((arg) => {
    //         const jsCode = generateJsForStatementOrExpr(arg);
    //         return jsCode;
    //     })
    //     return `if (${paramList}) {\n${jsBody}\n} \n`;
    } else if (node.type === "import") {
        const importName = node.import_name.value;
        const jsExpr = generateJsForStatementOrExpr(node.value);
        const js = `const ${importName} = require(${jsExpr});`;
        return js;
    } else if (node.type === "var_call") {
        return;
    }  else {
        throw new Error(`Syntax Error.`);
    }}

function indent(string) {
    return string.split('\n').map(line => "    " + line).join('\n');
}
main().catch(err => console.log(err.stack));
