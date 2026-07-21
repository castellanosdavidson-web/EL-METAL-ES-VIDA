const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imgPath = 'C:\\Users\\Adria\\OneDrive\\Escritorio\\DAVIDSON\\EL METAL ES VIDA\\Logos\\ICONOGRAFÍA.png';
const outDir = path.join(__dirname, 'public', 'custom_icons');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

sharp(imgPath).metadata().then(info => {
    const cols = 5;
    const rows = 4;
    const w = Math.floor(info.width / cols);
    const h = Math.floor(info.height / rows);
    
    let promises = [];
    let c = 1;
    
    for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
            const outFile = path.join(outDir, `icon_${c}.png`);
            promises.push(
                sharp(imgPath)
                    .extract({ left: col * w, top: r * h, width: w, height: h })
                    .toFile(outFile)
            );
            c++;
        }
    }
    
    Promise.all(promises).then(() => {
        console.log(`Successfully sliced ${c - 1} icons into ${outDir}`);
    }).catch(err => {
        console.error('Error slicing images:', err);
    });
}).catch(err => {
    console.error('Error reading metadata:', err);
});
