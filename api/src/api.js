const express =  require('express');
const db = require('./bd');
const querys = require('./querys')

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


app.listen(3030, () => {
    console.log('API Server listening in port 3030 .....');
});