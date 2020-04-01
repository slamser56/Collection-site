const config = require('./config');
const Sequelize = require('sequelize');


var sequelize = new Sequelize(config.Database, config.User_db, config.Password_db, {
    host: config.Host_db,
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection with mySql has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });


module.exports = sequelize