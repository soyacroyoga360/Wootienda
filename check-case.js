const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, filesList);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const allFiles = getFiles(srcDir);
let foundErrors = false;

function checkPathCase(targetPath) {
  const parts = targetPath.split(path.sep);
  let currentPath = parts[0] + path.sep; // c:\

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part === '') continue; // Skip empty parts (like trailing slash)

    let files;
    try {
      files = fs.readdirSync(currentPath);
    } catch(e) { return false; } // Parent doesn't exist?

    const matchedFile = files.find(f => f === part);
    const caseInsensitiveMatch = files.find(f => f.toLowerCase() === part.toLowerCase());

    if (!matchedFile && caseInsensitiveMatch) {
      return { expected: caseInsensitiveMatch, actual: part, dir: currentPath };
    }
    
    currentPath = path.join(currentPath, part);
  }
  return null;
}

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const importMatches = content.matchAll(/from\s+['"]([^'"]+)['"]/g);
  for (const match of importMatches) {
    const importPath = match[1];
    if (importPath.startsWith('@/')) {
      const relativePath = importPath.replace('@/', '');
      const absoluteTarget = path.join(__dirname, 'src', relativePath);
      
      // Try resolving the extension
      const exts = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];
      let foundMismatch = false;
      for(const ext of exts) {
          const testPath = absoluteTarget + ext;
          if (fs.existsSync(testPath)) {
             const mismatch = checkPathCase(testPath);
             if (mismatch) {
                 console.log(`Mismatch in ${file}`);
                 console.log(`  Imported: ${importPath}`);
                 console.log(`  Expected: ${mismatch.expected} instead of ${mismatch.actual} in ${mismatch.dir}`);
                 foundErrors = true;
                 foundMismatch = true;
                 break;
             }
          }
      }
    } else if (importPath.startsWith('.')) {
      const absoluteTarget = path.join(path.dirname(file), importPath);
      const exts = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];
      for(const ext of exts) {
          const testPath = absoluteTarget + ext;
           if (fs.existsSync(testPath)) {
             const mismatch = checkPathCase(testPath);
             if (mismatch) {
                 console.log(`Mismatch in ${file}`);
                 console.log(`  Imported: ${importPath}`);
                 console.log(`  Expected: ${mismatch.expected} instead of ${mismatch.actual} in ${mismatch.dir}`);
                 foundErrors = true;
                 break;
             }
          }
      }
    }
  }
}

if (!foundErrors) {
  console.log("No case sensitivity mismatch found.");
}
