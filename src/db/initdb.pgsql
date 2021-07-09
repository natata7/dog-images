-- Drops images table
DROP TABLE IF EXISTS images;

-- Creates guitars table
CREATE TABLE IF NOT EXISTS images (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , url varchar(200) NOT NULL
    , width varchar(50) NOT NULL
    , height varchar(50) NULL
);