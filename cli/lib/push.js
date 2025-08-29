const fs = require('fs');
const axios = require('axios');
const { ensureRepoOrExit, getSnippetUrl } = require('./utils');

module.exports = async function push() {
  const cobit = ensureRepoOrExit();
  if (!cobit.commits || cobit.commits.length === 0) {
    console.log('❌ Nothing to push. Make a commit first.');
    return;
  }

  // Push latest commit only (fits single-snippet model)
  const latest = cobit.commits[cobit.commits.length - 1];

  if (!latest.files || latest.files.length === 0) {
    console.log('❌ Latest commit has no files.');
    return;
  }

  const filename = latest.files[0];
  if (!fs.existsSync(filename)) {
    console.log(`❌ File missing locally: ${filename}`);
    return;
  }

  const code = fs.readFileSync(filename, 'utf-8');
  const title = filename;
  const description = latest.message;

  try {
    const res = await axios.put(getSnippetUrl(cobit.id), {
      title,
      description,
      code
    });

    console.log(`✅ Pushed to ${cobit.id}`);
    console.log(`   Title: ${res.data?.title}`);
    console.log(`   UpdatedAt: ${res.data?.updatedAt || '—'}`);
  } catch (err) {
    console.log('❌ Push failed:', err.response?.data || err.message);
  }
};
