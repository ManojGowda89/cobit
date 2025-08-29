const fs = require('fs');
const path = require('path');
const axios = require('axios');
const readline = require('readline');
const { writeCobitFile, getSnippetUrl } = require('./utils');

// Function to prompt user for visibility choice
function promptVisibility() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Select visibility [public/private] (default: public): ', (answer) => {
      rl.close();
      // Normalize the answer to lowercase and validate
      const visibility = answer.toLowerCase().trim();
      if (visibility === 'private') {
        resolve('private');
      } else {
        // Default to public for empty or invalid inputs
        resolve('public');
      }
    });
  });
}

module.exports = async function init(options) {
  try {
    // Parse options - handle both object input and direct arguments
    let fileName = null;
    let visibility = null; // Start with null to detect if we need to prompt
    
    if (typeof options === 'string') {
      fileName = options;
    } else if (options && typeof options === 'object') {
      fileName = options.fileName || null;
      visibility = options.visibility || null;
    }
    
    // If visibility not specified, prompt user to select
    if (!visibility) {
      visibility = await promptVisibility();
    }
    
    // Set default title
    const title = fileName ? path.basename(fileName) : 'Init';
    
    // Create initial file content
    let code = '// cobit initialized';
    
    // If fileName provided, create the file
    if (fileName && typeof fileName === 'string') {
      fs.writeFileSync(fileName, code, 'utf-8');
      console.log(`✅ Created file: ${fileName}`);
    }
    
    // Create a remote snippet
    const res = await axios.post(getSnippetUrl(), {
      title: title,
      description: 'Cobit repo initialized',
      code: code,
      visibility: visibility // Pass visibility to API
    });

    const repoId = res.data?.id;
    if (!repoId) {
      console.log('❌ Init failed: No ID returned from server.');
      return;
    }

    // Initialize .cobit with the file in staged if provided
    const staged = (fileName && typeof fileName === 'string') ? [fileName] : [];
    writeCobitFile({ 
      id: repoId, 
      visibility: visibility, 
      staged: staged, 
      commits: [] 
    });
    
    console.log(`✅ Cobit repo initialized. ID: ${repoId}`);
    console.log(`✅ Visibility set to: ${visibility}`);
    if (fileName && typeof fileName === 'string') {
      console.log(`✅ Added ${fileName} to staged files`);
    }
  } catch (err) {
    console.log('❌ Init failed:', err.response?.data || err.message);
  }
};