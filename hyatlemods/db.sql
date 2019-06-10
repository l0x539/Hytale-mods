CREATE DATABASE hytalemods;

USE hytalemods;

CREATE TABLE mods (
    id INT NOT NULL AUTO_INCREMENT,
    owner_id INT NOT NULL,
    modname VARCHAR(45),
    create_date DATETIME,
    update_date DATETIME,
    views INT(0) unsigned DEFAULT NULL,
    downloads INT(0) unsigned DEFAULT NULL,
    likes INT(0) unsigned DEFAULT NULL,
    comments INT(0) unsigned DEFAULT NULL,
    favorites INT(0) unsigned DEFAULT NULL,
    mod_description VARCHAR(5000),
    tags VARCHAR(1000),
    images VARCHAR(1000),
    maplink VARCHAR(500),
    PRIMARY KEY (id)
);
CREATE TABLE images (
    id INT NOT NULL AUTO_INCREMENT,
    mod_id INT,
    mod_image VARCHAR(500),
    added_at DATETIME,
    PRIMARY KEY (id)
);

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(42),
    email VARCHAR(100),
    passwd VARCHAR(350),
    add_at DATETIME,
    last_visit DATETIME,
    user_image VARCHAR(500),
    PRIMARY KEY (id)
);

CREATE TABLE subscriptions (
    id INT NOT NULL AUTO_INCREMENT,
    subscriber_id INT NOT NULL,
    user_subs_id INT NOT NULL,
    create_date DATETIME,
    PRIMARY KEY (id)
);

CREATE TABLE users_comments (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    commented_to_id INT NOT NULL,
    create_date DATETIME,
    update_date DATETIME,
    comment VARCHAR(4000),
    PRIMARY KEY (id)
);

CREATE TABLE mods_comments (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    mod_id INT NOT NULL,
    create_date DATETIME,
    update_date DATETIME,
    comment VARCHAR(4000),
    PRIMARY KEY (id)
);

CREATE TABLE mods_likes (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    mod_id INT NOT NULL,
    create_date DATETIME,
    PRIMARY KEY (id)
);

CREATE TABLE mods_favs (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    mod_id INT NOT NULL,
    create_date DATETIME,
    PRIMARY KEY (id)
);

CREATE TABLE mods_views (
    id INT NOT NULL AUTO_INCREMENT,
    viewer_ip VARCHAR(100),
    mod_id INT NOT NULL,
    create_date DATETIME,
    PRIMARY KEY (id)
);

CREATE TABLE tags (
    id INT NOT NULL AUTO_INCREMENT,
    mod_id INT NOT NULL,

    PRIMARY KEY (id)
);