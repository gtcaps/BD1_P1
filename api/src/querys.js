module.exports =  {
    deleteTmp : `DROP TABLE TMP_MSC_DATA`,

    createTmp: `
    CREATE TABLE tmp_msc_data (
        nombre_victima              VARCHAR(200),
        apellido_victima	        VARCHAR(200),
        direccion_victima	        VARCHAR(200),
        fecha_primera_sospecha	    DATE,
        fecha_confirmacion          DATE,
        fecha_muerte                DATE,
        estado_victima              VARCHAR(200),
        nombre_asociado             VARCHAR(200),
        apellido_asociado           VARCHAR(200),
        fecha_conocio               DATE,
        contacto_conocio             VARCHAR(200),
        fecha_inicio_contacto       DATE,
        fecha_fin_contacto          DATE,
        nombre_hospital             VARCHAR(200),
        direccion_hospital          VARCHAR(200),
        ubicacion_victima           VARCHAR(200),
        fecha_llegada               DATE,
        fecha_retiro                DATE,
        tratamiento                 VARCHAR(200),
        efectividad                 INT,
        fecha_inicio_tratamiento    DATE,
        fecha_fin_tratamiento       DATE,
        efectividad_en_victima      INT
    )
    `,

    createModelVictima: `
    CREATE TABLE VICTIMA (
        id                      INT GENERATED AS IDENTITY PRIMARY KEY,
        nombre                  VARCHAR(200),
        apellido                VARCHAR(200),
        direccion               VARCHAR(200),
        fecha_primera_sospecha  DATE,
        fecha_confirmacion      DATE,
        fecha_muerte            DATE,
        estado                  VARCHAR(200)
    )
    `,

    createModelHospital: `
    CREATE TABLE HOSPITAL (
        id                      INT GENERATED AS IDENTITY PRIMARY KEY,
        nombre                  VARCHAR(200),
        direccion               VARCHAR(200)
    )
    `,

    createModelTratamiento: `
    CREATE TABLE TRATAMIENTO (
        id                      INT GENERATED AS IDENTITY PRIMARY KEY,
        descripcion             VARCHAR(200),
        efectividad             INT NOT NULL
    )
    `,

    createModelUbicacion: `
    CREATE TABLE UBICACION (
        id                      INT GENERATED AS IDENTITY PRIMARY KEY,
        direccion               VARCHAR(200)
    )
    `,

    createModelConocido: `
    CREATE TABLE CONOCIDO (
        id                      INT GENERATED AS IDENTITY PRIMARY KEY,
        nombre                  VARCHAR(200),
        apellido                VARCHAR(200)
    )
    `,

    createModelUbicacionVictima: `
    CREATE TABLE UbicacionVictima (
        id                      INT GENERATED AS IDENTITY PRIMARY KEY,
        victima                 INT NOT NULL,
        ubicacion               INT NOT NULL,
        fecha_llegada           DATE,
        fecha_retiro            DATE,
        FOREIGN KEY (victima) REFERENCES Victima(id),
        FOREIGN KEY (ubicacion) REFERENCES Ubicacion(id)
    )
    `,

    createModelConocidoVictima: `
    CREATE TABLE ConocidoVictima (
        id                      INT GENERATED AS IDENTITY PRIMARY KEY,
        victima                 INT NOT NULL,
        conocido                INT NOT NULL,
        contacto                VARCHAR(200),
        fecha_conocio           DATE,
        fecha_inicio_contacto   DATE,
        fecha_fin_contacto      DATE,
        FOREIGN KEY (victima) REFERENCES Victima(id),
        FOREIGN KEY (conocido) REFERENCES Conocido(id)
    )
    `,

    createModelRegistroHospital: `
    CREATE TABLE RegistroHospital (
        id                      INT GENERATED AS IDENTITY PRIMARY KEY,
        victima                 INT NOT NULL,
        hospital                INT NOT NULL,
        FOREIGN KEY (victima) REFERENCES Victima(id),
        FOREIGN KEY (hospital) REFERENCES Hospital(id)
    )
    `,

    createModelAplicacionTratamiento: `
    CREATE TABLE AplicacionTratamiento (
        id                          INT GENERATED AS IDENTITY PRIMARY KEY,
        registro                    INT NOT NULL,
        tratamiento                 INT NOT NULL,
        efectividad                 INT NOT NULL,
        fecha_inicio_tratamiento    DATE,
        fecha_fin_tratamiento       DATE,
        FOREIGN KEY (registro) REFERENCES RegistroHospital(id),
        FOREIGN KEY (tratamiento) REFERENCES Tratamiento(id)
    )
    `,

    fillModelVictima: `
    INSERT INTO VICTIMA(NOMBRE, APELLIDO, DIRECCION, FECHA_PRIMERA_SOSPECHA, FECHA_CONFIRMACION, FECHA_MUERTE, ESTADO)
    SELECT  DISTINCT NOMBRE_VICTIMA,
            APELLIDO_VICTIMA,
            DIRECCION_VICTIMA,
            FECHA_PRIMERA_SOSPECHA,
            FECHA_CONFIRMACION,
            FECHA_MUERTE,
            ESTADO_VICTIMA
    FROM tmp_msc_data
    WHERE NOMBRE_VICTIMA IS NOT NULL
    `,
    
    fillModelHospital: `
    INSERT INTO Hospital (nombre, direccion)
    SELECT  DISTINCT NOMBRE_HOSPITAL, 
            DIRECCION_HOSPITAL
    FROM tmp_msc_data
    WHERE NOMBRE_HOSPITAL IS NOT NULL
    `,

    fillModelTratamiento: `
    INSERT INTO Tratamiento (descripcion,efectividad)
        SELECT DISTINCT
        TRATAMIENTO, EFECTIVIDAD
        FROM tmp_msc_data
        WHERE EFECTIVIDAD != 0
    `,

    fillModelUbicacion: `
    INSERT INTO Ubicacion(direccion)
        SELECT DISTINCT UBICACION_VICTIMA
        FROM tmp_msc_data
        WHERE UBICACION_VICTIMA IS NOT NULL
    `,

    fillModelConocido: `
    INSERT INTO Conocido (nombre,apellido)
    SELECT  DISTINCT NOMBRE_ASOCIADO,
            APELLIDO_ASOCIADO
    FROM tmp_msc_data
    WHERE NOMBRE_ASOCIADO IS NOT NULL
    `,

    fillModelUbicacionVictima: `
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
    AND t.UBICACION_VICTIMA IS NOT NULL
    `,

    fillModelRegistroHospital: `
    INSERT INTO RegistroHospital (victima,hospital)
    SELECT  DISTINCT v.id,
            h.id
    FROM    tmp_msc_data t,
            Victima v,
            Hospital h
    WHERE t.NOMBRE_VICTIMA = v.nombre
    AND t.APELLIDO_VICTIMA = v.apellido
    AND t.NOMBRE_HOSPITAL = h.nombre
    AND t.NOMBRE_HOSPITAL IS NOT NULL
    `,

    fillModelConocidoVictima: `
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
    AND t.FECHA_FIN_CONTACTO IS NOT NULL
    `,

    fillModelAplicacionTratamiento: `
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
    AND t.TRATAMIENTO IS NOT NULL
    `,

    dropModelAplicacionTratamiento: `DROP TABLE AplicacionTratamiento`,
    dropModelRegistroHospital: `DROP TABLE RegistroHospital`,
    dropModelConocidoVictima: `DROP TABLE ConocidoVictima`,
    dropModelUbicacionVictima: `DROP TABLE UbicacionVictima`,
    dropModelConocido: `DROP TABLE CONOCIDO`,
    dropModelUbicacion: `DROP TABLE UBICACION`,
    dropModelTratamiento: `DROP TABLE TRATAMIENTO`,
    dropModelHospital: `DROP TABLE HOSPITAL`,
    dropModelVictima: `DROP TABLE VICTIMA`,

    query1: `
    SELECT hospital, direccion, fallecidos
    FROM (
        SELECT h.nombre AS Hospital, h.direccion AS Direccion, COUNT(v.fecha_muerte) AS Fallecidos
        FROM victima v
        INNER JOIN registroHospital r ON v.id = r.victima
        INNER JOIN hospital h ON r.HOSPITAL = h.ID
        GROUP BY h.nombre, h.direccion
    )
    ORDER BY fallecidos DESC, hospital ASC
    `,

    query2: `
    SELECT  v.nombre , v.apellido, a.efectividad
    FROM victima v
    INNER JOIN registroHospital r ON v.id = r.victima
    INNER JOIN aplicacionTratamiento a ON r.id = a.registro
    INNER JOIN tratamiento t ON t.id = a.tratamiento
    WHERE v.estado = 'En cuarentena'
    AND t.descripcion = 'Transfusiones de sangre'
    AND a.efectividad > 5
    ORDER BY a.efectividad DESC, v.nombre ASC, v.apellido ASC
    `,

    query3: `
    SELECT v.nombre AS nombre,v.apellido as apellido, direccion as direccion, a.personas as personas
    FROM victima v
    INNER JOIN (
        SELECT c.victima AS v, COUNT(c.conocido) as personas
        FROM conocidoVictima c
        GROUP BY c.victima
        HAVING COUNT(c.conocido) > 3
    ) a ON v.id = a.v
    WHERE v.fecha_muerte IS NOT NULL
    ORDER BY a.personas DESC, v.nombre ASC
    `,

    query4: `
    SELECT v.nombre as nombre, v.apellido as apellido, a.asociados as asociados
    FROM victima v
    INNER JOIN conocidoVictima c ON v.id = c.victima
    INNER JOIN (
        SELECT c.victima AS v, COUNT(c.conocido) as asociados
        FROM ConocidoVictima c
        GROUP BY c.victima
        HAVING COUNT(c.conocido)>2
    ) a ON v.id = a.v
    WHERE v.estado = 'Suspendida'
    AND c.contacto = 'Beso'
    ORDER BY a.asociados DESC, v.nombre ASC
    `,

    query5: `
    SELECT nombre, apellido, cantidadTratamientos
    FROM (
        SELECT v.nombre as nombre,v.apellido as apellido, COUNT(a.fecha_inicio_tratamiento) as cantidadTratamientos
        FROM victima v
        INNER JOIN registroHospital r ON r.victima = v.id
        INNER JOIN aplicacionTratamiento a ON a.registro = r.id
        INNER JOIN tratamiento t ON t.id = a.tratamiento
        WHERE t.descripcion = 'Oxigeno'
        GROUP BY v.nombre, v.apellido
        ORDER BY COUNT(a.fecha_inicio_tratamiento) DESC, v.nombre ASC, v.apellido ASC
    )
    WHERE ROWNUM <= 5
    `,

    query6: `
    `,

    query7: `
    `,

    query8: `
    `,

    query9: `
    `,

    query10: `
    `,
    
}
