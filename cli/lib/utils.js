const fs = require('fs');
const path = require('path');

const COBIT_FILE = path.join(process.cwd(), '.cobit');

function getApiBase() {
  // Allow override with env; default to your prod domain
  return process.env.COBIT_API_BASE || 'https://cobit.manojgowda.in';
}

function getSnippetUrl(id) {
  const base = getApiBase().replace(/\/+$/, '');
  return `${base}/api/snippets${id ? '/' + id : ''}`;
}

function readCobitFile() {
  if (!fs.existsSync(COBIT_FILE)) return null;
  const raw = fs.readFileSync(COBIT_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCobitFile(data) {
  fs.writeFileSync(COBIT_FILE, JSON.stringify(data, null, 2));
}

function ensureRepoOrExit() {
  const c = readCobitFile();
  if (!c) {
    console.log('❌ No Cobit repo found. Run `cobit init` first.');
    process.exit(1);
  }
  return c;
}

function fileExistsOrExit(filename) {
  if (!fs.existsSync(filename)) {
    console.log(`❌ File not found: ${filename}`);
    process.exit(1);
  }
}

module.exports = {
  COBIT_FILE,
  getApiBase,
  getSnippetUrl,
  readCobitFile,
  writeCobitFile,
  ensureRepoOrExit,
  fileExistsOrExit
};
