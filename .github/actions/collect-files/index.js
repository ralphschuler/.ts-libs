const core = require('@actions/core');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const pattern = core.getInput('pattern');
    const output_directory = core.getInput('output_directory') || `./${Buffer.from(new Date().toISOString()).toString('base64')}`;

    console.log(`Collecting files matching '${pattern}' into '${target}'`);

    glob(pattern, {}, (err, files) => {
        if (err) throw err;
        files.forEach((file, index) => {
            const targetPath = path.resolve(output_directory, `${index}-${path.basename(file)}`);
            fs.copyFileSync(file, targetPath);
            console.log(`Copied '${file}' to '${targetPath}'`);
        });
    });

    console.log('Collection complete.');
    core.setOutput('output_directory', output_directory);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
