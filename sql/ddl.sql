DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS class_registrations CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS personal_training_sessions CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS health_metrics CASCADE;
DROP TABLE IF EXISTS member_routines CASCADE;
DROP TABLE IF EXISTS excercise_routine CASCADE;
DROP TABLE IF EXISTS fitness_achievments CASCADE;
DROP TABLE IF EXISTS fitness_goals CASCADE;
DROP TABLE IF EXISTS trainer_availability CASCADE;
DROP TABLE IF EXISTS trainers CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS billing CASCADE;
DROP TYPE IF EXISTS day_of_week;
CREATE TYPE day_of_week AS ENUM ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');


CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, 
    join_date DATE NOT NULL,
    member_status VARCHAR(20) CHECK (member_status IN ('active', 'suspended', 'inactive')) 
);

CREATE TABLE trainers (
    trainer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, 
    certification VARCHAR(100) 
);

CREATE TABLE admin (
    admin_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL  
);
CREATE TABLE fitness_goals (
    goal_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, 
    target_value NUMERIC NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE 
);

CREATE TABLE fitness_achievments (
    achievement_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL, 
    target_value NUMERIC NOT NULL,
    achievement_date DATE 
);

create table excercise_routine (
    routine_id SERIAL primary key,
    routine_name VARCHAR(50) NOT NULL, 
    routine_description VARCHAR(256),
    routine_type VARCHAR(50) NOT NULL,
    routine JSON NOT NULL,
    difficulty_level NUMERIC NOT NULL 
);

create table member_routines (
    member_routine_id serial primary key,
    member_id integer references members(member_id) on delete cascade,
    routine_id integer references excercise_routine(routine_id) on delete cascade
);


CREATE TABLE health_metrics (
    metric_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, 
    value NUMERIC NOT NULL,
    date_recorded DATE NOT NULL 
);
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL
);

CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL,
    room_id INTEGER REFERENCES rooms(room_id) ON DELETE SET NULL,
    trainer_id INTEGER REFERENCES trainers(trainer_id) ON DELETE SET NULL,
    start_time TIMESTAMP NOT NULL, 
    end_time TIMESTAMP NOT NULL,
    capacity INTEGER NOT NULL 
);

CREATE TABLE personal_training_sessions (
    session_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id) ON DELETE CASCADE,
    trainer_id INTEGER REFERENCES trainers(trainer_id) ON DELETE CASCADE,

    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL 
);

CREATE TABLE trainer_availability (
    availability_id SERIAL PRIMARY KEY,
    trainer_id INTEGER REFERENCES trainers(trainer_id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);



CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(class_id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES rooms(room_id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL 
);

CREATE TABLE class_registrations (
    registration_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(class_id) ON DELETE CASCADE
);

CREATE TABLE equipment (
    equipment_id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(50) NOT NULL,
    equipment_type VARCHAR(50) NOT NULL,
    operational BOOLEAN NOT NULL,
    room_id INTEGER REFERENCES rooms(room_id) ON DELETE SET NULL
);

CREATE TABLE maintenance_logs (
    log_id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(equipment_id) ON DELETE CASCADE,
    maintenance_date DATE NOT NULL,
    maintenance_description TEXT
);

CREATE TABLE billing (
    bill_id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL, 
    amount DECIMAL(10, 2) NOT NULL, 
    payment_date DATE,  
    status VARCHAR(20) CHECK (status IN ('pending', 'paid', 'overdue')) NOT NULL
);


CREATE INDEX idx_fitness_goals_member_id ON fitness_goals(member_id);
CREATE INDEX idx_fitness_achievments_member_id ON fitness_achievments(member_id);
CREATE INDEX idx_member_routines_member_id ON member_routines(member_id);
CREATE INDEX idx_member_routines_routine_id ON member_routines(routine_id);
CREATE INDEX idx_health_metrics_member_id ON health_metrics(member_id);
CREATE INDEX idx_classes_room_id ON classes(room_id);
CREATE INDEX idx_classes_trainer_id ON classes(trainer_id);
CREATE INDEX idx_personal_training_sessions_member_id ON personal_training_sessions(member_id);
CREATE INDEX idx_personal_training_sessions_trainer_id ON personal_training_sessions(trainer_id);
CREATE INDEX idx_trainer_availability_trainer_id ON trainer_availability(trainer_id);
CREATE INDEX idx_bookings_class_id ON bookings(class_id);
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_class_registrations_member_id ON class_registrations(member_id);
CREATE INDEX idx_class_registrations_class_id ON class_registrations(class_id);
CREATE INDEX idx_equipment_room_id ON equipment(room_id);
CREATE INDEX idx_maintenance_logs_equipment_id ON maintenance_logs(equipment_id);
CREATE INDEX idx_billing_member_id ON billing(member_id);


