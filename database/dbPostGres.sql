-- CREATE TABLE products (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(50),
--   slogan VARCHAR(255),
--   description VARCHAR(1000),
--   category VARCHAR(50),
--   default_price DECIMAL(15,2)
-- );

-- \COPY products
-- FROM '/Users/chriswu/Desktop/HackReactor/Products-Overview-Chris/data/product.csv'
-- DELIMITER ','
-- CSV HEADER;

-- CREATE TABLE features (
--   id SERIAL PRIMARY KEY,
--   product_id INT NOT NULL,
--   feature VARCHAR(100),
--   value VARCHAR(100),
--   CONSTRAINT fk_features_products
--     FOREIGN KEY(product_id)
--       REFERENCES products(id)
--       ON DELETE CASCADE
--       ON UPDATE CASCADE
-- );

-- \COPY features
-- FROM '/Users/chriswu/Desktop/HackReactor/Products-Overview-Chris/data/features.csv'
-- NULL 'null'
-- DELIMITER ','
-- CSV HEADER;

-- CREATE TABLE styles (
--   id SERIAL PRIMARY KEY,
--   product_id INT NOT NULL,
--   name VARCHAR(100),
--   sale_price DECIMAL(15,2),
--   original_price DECIMAL(15,2),
--   default_style BOOLEAN NOT NULL,
--   CONSTRAINT fk_styles_products
--     FOREIGN KEY(product_id)
--       REFERENCES products(id)
--       ON DELETE CASCADE
--       ON UPDATE CASCADE
-- );

-- \COPY styles
-- FROM '/Users/chriswu/Desktop/HackReactor/Products-Overview-Chris/data/styles.csv'
-- NULL 'null'
-- DELIMITER ','
-- CSV HEADER;

-- CREATE TABLE photos (
--   id SERIAL PRIMARY KEY,
--   style_id INT NOT NULL,
--   url VARCHAR(1000),
--   thumbnail_url VARCHAR(1000),
--   CONSTRAINT fk_photos_styles
--     FOREIGN KEY(style_id)
--       REFERENCES styles(id)
--       ON DELETE CASCADE
--       ON UPDATE CASCADE
-- );

-- \COPY photos
-- FROM '/Users/chriswu/Desktop/HackReactor/Products-Overview-Chris/data/photosv2.csv'
-- NULL 'null'
-- DELIMITER ','
-- CSV HEADER;

-- CREATE TABLE skus (
--   id SERIAL PRIMARY KEY,
--   style_id INT NOT NULL,
--   size VARCHAR(100),
--   quantity INT,
--   CONSTRAINT fk_skus_styles
--     FOREIGN KEY(style_id)
--       REFERENCES styles(id)
--       ON DELETE CASCADE
--       ON UPDATE CASCADE
-- );

-- \COPY skus
-- FROM '/Users/chriswu/Desktop/HackReactor/Products-Overview-Chris/data/skus.csv'
-- NULL 'null'
-- DELIMITER ','
-- CSV HEADER;

-- CREATE TABLE related (
--   id SERIAL PRIMARY KEY,
--   current_product_id INT,
--   related_product_id INT,
--   CONSTRAINT fk_current_products
--     FOREIGN KEY(current_product_id)
--       REFERENCES products(id)
--       ON DELETE CASCADE
--       ON UPDATE CASCADE,
--   CONSTRAINT fk_related_products
--     FOREIGN KEY(related_product_id)
--       REFERENCES products(id)
--       ON DELETE CASCADE
--       ON UPDATE CASCADE
-- );

-- \COPY related
-- FROM '/Users/chriswu/Desktop/HackReactor/Products-Overview-Chris/data/related.csv'
-- NULL '0'
-- DELIMITER ','
-- CSV HEADER;

-- CREATE TABLE cart (
--   id SERIAL PRIMARY KEY,
--   user_session INT NOT NULL,
--   product_id INT,
--   active BOOLEAN,
--   CONSTRAINT fk_cart_products
--     FOREIGN KEY(product_id)
--       REFERENCES products(id)
--       ON DELETE CASCADE
--       ON UPDATE CASCADE
-- );

-- \COPY cart
-- FROM '/Users/chriswu/Desktop/HackReactor/Products-Overview-Chris/data/cart.csv'
-- NULL 'null'
-- DELIMITER ','
-- CSV HEADER;