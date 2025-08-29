const fs = require('fs');
const path = require('path');
const { readCobitFile, writeCobitFile } = require('./utils');

module.exports = function add(filenames) {
  const cobit = readCobitFile();
  if (!cobit) {
    console.log('❌ No Cobit repo found. Run `cobit init` first.');
    return;
  }

  // ensure filenames is always an array
  if (!Array.isArray(filenames)) filenames = [filenames];

  const toStage = [];

  for (const f of filenames) {
    const filePath = path.resolve(f);

    // Validation: must exist, be a file, and be readable
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Skipping: file does not exist -> ${f}`);
      continue;
    }
    if (!fs.statSync(filePath).isFile()) {
      console.log(`⚠️ Skipping: not a file -> ${f}`);
      continue;
    }
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
    } catch {
      console.log(`⚠️ Skipping: not readable -> ${f}`);
      continue;
    }

    // Already staged?
    if (!cobit.staged.includes(f)) {
      toStage.push(f);
    }
  }

  if (!toStage.length) {
    console.log('ℹ️ Nothing new to stage.');
    return;
  }

  cobit.staged.push(...toStage);
  writeCobitFile(cobit);

  console.log(`✅ Staged: ${toStage.join(', ')}`);
  if (cobit.staged.length > 1) {
    console.log('⚠️ Note: Cobit pushes only the FIRST staged file (API is single-snippet).');
  }
};
