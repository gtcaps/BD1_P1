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


app.get('/allVictimas', async (req, res) => {
    res.json({
        consulta: 1,
        data: await db.executeQuery(querys.getAllVictimas)
    });
});

app.get('/eliminarTemporal', async (req, res) => {
    await db.executeQuery(querys.deleteTmp);
    res.json({
        mensaje: 'Datos eliminados de la tabla temporal'
    });
});

app.get('/cargarTemporal', async (req, res) => {
    await db.executeQuery(querys.creatTmp);
    cargaMasiva.cargar();

    res.json({
        mensaje: 'Datos cargados a la tabla temporal'
    });
});

app.listen(3030, () => {
    console.log('API Server listening in port 3030 .....');
});