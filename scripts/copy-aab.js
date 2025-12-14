import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta real donde Gradle genera los AAB release
const releaseDir = path.join(
  __dirname,
  "../android/app/build/outputs/bundle/release"
);

// Carpeta destino
const outputDir = path.join(__dirname, "../builds");

// Crear carpeta destino si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Leer versión del package.json
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf8")
);
const version = pkg.version || "1.0.0";

// Timestamp
const now = new Date();
const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(now.getDate()).padStart(2, "0")}-${now.getHours()}h${now.getMinutes()}`;

// Verificar carpeta
if (!fs.existsSync(releaseDir)) {
  console.error("\n❌ No existe el directorio AAB release:\n" + releaseDir + "\n");
  process.exit(1);
}

// Buscar AAB
const aabFiles = fs
  .readdirSync(releaseDir)
  .filter((file) => file.endsWith(".aab"));

if (aabFiles.length === 0) {
  console.error(
    "\n❌ No se encontró ningún AAB en:\n" + releaseDir + "\n"
  );
  process.exit(1);
}

// Tomar el más reciente
const latestAab = aabFiles
  .map((file) => ({
    file,
    time: fs.statSync(path.join(releaseDir, file)).mtime.getTime(),
  }))
  .sort((a, b) => b.time - a.time)[0].file;

const aabSource = path.join(releaseDir, latestAab);

// Nombre final
const aabFileName = `Renace-v${version}-${timestamp}.aab`;
const aabDest = path.join(outputDir, aabFileName);

// Copiar
fs.copyFileSync(aabSource, aabDest);

console.log(
  `\n✅ AAB exportado correctamente:\n${aabSource}\n→ builds/${aabFileName}\n`
);
