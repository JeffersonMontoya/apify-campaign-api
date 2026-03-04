import fs from "fs";
import path from "path";
import pool from "./db.js";

async function initDB() {
  try {
    console.log("⏳ Creando tablas en la base de datos...");
    const initSql = fs.readFileSync(path.resolve("./init.sql"), "utf-8");
    await pool.query(initSql);
    console.log("✅ ¡Tablas creadas con éxito!");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Error creando tablas:", err.stack);
    process.exit(1);
  }
}

initDB();
