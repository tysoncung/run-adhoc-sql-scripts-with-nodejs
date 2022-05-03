const retrieveSecrets = require("./retrieveSecrets");
const { Client, Pool } = require("pg");
var fs = require('fs');


require('dotenv').config()

var sql = fs.readFileSync('./scripts.sql').toString();

async function runSQL() {
    const sc = await retrieveSecrets();

    const credentials = {
        user: sc['username'],
        host: sc['host'],
        database: sc['database'],
        password: sc['password'],
        port: 5432,
    };
    const pool = new Pool(credentials);
    let dbClient = await pool.connect();

    var statements = sql.split(/;\s*$/m);

    for (const statement of statements){
        if (statement) {
            console.log("Run:"+statement);
            let res =  await dbClient.query(statement);
            console.log(res.rows[0]);
        }
    };
    dbClient.end();
}

(async () => {

    await runSQL();

})();