const axios = require('axios');
const { writeCobitFile, getSnippetUrl } = require('./utils');

module.exports = async function init() {
  try {
    // Create a remote snippet with dummy data, get back an ID
    const res = await axios.post(getSnippetUrl(), {
      title: 'Init',
      description: 'Cobit repo initialized',
      code: '// cobit initialized'
    });

    const repoId = res.data?.id;
    if (!repoId) {
      console.log('❌ Init failed: No ID returned from server.');
      return;
    }

    writeCobitFile({ id: repoId, staged: [], commits: [] });
    console.log(`✅ Cobit repo initialized. ID: ${repoId}`);
  } catch (err) {
    console.log('❌ Init failed:', err.response?.data || err.message);
  }
};
