const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const input_directory = core.getInput('input_directory');
    const output_file = core.getInput('output_file');

    const files = fs.readdirSync(input_directory).map((file) => path.join(input_directory, file));
    const annotations = files.reduce((acc, file) => {
      const rawReport = fs.readFileSync(file, 'utf8');
      const parsedReport = JSON.parse(rawReport);
      return [...acc, ...parsedReport];
    }, []);

    fs.writeFileSync(output_file, JSON.stringify(annotations, null, 2));
    core.setOutput('output_file', output_file);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
