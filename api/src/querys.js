module.exports =  {
    getAllVictimas : `SELECT * FROM VICTIMA WHERE ROWNUM <= 10`,

    deleteTmp : `DROP TABLE TMP_MSC_DATA`,

    creatTmp: `
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
    )
    `

    
}
