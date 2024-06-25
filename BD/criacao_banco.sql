CREATE DATABASE gerenciador_de_senhas
ENCODING = 'UTF8'
CONNECTION LIMIT = 100;

\c gerenciador_de_senhas

CREATE SEQUENCE users_serial;
CREATE SEQUENCE notes_serial;
CREATE SEQUENCE passwords_serial;

CREATE TABLE tb_users (
    id INTEGER  DEFAULT nextval('users_serial'),
    username     VARCHAR(40),
    email        VARCHAR(255),
    password     VARCHAR(255),
    create_at    TIMESTAMP,
    CONSTRAINT pk_tb_users PRIMARY KEY(id)
);

CREATE TABLE tb_notes(
    id INTEGER DEFAULT nextval('notes_serial'),
    user_id INTEGER,
    title VARCHAR(100),
    content TEXT,
    create_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT pk_tb_notes PRIMARY KEY(id),
    CONSTRAINT fk_tb_notes_tb_users 
        FOREIGN KEY(user_id) 
            REFERENCES tb_users(id)
);

CREATE TABLE tb_passwords(
    id INTEGER DEFAULT nextval('passwords_serial'),
    user_id INTEGER,
    title VARCHAR(100),
    email VARCHAR(255),
    password_encrypted TEXT,
    url VARCHAR(255),
    create_at TIMESTAMP,
    updated_at TIMESTAMP,
    favorito CHAR(1),
    CONSTRAINT pk_tb_passwords PRIMARY KEY(id),
    CONSTRAINT fk_tb_passwords_tb_users 
        FOREIGN KEY(user_id) 
            REFERENCES tb_users(id)
);