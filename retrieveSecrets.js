const AWS = require("aws-sdk");
require('dotenv').config()


module.exports = () => {
	//configure AWS SDK
	const region = "ap-southeast-2";
	const client = new AWS.SecretsManager({ region });

	const SecretId = process.env.DB_SECRETE
    console.log(process.env.DB_SECRETE)

	return new Promise((resolve, reject) => {
		//retrieving secrets from secrets manager
		client.getSecretValue({ SecretId }, (err, data) => {
			if (process.env.ENV === 'LOCAL'){
                const secretsJSON = {
                    username: process.env.USERNAME,
                    host: process.env.HOST,
                    database: process.env.DATABASE,
                    password: process.env.PASSWORD,
                    port: process.env.PORT,
                  };
                resolve(secretsJSON);
            }
            else if (err) {
				reject(err);
			} 
            else {
				//parsing the fetched data into JSON
				let secretsJSON = JSON.parse(data.SecretString);
                secretsJSON['database']=process.env.DB_NAME
				resolve(secretsJSON);
			}
		});
	});
};