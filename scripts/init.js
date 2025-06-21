#!/usr/bin/env node

// script made by AI btw

const fs = require("fs-extra");
const path = require("path");

// List of files/folders to exclude (relative to TodoMVC)
const exclude = [
  "README.md",
  "src",
  "node_modules", // exists when testing locally, so exclude it
];

// Filter function for fs-extra
function filterFunc(src, dest) {
  // Get the relative path from the TodoMVC folder
  const rel = path.relative(path.join(__dirname, "../examples/TodoMVC"), src);
  if (!rel) return true; // Always include the root folder
  // Exclude if rel matches any in the exclude list
  return !exclude.some((pattern) =>
    pattern.endsWith("/")
      ? rel.startsWith(pattern.slice(0, -1) + path.sep)
      : rel === pattern
  );
}

function replaceLocalImports(dir, pkgName) {
  const exts = [".js", ".ts", ".jsx", ".tsx"];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      replaceLocalImports(fullPath, pkgName);
    } else if (exts.includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, "utf8");
      content = content.replace(
        /import\s+([\s\S]+?)\s+from\s+['"]((\.{1,2}\/)[^'"]+)['"]/g,
        (match, imports) => `import ${imports} from "${pkgName}"`
      );
      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
}

const folder = process.argv[2];
if (!folder) {
  console.error(
    "❌ Please provide a destination folder. Usage: node scripts/init.js <folder-name>"
  );
  process.exit(1);
}

const src = path.join(__dirname, "../examples/TodoMVC");
const dest = path.resolve(process.cwd(), folder);
// Check if dest exists and is not empty
if (fs.existsSync(dest)) {
  const files = fs.readdirSync(dest);
  if (files.length > 0) {
    console.error(
      `❌ Destination folder "${dest}" already exists and is not empty. Aborting.`
    );
    process.exit(1);
  }
}
fs.copy(src, dest, {
  overwrite: false,
  errorOnExist: false,
  filter: filterFunc,
})
  .then(() => {
    console.log(
      `✅ Cloned TodoMVC to ${folder}`
    );
    replaceLocalImports(dest, "@x.srm/bindjs");
    console.log(`🔄 Updated local imports to use "@x.srm/bindjs"`);
  })
  .catch((err) => {
    console.error("❌ Failed to clone examples/TodoMVC:", err);
    process.exit(1);
  });
