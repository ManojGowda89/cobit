const { readCobitFile, writeCobitFile } = require('./utils');

module.exports = function commit(message) {
  const cobit = readCobitFile();
  if (!cobit) {
    console.log('❌ No Cobit repo found. Run `cobit init` first.');
    return;
  }

  if (!cobit.staged || cobit.staged.length === 0) {
    console.log('❌ No files staged. Use `cobit add <file>`.');
    return;
  }

  const commitId = Date.now();
  // Keep all staged (but push will only use the first)
  const files = [...cobit.staged];

  cobit.commits.push({ id: commitId, message, files });
  cobit.staged = []; // clear staging after commit
  writeCobitFile(cobit);

  console.log(`✅ Commit ${commitId} created: "${message}"`);
  console.log(`   Files: ${files.join(', ')}`);
};
