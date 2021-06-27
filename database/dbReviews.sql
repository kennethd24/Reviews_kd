CREATE TABLE reviews
(
    id SERIAL PRIMARY KEY,
    product_id integer NOT NULL,
    rating integer NOT NULL,
    date bigint NOT NULL,
    summary VARCHAR(1000),
    body VARCHAR(1000) NOT NULL,
    recommend boolean NOT NULL,
    reported boolean NOT NULL,
    reviewer_name VARCHAR NOT NULL,
    reviewer_email VARCHAR,
    response VARCHAR,
    helpfulness integer
)

\COPY reviews
FROM '/Users/ken/Desktop/sdc/reviews.csv'
NULL 'null'
DELIMITER ','
CSV HEADER;

CREATE TABLE reviews_photos
(
    id serial PRIMARY KEY,
    review_id integer NOT NULL,
    url character varying COLLATE pg_catalog."default" NOT NULL,
)

\COPY reviews_photos
FROM '/Users/ken/Desktop/sdc/reviews_photos.csv'
NULL 'null'
DELIMITER ','
CSV HEADER;

CREATE TABLE characteristics
(
    id SERIAL  PRIMARY KEY,
    product_id integer NOT NULL,
    name character varying(10)
)

\COPY characteristics
FROM '/Users/ken/Desktop/sdc/characteristics.csv'
NULL 'null'
DELIMITER ','
CSV HEADER;

CREATE TABLE characteristic_reviews
(
    id SERIAL PRIMARY KEY,
    characteristic_id integer NOT NULL,
    review_id integer NOT NULL,
    value integer NOT NULL
)

\COPY characteristic_reviews
FROM '/Users/ken/Desktop/sdc/characteristic_reviews.csv'
NULL 'null'
DELIMITER ','
CSV HEADER;


