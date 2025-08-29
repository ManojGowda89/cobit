#!/usr/bin/env node

const { program } = require('commander');

program
  .name('cobit')
  .description('Cobit CLI - simple snippet-based code keeper')
  .version('1.3.1');

program
  .command('init')
  .description('Initialize a new Cobit repo (creates remote snippet and saves .cobit)')
  .action(require('../lib/init'));

program
  .command('add')
  .argument('<filename...>', 'File(s) to stage (only the first will be used on push)')
  .description('Stage file(s)')
  .action(require('../lib/add'));

program
  .command('commit')
  .argument('<message>', 'Commit message')
  .description('Create a commit from staged files')
  .action(require('../lib/commit'));

program
  .command('push')
  .description('Push the latest commit to the remote snippet')
  .action(require('../lib/push'));

program
  .command('clone')
  .argument('<repoId>', 'Cobit repo/snippet ID to clone')
  .description('Clone a Cobit repo by ID')
  .action(require('../lib/clone'));

program
  .command('status')
  .description('Show repo ID, staged files, and commits')
  .action(require('../lib/status'));

program.parse(process.argv);
