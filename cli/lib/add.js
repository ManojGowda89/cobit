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

  let toStage = [];

  // Handle special case for 'cobit add .'
  if (filenames.includes('.')) {
    // If we have a cloned file, prioritize adding that
    if (cobit.id && cobit.staged.length === 0) {
      // Look for the likely cloned file
      const files = fs.readdirSync(process.cwd())
        .filter(file => fs.statSync(path.join(process.cwd(), file)).isFile())
        .filter(file => file !== '.cobit');
      
      if (files.length > 0) {
        // We'll assume the first non-hidden file is the one we want
        const clonedFile = files.find(file => !file.startsWith('.')) || files[0];
        console.log(`📄 Found cloned file: ${clonedFile}`);
        toStage.push(clonedFile);
      }
    } else {
      // Get all files in current directory, excluding dotfiles and directories
      const allFiles = fs.readdirSync(process.cwd())
        .filter(file => !file.startsWith('.') && fs.statSync(path.join(process.cwd(), file)).isFile());
      
      // Filter out files that are already staged
      toStage = allFiles.filter(file => !cobit.staged.includes(file));
    }
  } else {
    // Process specific files
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