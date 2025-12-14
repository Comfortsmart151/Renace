import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Posibles carpetas de APK
const apkDirs = [
  path.join(__dirname, "../android/app/build/outputs/apk/debug"),
  path.join(__dirname, "../android/app/build/outputs/apk/release"),
];

// Carpeta destino
const outputDir = path.join(__dirname, "../builds");

// Crear carpeta destino
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

// Buscar APK (prioridad DEBUG)
let apkSource = null;

for (const dir of apkDirs) {
  if (!fs.existsSync(dir)) continue;

  const apks = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".apk") && !f.includes("unsigned"));

  if (apks.length > 0) {
    // Tomar el más reciente
    const latest = apks
      .map((file) => ({
        file,
        time: fs.statSync(path.join(dir, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time)[0].file;

    apkSource = path.join(dir, latest);
    break;
  }
}

if (!apkSource) {
  console.error("\n❌ No se encontró ningún APK instalable (debug o firmado).\n");
  process.exit(1);
}

// Nombre final
const apkFileName = `Renace-v${version}-${timestamp}.apk`;
const apkDest = path.join(outputDir, apkFileName);

// Copiar APK
fs.copyFileSync(apkSource, apkDest);

console.log(
  `\n✅ APK INSTALABLE exportado:\n${apkSource}\n→ builds/${apkFileName}\n`
);
