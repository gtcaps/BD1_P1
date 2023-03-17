const cmd = require('child_process');


module.exports = {

    cargar: () => {
        
        cmd.exec('sqlldr userid=system/1q2w3e4r5t control=../bd/data.ctl', (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return 'error';
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return 'error';
            }

            var arr = stdout.match(/\d+ Filas/g) || [""];
            return arr[0].split(' ')[0];
        });

    }


}