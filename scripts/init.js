#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function isEmptyDir(dirPath) {
  try {
    const dir = await fs.promises.opendir(dirPath);
    const entry = await dir.read();
    await dir.close();
    return entry === null; // null means directory is empty
  } catch (err) {
    // If error (e.g. folder doesn't exist), treat as empty/not existing
    return true;
  }
}

function copyFolderSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source path "${src}" does not exist.`);
    process.exit(1);
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: vynd-init <destination-path>');
    process.exit(1);
  }

  const destPath = path.resolve(args[0]);
  const sourcePath = path.resolve(__dirname, '../TodoMVC');

  // Check if destination exists and is empty
  const destExists = fs.existsSync(destPath);
  if (destExists) {
    const empty = await isEmptyDir(destPath);
    if (!empty) {
      console.error(`Destination folder "${destPath}" exists and is not empty. Aborting copy.`);
      process.exit(1);
    }
  }

  console.log(`Copying TodoMVC from "${sourcePath}" to "${destPath}"...`);
  copyFolderSync(sourcePath, destPath);
  console.log('Copy complete.');
}

main();
