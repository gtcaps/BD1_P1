const express =  require('express');
const db = require('./bd');
const querys = require('./querys')
const cargaMasiva = require('./cargaMasiva')

const app = express();

app.get('/', (req, res) => {
    res.json({
        nombre: 'Aybson Diddiere Mercado Grijalva',
        carnet: 201700312,
        curso:  'Bases de Datos 1'
    });
});


app.get('/eliminarTemporal', async (req, res) => {
    await db.executeQuery(querys.deleteTmp);
    res.json({
        mensaje: 'Datos eliminados de la tabla temporal'
    });
});

app.get('/cargarTemporal', async (req, res) => {
    await db.executeQuery(querys.createTmp);
    cargaMasiva.cargar();

    res.json({
        mensaje: 'Datos cargados a la tabla temporal'
    });
});

app.get('/eliminarModelo', async (req, res) => {
    await db.executeQuery(querys.dropModelAplicacionTratamiento);
    await db.executeQuery(querys.dropModelRegistroHospital);
    await db.executeQuery(querys.dropModelConocidoVictima);
    await db.executeQuery(querys.dropModelUbicacionVictima);
    await db.executeQuery(querys.dropModelConocido);
    await db.executeQuery(querys.dropModelUbicacion);
    await db.executeQuery(querys.dropModelTratamiento);
    await db.executeQuery(querys.dropModelHospital);
    await db.executeQuery(querys.dropModelVictima);
    
    res.json({
        mensaje: 'Tablas de Datos del Modelo Eliminadas'
    });
});

app.get('/cargarModelo', async (req, res) => {
    // CREAR TABLAS DEL MODELO
    await db.executeQuery(querys.createModelVictima);
    await db.executeQuery(querys.createModelHospital);
    await db.executeQuery(querys.createModelTratamiento);
    await db.executeQuery(querys.createModelUbicacion);
    await db.executeQuery(querys.createModelConocido);
    await db.executeQuery(querys.createModelUbicacionVictima);
    await db.executeQuery(querys.createModelConocidoVictima);
    await db.executeQuery(querys.createModelRegistroHospital);
    await db.executeQuery(querys.createModelAplicacionTratamiento);

    // LLENAR TABLAS DEL MODELO
    await db.executeQuery(querys.fillModelVictima);
    await db.executeQuery(querys.fillModelHospital);
    await db.executeQuery(querys.fillModelTratamiento);
    await db.executeQuery(querys.fillModelUbicacion);
    await db.executeQuery(querys.fillModelConocido);
    await db.executeQuery(querys.fillModelUbicacionVictima);
    await db.executeQuery(querys.fillModelRegistroHospital);
    await db.executeQuery(querys.fillModelConocidoVictima);
    await db.executeQuery(querys.fillModelAplicacionTratamiento);
    
    res.json({
        mensaje: 'Tablas de Datos del Modelo Creada y Llenada'
    });
});

app.get('/consulta1', async (req, res) => {
    let data = await db.executeQuery(querys.query1);
    res.json({
        consulta: 1,
        filas: data.length,
        data: data
    });
});

app.get('/consulta2', async (req, res) => {
    let data = await db.executeQuery(querys.query2);
    res.json({
        consulta: 2,
        filas: data.length,
        data: data
    });
});

app.get('/consulta3', async (req, res) => {
    let data = await db.executeQuery(querys.query3);
    res.json({
        consulta: 3,
        filas: data.length,
        data: data
    });
});

app.get('/consulta4', async (req, res) => {
    let data = await db.executeQuery(querys.query4);
    res.json({
        consulta: 4,
        filas: data.length,
        data: data
    });
});

app.get('/consulta5', async (req, res) => {
    let data = await db.executeQuery(querys.query5);
    res.json({
        consulta: 5,
        filas: data.length,
        data: data
    });
});

app.get('/consulta6', async (req, res) => {
    res.json({
        consulta: 1,
        data: await db.executeQuery(querys.query6)
    });
});

app.get('/consulta7', async (req, res) => {
    res.json({
        consulta: 1,
        data: await db.executeQuery(querys.query7)
    });
});

app.get('/consulta8', async (req, res) => {
    res.json({
        consulta: 1,
        data: await db.executeQuery(querys.query8)
    });
});

app.get('/consulta9', async (req, res) => {
    res.json({
        consulta: 1,
        data: await db.executeQuery(querys.query9)
    });
});

app.get('/consulta10', async (req, res) => {
    res.json({
        consulta: 1,
        data: await db.executeQuery(querys.query10)
    });
});

app.listen(3030, () => {
    console.log('API Server listening in port 3030 .....');
});