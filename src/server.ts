import dotenv from "dotenv";
import "./config/db.js";
import app from "./app.js";
import { backgroundProcessor } from "./jobs/campaignProcessor.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);

  // Encendemos el motor en background (PASO 4 de la prueba)
  // Lo ponemos a correr cada 5000ms (5 segundos) para visualizarlo rapido.
  // En producción real, esto suele ser de 60000ms (1 minuto).
  backgroundProcessor.start(5000);
});
