const { readCobitFile } = require('./utils');

module.exports = function status() {
  const c = readCobitFile();
  if (!c) {
    console.log('❌ No Cobit repo found here.');
    return;
  }
  console.log('📦 Cobit status');
  console.log('ID:       ', c.id);
  console.log('Staged:   ', (c.staged && c.staged.length) ? c.staged.join(', ') : '—');
  console.log('Commits:  ', (c.commits && c.commits.length) ? c.commits.length : 0);
  if (c.commits?.length) {
    const last = c.commits[c.commits.length - 1];
    console.log('Last commit:', last.id, `"${last.message}"`, 'files:', last.files.length);
  }
};
