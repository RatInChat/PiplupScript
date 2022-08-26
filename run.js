const fs = require('mz/fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide a .piplup file.");
        return;
    } else if (filename != `${filename.replace(".piplup", "")}.piplup`) {
        console.log("Please provide a .piplup file.")
        return;
    }
    const astFilename = filename.replace(".piplup", ".ast");
    const jsFilename = filename.replace(".piplup", ".js");
    const output = await myExec(`node parse.js ${filename}`);
    await myExec(`node generate.js ${astFilename}`);
    await myExec(`node ${jsFilename}`);
    await myExec(`rm ${astFilename}`);
    await myExec(`rm ${jsFilename}`);
}

async function myExec(command) {
    const output = await exec(command);
    if (output.stdout) {
        process.stdout.write(output.stdout);
    }
    if (output.stderr) {
        process.stdout.write(output.stderr);
    }
}

main().catch(err => console.log(err.stack));