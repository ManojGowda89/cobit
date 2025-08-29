const fs = require('fs');
const path = require('path');

module.exports = function logout() {
  try {
    const configPath = path.join(
      process.env.HOME || process.env.USERPROFILE,
      '.cobit',
      'auth.json'
    );
    
    // Check if auth file exists
    if (fs.existsSync(configPath)) {
      // Remove the auth file
      fs.unlinkSync(configPath);
      console.log('✅ Successfully logged out from Cobit');
    } else {
      console.log('ℹ️ You were not logged in');
    }
  } catch (err) {
    console.log('❌ Error during logout:', err.message);
  }
};