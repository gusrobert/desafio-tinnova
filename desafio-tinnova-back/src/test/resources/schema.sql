-- Schema H2 para testes
-- Limpar tabelas existentes
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS models CASCADE;
DROP TABLE IF EXISTS brands CASCADE;

-- Tabela de Marcas
CREATE TABLE brands (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Modelos
CREATE TABLE models (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    UNIQUE(name, brand_id)
);

-- Tabela de Veículos
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plate VARCHAR(10) NOT NULL UNIQUE,
    model_id BIGINT NOT NULL,
    brand_id BIGINT NOT NULL,
    vehicle_year INTEGER NOT NULL,
    description TEXT,
    is_sold BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (model_id) REFERENCES models(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);

-- Inserir dados de teste básicos
INSERT INTO brands (name) VALUES
('Honda'),
('Toyota'),
('Volkswagen'),
('Ford'),
('Chevrolet');

INSERT INTO models (name, brand_id) VALUES
('Civic', 1),
('Accord', 1),
('Corolla', 2),
('Camry', 2),
('Golf', 3),
('Jetta', 3),
('Focus', 4),
('Fiesta', 4),
('Onix', 5),
('Cruze', 5);
