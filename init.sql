-- 1. Tabla de Campañas
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- Valores: draft, running, paused, finished
    rate_limit_per_minute INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Contactos (Maestra)
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(50)
);

-- 3. Tabla de Relación (Donde ocurre la magia del envío)
CREATE TABLE campaign_contacts (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- Valores: pending, sent, failed
    last_error TEXT,
    sent_at TIMESTAMP
);
