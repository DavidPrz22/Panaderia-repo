-- Users App
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(254) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'Vendedor', -- Gerente, Vendedor, Admin
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP,
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
