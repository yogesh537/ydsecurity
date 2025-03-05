const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy static files
const filesToCopy = [
    { src: 'index.html', dest: 'index.html' },
    { src: 'style.css', dest: 'style.css' },
    { src: 'script.js', dest: 'script.js' },
    { src: 'ai.png', dest: 'ai.png' }
];

filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file.src);
    const destPath = path.join(distDir, file.dest);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file.src} to dist/${file.dest}`);
    } else {
        console.warn(`Warning: ${file.src} not found`);
    }
});

console.log('Build completed successfully!'); 