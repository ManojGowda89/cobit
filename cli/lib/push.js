const fs = require('fs');
const axios = require('axios');
const readline = require('readline');
const { ensureRepoOrExit, getSnippetUrl } = require('./utils');

// Function to prompt for credentials
function promptCredentials() {
  return new Promise((resolve) => {
    // Create readline interface only when needed
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Email: ', (email) => {
      rl.question('Password: ', (password) => {
        // Always close the readline interface after getting input
        rl.close();
        resolve({ email, password });
      });
    });
  });
}

// Function to check if token exists and is valid
async function verifyToken(token) {
  try {
    const res = await axios.get('https://cobit.manojgowda.in/api/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.data.valid ? res.data : false;
  } catch (err) {
    return false;
  }
}

// Function to login and get token
async function login() {
  console.log('Please login to your Cobit account:');
  
  try {
    const { email, password } = await promptCredentials();
    const authString = Buffer.from(`${email}:${password}`).toString('base64');
    const res = await axios.get('https://cobit.manojgowda.in/api/login', {
      headers: {
        'Authorization': `Basic ${authString}`
      }
    });
    
    // Save token to local config
    const token = res.data.token;
    saveToken(token);
    return token;
  } catch (err) {
    console.log('❌ Login failed:', err.response?.data?.message || err.message);
    return null;
  }
}

// Function to save token locally
function saveToken(token) {
  try {
    const configPath = `${process.env.HOME || process.env.USERPROFILE}/.cobit/auth.json`;
    // Ensure directory exists
    const configDir = `${process.env.HOME || process.env.USERPROFILE}/.cobit`;
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify({ token }));
    console.log('✅ Login successful');
  } catch (err) {
    console.log('❌ Failed to save auth token:', err.message);
  }
}

// Function to get token from local storage
function getToken() {
  try {
    const configPath = `${process.env.HOME || process.env.USERPROFILE}/.cobit/auth.json`;
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return config.token;
    }
    return null;
  } catch (err) {
    console.log('❌ Failed to get auth token:', err.message);
    return null;
  }
}

module.exports = async function push() {
  // First, verify authentication
  let token = getToken();
  let userData = null;
  
  if (token) {
    userData = await verifyToken(token);
    if (!userData) {
      console.log('⚠️ Your session has expired. Please login again.');
      token = await login();
      if (!token) {
        console.log('❌ Authentication required to push to Cobit.');
        console.log('📝 Create an account at: cobit.manojgowda.in/signup');
        return;
      }
    }
  } else {
    console.log('⚠️ You are not logged in.');
    token = await login();
    if (!token) {
      console.log('❌ Authentication required to push to Cobit.');
      console.log('📝 Create an account at: cobit.manojgowda.in/signup');
      return;
    }
  }

  // Proceed with push if authentication is successful
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
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`✅ Pushed to ${cobit.id}`);
    console.log(`   Title: ${res.data?.title}`);
    console.log(`   UpdatedAt: ${res.data?.updatedAt || '—'}`);
    console.log(`   User: ${userData?.userId || '—'}`);
  } catch (err) {
    console.log('❌ Push failed:', err.response?.data || err.message);
  }
};