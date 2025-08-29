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
    let cobit = { 
      id: repoId, 
      visibility: snippet.visibility || 'public',  // Store visibility from snippet
      staged: [filename], 
      commits: [] 
    };

    if (fs.existsSync(cobitFilePath)) {
      const existing = JSON.parse(fs.readFileSync(cobitFilePath, 'utf-8'));
      cobit = { 
        ...existing, 
        id: repoId,
        visibility: snippet.visibility || existing.visibility || 'public', // Use existing if available
        // Add the cloned file to staged if not already there
        staged: existing.staged.includes(filename) 
          ? existing.staged 
          : [...existing.staged, filename]
      };
    }

    writeCobitFile(cobit);

    console.log(`✅ Cloned snippet ${repoId} into current folder: ${filename}`);
    console.log(`✅ Added ${filename} to staged files`);
  } catch (err) {
    console.log('❌ Clone failed:', err.response?.data || err.message);
  }
};