-- Schema para criação das tabelas com relacionamentos e dados iniciais

-- Limpar tabelas existentes
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS models CASCADE;
DROP TABLE IF EXISTS brands CASCADE;

-- Tabela de Marcas
CREATE TABLE brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Modelos
CREATE TABLE models (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    UNIQUE(name, brand_id)
);

-- Tabela de Veículos
CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    plate VARCHAR(10) NOT NULL UNIQUE,
    model_id BIGINT NOT NULL,
    brand_id BIGINT NOT NULL,
    year INTEGER NOT NULL,
    description TEXT,
    is_sold BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (model_id) REFERENCES models(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);

-- Inserir marcas principais
INSERT INTO brands (name) VALUES
('Honda'),
('Toyota'),
('Volkswagen'),
('Ford'),
('Chevrolet'),
('Fiat'),
('Nissan'),
('Hyundai'),
('BMW'),
('Mercedes-Benz'),
('Audi'),
('Peugeot'),
('Renault'),
('Jeep'),
('Mitsubishi');

-- Inserir modelos por marca
-- Honda
INSERT INTO models (name, brand_id) VALUES
('Civic', (SELECT id FROM brands WHERE name = 'Honda')),
('Accord', (SELECT id FROM brands WHERE name = 'Honda')),
('CR-V', (SELECT id FROM brands WHERE name = 'Honda')),
('HR-V', (SELECT id FROM brands WHERE name = 'Honda')),
('Fit', (SELECT id FROM brands WHERE name = 'Honda'));

-- Toyota
INSERT INTO models (name, brand_id) VALUES
('Corolla', (SELECT id FROM brands WHERE name = 'Toyota')),
('Camry', (SELECT id FROM brands WHERE name = 'Toyota')),
('RAV4', (SELECT id FROM brands WHERE name = 'Toyota')),
('Hilux', (SELECT id FROM brands WHERE name = 'Toyota')),
('Prius', (SELECT id FROM brands WHERE name = 'Toyota')),
('Yaris', (SELECT id FROM brands WHERE name = 'Toyota'));

-- Volkswagen
INSERT INTO models (name, brand_id) VALUES
('Golf', (SELECT id FROM brands WHERE name = 'Volkswagen')),
('Jetta', (SELECT id FROM brands WHERE name = 'Volkswagen')),
('Passat', (SELECT id FROM brands WHERE name = 'Volkswagen')),
('Tiguan', (SELECT id FROM brands WHERE name = 'Volkswagen')),
('Polo', (SELECT id FROM brands WHERE name = 'Volkswagen')),
('T-Cross', (SELECT id FROM brands WHERE name = 'Volkswagen'));

-- Ford
INSERT INTO models (name, brand_id) VALUES
('Focus', (SELECT id FROM brands WHERE name = 'Ford')),
('Fiesta', (SELECT id FROM brands WHERE name = 'Ford')),
('Mustang', (SELECT id FROM brands WHERE name = 'Ford')),
('EcoSport', (SELECT id FROM brands WHERE name = 'Ford')),
('Ranger', (SELECT id FROM brands WHERE name = 'Ford')),
('Ka', (SELECT id FROM brands WHERE name = 'Ford'));

-- Chevrolet
INSERT INTO models (name, brand_id) VALUES
('Onix', (SELECT id FROM brands WHERE name = 'Chevrolet')),
('Cruze', (SELECT id FROM brands WHERE name = 'Chevrolet')),
('S10', (SELECT id FROM brands WHERE name = 'Chevrolet')),
('Tracker', (SELECT id FROM brands WHERE name = 'Chevrolet')),
('Camaro', (SELECT id FROM brands WHERE name = 'Chevrolet')),
('Spin', (SELECT id FROM brands WHERE name = 'Chevrolet'));

-- Fiat
INSERT INTO models (name, brand_id) VALUES
('Uno', (SELECT id FROM brands WHERE name = 'Fiat')),
('Palio', (SELECT id FROM brands WHERE name = 'Fiat')),
('Strada', (SELECT id FROM brands WHERE name = 'Fiat')),
('Toro', (SELECT id FROM brands WHERE name = 'Fiat')),
('Argo', (SELECT id FROM brands WHERE name = 'Fiat')),
('Mobi', (SELECT id FROM brands WHERE name = 'Fiat'));

-- Nissan
INSERT INTO models (name, brand_id) VALUES
('Sentra', (SELECT id FROM brands WHERE name = 'Nissan')),
('Versa', (SELECT id FROM brands WHERE name = 'Nissan')),
('Kicks', (SELECT id FROM brands WHERE name = 'Nissan')),
('March', (SELECT id FROM brands WHERE name = 'Nissan')),
('Frontier', (SELECT id FROM brands WHERE name = 'Nissan'));

-- Hyundai
INSERT INTO models (name, brand_id) VALUES
('HB20', (SELECT id FROM brands WHERE name = 'Hyundai')),
('Elantra', (SELECT id FROM brands WHERE name = 'Hyundai')),
('Tucson', (SELECT id FROM brands WHERE name = 'Hyundai')),
('Creta', (SELECT id FROM brands WHERE name = 'Hyundai')),
('i30', (SELECT id FROM brands WHERE name = 'Hyundai'));

-- BMW
INSERT INTO models (name, brand_id) VALUES
('320i', (SELECT id FROM brands WHERE name = 'BMW')),
('X1', (SELECT id FROM brands WHERE name = 'BMW')),
('X3', (SELECT id FROM brands WHERE name = 'BMW')),
('120i', (SELECT id FROM brands WHERE name = 'BMW')),
('530i', (SELECT id FROM brands WHERE name = 'BMW'));

-- Mercedes-Benz
INSERT INTO models (name, brand_id) VALUES
('Classe A', (SELECT id FROM brands WHERE name = 'Mercedes-Benz')),
('Classe C', (SELECT id FROM brands WHERE name = 'Mercedes-Benz')),
('GLA', (SELECT id FROM brands WHERE name = 'Mercedes-Benz')),
('CLA', (SELECT id FROM brands WHERE name = 'Mercedes-Benz')),
('Classe E', (SELECT id FROM brands WHERE name = 'Mercedes-Benz'));

-- Audi
INSERT INTO models (name, brand_id) VALUES
('A3', (SELECT id FROM brands WHERE name = 'Audi')),
('A4', (SELECT id FROM brands WHERE name = 'Audi')),
('Q3', (SELECT id FROM brands WHERE name = 'Audi')),
('Q5', (SELECT id FROM brands WHERE name = 'Audi')),
('A1', (SELECT id FROM brands WHERE name = 'Audi'));

-- Peugeot
INSERT INTO models (name, brand_id) VALUES
('208', (SELECT id FROM brands WHERE name = 'Peugeot')),
('2008', (SELECT id FROM brands WHERE name = 'Peugeot')),
('308', (SELECT id FROM brands WHERE name = 'Peugeot')),
('3008', (SELECT id FROM brands WHERE name = 'Peugeot')),
('Partner', (SELECT id FROM brands WHERE name = 'Peugeot'));

-- Renault
INSERT INTO models (name, brand_id) VALUES
('Sandero', (SELECT id FROM brands WHERE name = 'Renault')),
('Logan', (SELECT id FROM brands WHERE name = 'Renault')),
('Duster', (SELECT id FROM brands WHERE name = 'Renault')),
('Captur', (SELECT id FROM brands WHERE name = 'Renault')),
('Kwid', (SELECT id FROM brands WHERE name = 'Renault'));

-- Jeep
INSERT INTO models (name, brand_id) VALUES
('Renegade', (SELECT id FROM brands WHERE name = 'Jeep')),
('Compass', (SELECT id FROM brands WHERE name = 'Jeep')),
('Cherokee', (SELECT id FROM brands WHERE name = 'Jeep')),
('Grand Cherokee', (SELECT id FROM brands WHERE name = 'Jeep')),
('Wrangler', (SELECT id FROM brands WHERE name = 'Jeep'));

-- Mitsubishi
INSERT INTO models (name, brand_id) VALUES
('Lancer', (SELECT id FROM brands WHERE name = 'Mitsubishi')),
('ASX', (SELECT id FROM brands WHERE name = 'Mitsubishi')),
('Outlander', (SELECT id FROM brands WHERE name = 'Mitsubishi')),
('L200', (SELECT id FROM brands WHERE name = 'Mitsubishi')),
('Eclipse Cross', (SELECT id FROM brands WHERE name = 'Mitsubishi'));

-- Índices para melhor performance
CREATE INDEX idx_vehicles_brand_id ON vehicles(brand_id);
CREATE INDEX idx_vehicles_model_id ON vehicles(model_id);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_is_sold ON vehicles(is_sold);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at);
CREATE INDEX idx_models_brand_id ON models(brand_id);
CREATE INDEX idx_brands_name ON brands(name);
CREATE INDEX idx_models_name ON models(name);
