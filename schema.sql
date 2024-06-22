CREATE TABLE users(
	id CHAR(36) PRIMARY KEY NOT NULL,
	name VARCHAR(255) NOT NULL,
	login VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	office VARCHAR(35) CHECK (office IN ('ALUNO', 'PROFESSOR')) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classroom(
	id CHAR(36) PRIMARY KEY NOT NULL,
	name VARCHAR(55) NOT NULL,
	block CHAR(1),
	type VARCHAR(25) CHECK (type IN ('SALA', 'LABORATÓRIO', 'AUDITÓRIO')) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE days_of_the_week(
	id CHAR(36) PRIMARY KEY NOT NULL,
	days_week VARCHAR(35) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matter(
	id CHAR(36) PRIMARY KEY NOT NULL,
	name VARCHAR(55) NOT NULL,
	teacher VARCHAR(255) NOT NULL,
	type VARCHAR(35) CHECK (type IN ('OBRIGATÓRIA', 'OPTATIVA')) NOT NULL,
	period INT,
	start_hour TIME NOT NULL,
	end_hour TIME NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	days_of_the_week_id CHAR(36) NOT NULL,
	FOREIGN KEY (days_of_the_week_id) REFERENCES days_of_the_week (id)
);

CREATE TABLE monitor(
	id CHAR(36) PRIMARY KEY NOT NULL,
	registration VARCHAR(15) UNIQUE NOT NULL,
	name VARCHAR(255) NOT NULL,
	actual_period INT,
	institutional_email VARCHAR(255) NOT NULL,
	type_of_monitoring VARCHAR(35) CHECK (type_of_monitoring IN ('PRESENCIAL', 'REMOTO', 'PRESENCIAL E REMOTO')) NOT NULL,
	start_hour TIME NOT NULL,
	end_hour TIME NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	classroom_id CHAR(36),
	users_id CHAR(36) NOT NULL,
	matter_id CHAR(36) NOT NULL,
	FOREIGN KEY (classroom_id) REFERENCES classroom (id),
	FOREIGN KEY (users_id) REFERENCES users (id),
	FOREIGN KEY (matter_id) REFERENCES matter (id)
);

CREATE TABLE monitor_days_of_the_week(
	monitor_id CHAR(36),
	days_of_the_week_id CHAR(36),
	FOREIGN KEY (monitor_id) REFERENCES monitor (id),
	FOREIGN KEY (days_of_the_week_id) REFERENCES days_of_the_week (id)
);

CREATE TABLE absence(
	id CHAR(36) PRIMARY KEY NOT NULL,
	date DATE NOT NULL,
	justification VARCHAR(255),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	monitor_id CHAR(36) NOT NULL,
	FOREIGN KEY (monitor_id) REFERENCES monitor (id)
);
