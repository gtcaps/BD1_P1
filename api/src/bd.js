const oracledb = require('oracledb');

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

    } catch (err) {
        console.log(err.message);
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

    // Validate Query Rows
    if (result.rows.length == 0) {
        return "data not found";
    } 

    return result.rows;
    
};

module.exports = {
    executeQuery: executeQuery
}