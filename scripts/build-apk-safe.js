import { execSync } from "child_process";

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", shell: true });
}

try {
  // 1. Borrar dist (forzar build fresco)
  run("if exist dist rmdir /s /q dist");

  // 2. Build web
  run("npm run build");

  // 3. Sync Capacitor
  run("npx cap sync android");

  // 4. Limpiar Android
  run("cd android && gradlew clean && cd ..");

  // 5. Build APK debug
  run("cd android && gradlew assembleDebug && cd ..");

  // 6. Copiar APK
  run("node scripts/copy-apk.js");

  console.log("\n✅ APK DEBUG generado con el ÚLTIMO código\n");
} catch (err) {
  console.error("\n❌ Error en build APK SAFE\n");
  process.exit(1);
}
