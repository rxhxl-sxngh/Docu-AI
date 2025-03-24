CREATE TABLE Invoices (
    id SERIAL PRIMARY KEY,
    created_by INT,
    modified_by INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    created_by INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT UNIQUE,
    first_name VARCHAR(255)
);


CREATE TABLE Documents (
    document_id SERIAL PRIMARY KEY,
    uploaded_by INT,
    modified_by INT,
    uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE System_Settings (
    system_settings_id SERIAL PRIMARY KEY,
    created_by INT,
    modified_by INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Processing_Queue (
    id SERIAL PRIMARY KEY,
    created_by INT,
    modified_by INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Processing_Results (
    id SERIAL PRIMARY KEY,
    created_by INT,
    modified_by INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE System_Logs (
    id SERIAL PRIMARY KEY,
    created_by INT,
    modified_by INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);