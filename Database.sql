DROP SCHEMA IF EXISTS iot CASCADE;
CREATE SCHEMA IF NOT EXISTS iot;

CREATE TABLE iot.user(
    Id TEXT PRIMARY KEY NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Role int NOT NULL,
    Passwordhash TEXT NOT NULL,
    CreatedAt TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE iot.turbines(
    Id TEXT PRIMARY KEY NOT NULL,
    Displayname TEXT NOT NULL UNIQUE
);

CREATE TABLE iot.turbinemetric(
    Id TEXT PRIMARY KEY NOT NULL,
    TurbineId TEXT NOT NULL REFERENCES iot.turbines(Id) ON DELETE CASCADE,
    timestampUTC TIMESTAMP WITH TIME ZONE NOT NULL,
    windspeed DECIMAL(3,1),
    windDirection DECIMAL(4,1),
    ambientTemperature DECIMAL(4,1),
    rotorSpeed DECIMAL(4,1),
    powerOutput DECIMAL(5,1),
    nacelleDirection DECIMAL(4,1),
    baldePitch DECIMAL(3,1),
    generatorTemp DECIMAL(3,1),
    gearBoxTemp DECIMAL(4,1),
    vibration DECIMAL(3,2),
    status BOOLEAN DEFAULT false
);

CREATE TABLE iot.alerts(
    Id TEXT PRIMARY KEY NOT NULL,
    turbineId TEXT REFERENCES iot.turbines(Id) ON DELETE CASCADE,
    alerted TIMESTAMP WITH TIME ZONE NOT NULL,
    message TEXT,
    severity INT NOT NULL
);

CREATE TABLE iot.commandHistory(
    Id TEXT PRIMARY KEY NOT NULL,
    turbineId TEXT DEFAULT NULL REFERENCES iot.turbines(Id) ON DELETE SET DEFAULT, 
    timeexecuted TIMESTAMP WITH TIME ZONE NOT NULL,
    action INT NOT NULL,
    value TEXT DEFAULT NULL
);