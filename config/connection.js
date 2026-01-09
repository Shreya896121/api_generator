const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname,'..', '.env') });
const Sequelize = require('sequelize');

const sequelizeInstance = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server:process.env.DB_HOST,
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: false,
            trustServerCertificate: true,
            instanceName:process.env.DB_INSTANCE
        }
    },
    logging:false
});

sequelizeInstance.authenticate()
    .then(() => {
        console.log('Database connection successful!');
    })
    .catch(error => {
        console.error('Database connection failed:', error.message);
    });

const sfContext={
    database: sequelizeInstance,  
    query: sequelizeInstance.query.bind(sequelizeInstance), 
}

module.exports = sfContext;

