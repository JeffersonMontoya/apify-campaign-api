import pool from "./db.js";

async function seedContacts() {
  try {
    console.log("🧹 Limpiando tablas antiguas...");

    await pool.query("TRUNCATE TABLE campaign_contacts, contacts RESTART IDENTITY CASCADE;");

    console.log("🌱 Insertando nuevos contactos...");
    const query = `
      INSERT INTO contacts (name, phone) VALUES 
      ('Andrés García', '3101234567'),
      ('Camila Torres', '3112345678'),
      ('Diego Martínez', '3123456789'),
      ('Elena Rodríguez', '3134567890'),
      ('Felipe Gómez', '3145678901'),
      ('Gabriela Rivas', '3156789012'),
      ('Hugo Castro', '3167890123'),
      ('Isabel Ortiz', '3178901234'),
      ('Javier Mendoza', '3189012345'),
      ('Karla Peña', '3190123456'),
      ('Luis Herrera', '3201112233'),
      ('Mónica Suárez', '3212223344'),
      ('Nicolás Vargas', '3223334455'),
      ('Paola Jiménez', '3234445566'),
      ('Ricardo Silva', '3245556677'),
      ('Sofía Rojas', '3256667788'),
      ('Tomás Blanco', '3267778899'),
      ('Valeria Luna', '3278889900'),
      ('Wilson Pineda', '3289990011'),
      ('Yolanda Cruz', '3290001122');
    `;

    await pool.query(query);
    
    console.log("✅ ¡Semilla plantada! 20 contactos insertados correctamente.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en el seeder:");
    console.error(err);
    process.exit(1);
  }
}

seedContacts();