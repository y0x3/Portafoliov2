// scripts/generateFileIndex.js
// Ejecuta este script con: node scripts/generateFileIndex.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración: qué carpetas escanear
const foldersToScan = [
  { name: 'demo', path: 'public/ui/music/demo' },
  { name: 'My Pictures', path: 'public/ui/iconos' },
  { name: 'My Videos', path: 'public/ui/halloffame' },
  // Agrega más carpetas aquí
];

// Función para escanear recursivamente una carpeta
function scanDirectory(dirPath, basePath) {
  const items = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      // Ignorar archivos ocultos
      if (entry.name.startsWith('.')) continue;
      
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(basePath, fullPath);
      const publicPath = '/' + relativePath.replace(/\\/g, '/');
      
      if (entry.isDirectory()) {
        items.push({
          name: entry.name,
          type: 'folder',
          path: publicPath,
          children: scanDirectory(fullPath, basePath)
        });
      } else {
        items.push({
          name: entry.name,
          type: 'file',
          path: publicPath,
          size: fs.statSync(fullPath).size,
          extension: path.extname(entry.name)
        });
      }
    }
  } catch (error) {
    console.error(`Error escaneando ${dirPath}:`, error.message);
  }
  
  return items;
}

// Generar el índice
const fileIndex = {};

for (const folder of foldersToScan) {
  const fullPath = path.join(__dirname, '..', folder.path);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Carpeta no encontrada: ${folder.path}`);
    continue;
  }
  
  console.log(`📂 Escaneando: ${folder.name}`);
  fileIndex[folder.name] = scanDirectory(fullPath, path.join(__dirname, '..', 'public'));
}

// Guardar el índice en un archivo JSON
const outputPath = path.join(__dirname, '..', 'public', 'fileIndex.json');
fs.writeFileSync(outputPath, JSON.stringify(fileIndex, null, 2));

console.log(`\n✅ Índice generado exitosamente en: ${outputPath}`);
console.log(`📊 Total de carpetas escaneadas: ${Object.keys(fileIndex).length}`);