const oracledb = require('oracledb');
oracledb.autoCommit = true;

const connectionString = {
    user:               'system',
    password:           '1q2w3e4r5t',
    connectionString:   'localhost' 
};

const executeQuery = async (query) => {
    try {
        // Connect to Oracle DB
        connection = await oracledb.getConnection(connectionString);
        console.log('Connected to database');

        // Execute Query
        result = await connection.execute(query);
        console.log(result);

    } catch (err) {
        console.log(err.message);
        result = {rows: {length: 0}};
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('Connection closed');
            } catch (err) {
                console.log(err.message);
            }
        }
    }


    // Rows Affected
    
    if (result.rowsAffected != undefined) {
        return result.rowsAffected;
    }


    return result.rows;
    
};

module.exports = {
    executeQuery: executeQuery
}