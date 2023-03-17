CREATE TABLE TMP_MSC_DATA (
    NOMBRE_VICTIMA              VARCHAR(200),
    APELLIDO_VICTIMA	        VARCHAR(200),
    DIRECCION_VICTIMA	        VARCHAR(200),
    FECHA_PRIMERA_SOSPECHA	    DATE,
    FECHA_CONFIRMACION          DATE,
    FECHA_MUERTE                DATE,
    ESTADO_VICTIMA              VARCHAR(200),
    NOMBRE_ASOCIADO             VARCHAR(200),
    APELLIDO_ASOCIADO           VARCHAR(200),
    FECHA_CONOCIO               DATE,
    CONTACTO_FISICO             VARCHAR(200),
    FECHA_INICIO_CONTACTO       DATE,
    FECHA_FIN_CONTACTO          DATE,
    NOMBRE_HOSPITAL             VARCHAR(200),
    DIRECCION_HOSPITAL          VARCHAR(200),
    UBICACION_VICTIMA           VARCHAR(200),
    FECHA_LLEGADA               DATE,
    FECHA_RETIRO                DATE,
    TRATAMIENTO                 VARCHAR(200),
    EFECTIVIDAD                 INT,
    FECHA_INICIO_TRATAMIENTO    DATE,
    FECHA_FIN_TRATAMIENTO       DATE,
    EFECTIVIDAD_EN_VICTIMA      INT
);

---- TABLAS
CREATE TABLE VICTIMA (
        id                      INT GENERATED AS IDENTITY PRIMARY KEY,
        nombre                  VARCHAR(200),
        apellido                VARCHAR(200),
        direccion               VARCHAR(200),
        fecha_primera_sospecha  DATE,
        fecha_confirmacion      DATE,
        fecha_muerte            DATE,
        estado                  VARCHAR(200)
);

CREATE TABLE HOSPITAL (
        id                      INT GENERATED AS idENTITY PRIMARY KEY,
        nombre                  VARCHAR(200),
        direccion               VARCHAR(200)
);

CREATE TABLE TRATAMIENTO (
        id                      INT GENERATED AS idENTITY PRIMARY KEY,
        descripcion             VARCHAR(200),
        efectividad             NUMBER NOT NULL
);

CREATE TABLE UBICACION (
        id                      INT GENERATED AS idENTITY PRIMARY KEY,
        direccion               VARCHAR(200)
);

CREATE TABLE CONOCIDO (
        id                      INT GENERATED AS idENTITY PRIMARY KEY,
        nombre                  VARCHAR(200),
        apellido                VARCHAR(200)
);

CREATE TABLE UbicacionVictima (
        id                      INT GENERATED AS IDENTITY PRIMARY KEY,
        victima                 INT,
        ubicacion               INT,
        fecha_llegada           DATE,
        fecha_retiro            DATE,
        FOREIGN KEY (victima) REFERENCES Victima(id),
        FOREIGN KEY (ubicacion) REFERENCES Ubicacion(id)
);

CREATE TABLE ConocidoVictima (
        id                      INT GENERATED AS idENTITY PRIMARY KEY,
        victima                 NUMBER NOT NULL,
        conocido                NUMBER NOT NULL,
        contacto                VARCHAR(200),
        fecha_conocio           DATE,
        fecha_inicio_contacto   DATE,
        fecha_fin_contacto      DATE,
        FOREIGN KEY (victima) REFERENCES Victima(id),
        FOREIGN KEY (conocido) REFERENCES Conocido(id)
);

CREATE TABLE RegistroHospital (
        id                      INT GENERATED AS idENTITY PRIMARY KEY,
        victima                 NUMBER NOT NULL,
        hospital                NUMBER NOT NULL,
        FOREIGN KEY (victima) REFERENCES Victima(id),
        FOREIGN KEY (hospital) REFERENCES Hospital(id)
);

CREATE TABLE AplicacionTratamiento (
        id                          INT GENERATED AS idENTITY PRIMARY KEY,
        registro                    NUMBER NOT NULL,
        tratamiento                 NUMBER NOT NULL,
        efectividad                 NUMBER NOT NULL,
        fecha_inicio_tratamiento    DATE,
        fecha_fin_tratamiento       DATE,
        FOREIGN KEY (registro) REFERENCES RegistroHospital(id),
        FOREIGN KEY (tratamiento) REFERENCES Tratamiento(id)
);


--- INSERTAR INFORMACION
INSERT INTO VICTIMA(NOMBRE, APELLIDO, DIRECCION, FECHA_PRIMERA_SOSPECHA, FECHA_CONFIRMACION, FECHA_MUERTE, ESTADO)
SELECT  DISTINCT NOMBRE_VICTIMA,
        APELLIDO_VICTIMA,
        DIRECCION_VICTIMA,
        FECHA_PRIMERA_SOSPECHA,
        FECHA_CONFIRMACION,
        FECHA_MUERTE,
        ESTADO_VICTIMA
FROM tmp_msc_data
WHERE NOMBRE_VICTIMA IS NOT NULL;

INSERT INTO Hospital (nombre, direccion)
SELECT  DISTINCT NOMBRE_HOSPITAL,
        DIRECCION_HOSPITAL
FROM tmp_msc_data
WHERE NOMBRE_HOSPITAL IS NOT NULL;

INSERT INTO Tratamiento (descripcion,efectividad)
SELECT  DISTINCT TRATAMIENTO,
        EFECTIVIDAD
FROM tmp_msc_data
WHERE EFECTIVIDAD != 0;

INSERT INTO Ubicacion(direccion)
SELECT DISTINCT UBICACION_VICTIMA
FROM tmp_msc_data
WHERE UBICACION_VICTIMA IS NOT NULL;

INSERT INTO Conocido (nombre,apellido)
SELECT  DISTINCT NOMBRE_ASOCIADO,
        APELLIDO_ASOCIADO
FROM tmp_msc_data
WHERE NOMBRE_ASOCIADO IS NOT NULL;

INSERT INTO UbicacionVictima(victima,ubicacion,fecha_llegada,fecha_retiro)
SELECT  DISTINCT v.id,
        u.id,
        t.FECHA_LLEGADA,
        t.FECHA_RETIRO
FROM    Victima v,
        Ubicacion u,
        tmp_msc_data t
WHERE  v.nombre = t.NOMBRE_VICTIMA
AND u.direccion = t.UBICACION_VICTIMA
AND t.UBICACION_VICTIMA IS NOT NULL;

INSERT INTO RegistroHospital (victima,hospital)
SELECT  DISTINCT v.id,
        h.id
FROM    tmp_msc_data t,
        Victima v,
        Hospital h
WHERE t.NOMBRE_VICTIMA = v.nombre
AND t.APELLIDO_VICTIMA = v.apellido
AND t.NOMBRE_HOSPITAL = h.nombre
AND t.NOMBRE_HOSPITAL IS NOT NULL;

INSERT INTO ConocidoVictima (conocido,victima,fecha_conocio,contacto,fecha_inicio_contacto,fecha_fin_contacto)
SELECT  DISTINCT c.id,
        v.id,
        t.FECHA_CONOCIO,
        t.CONTACTO_FISICO,
        t.FECHA_INICIO_CONTACTO,
        t.FECHA_FIN_CONTACTO
FROM    tmp_msc_data t,
        Victima v,
        Conocido c
WHERE t.NOMBRE_VICTIMA = v.nombre
AND t.APELLIDO_VICTIMA = v.apellido
AND t.NOMBRE_ASOCIADO = c.nombre
AND t.APELLIDO_ASOCIADO = c.apellido
AND t.CONTACTO_FISICO IS NOT NULL
AND t.FECHA_INICIO_CONTACTO IS NOT NULL
AND t.FECHA_FIN_CONTACTO IS NOT NULL;

INSERT INTO AplicacionTratamiento(registro,tratamiento,efectividad,fecha_inicio_tratamiento,fecha_fin_tratamiento)
SELECT  DISTINCT r.id,
        tr.id,
        t.EFECTIVIDAD_EN_VICTIMA,
        t.FECHA_INICIO_TRATAMIENTO,
        t.FECHA_FIN_TRATAMIENTO
FROM    RegistroHospital r,
        Tratamiento tr,
        tmp_msc_data t,
        Victima v,
        Hospital h
WHERE r.victima = v.id
AND v.nombre = t.NOMBRE_VICTIMA
AND v.apellido = t.APELLIDO_VICTIMA
AND r.hospital = h.id
AND h.nombre = t.NOMBRE_HOSPITAL
AND tr.descripcion = t.TRATAMIENTO
AND t.TRATAMIENTO IS NOT NULL;