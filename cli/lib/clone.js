const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { writeCobitFile, getSnippetUrl } = require('./utils');

module.exports = async function clone(repoId) {
  const repoPath = process.cwd(); // current folder

  try {
    const res = await axios.get(getSnippetUrl(repoId));
    const snippet = res.data;

    if (!snippet || !snippet.id) {
      console.log('❌ Clone failed: snippet not found.');
      return;
    }

    // Decide local filename
    let filename = (snippet.title || 'snippet').trim();
    if (!path.extname(filename)) {
      filename += '.txt';
    }

    // Write code file directly into current folder
    const filePath = path.join(repoPath, filename);
    if (fs.existsSync(filePath)) {
      console.log(`⚠️ File already exists, overwriting: ${filename}`);
    }
    fs.writeFileSync(filePath, snippet.code || '', 'utf-8');

    // Update or create .cobit
    const cobitFilePath = path.join(repoPath, '.cobit');
    let cobit = { id: repoId, staged: [], commits: [] };

    if (fs.existsSync(cobitFilePath)) {
      const existing = JSON.parse(fs.readFileSync(cobitFilePath, 'utf-8'));
      cobit = { ...existing, id: repoId }; // keep existing staged/commits
    }

    fs.writeFileSync(cobitFilePath, JSON.stringify(cobit, null, 2));

    console.log(`✅ Cloned snippet ${repoId} into current folder: ${filename}`);
  } catch (err) {
    console.log('❌ Clone failed:', err.response?.data || err.message);
  }
};
