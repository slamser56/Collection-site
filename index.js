const app = require('./app');
const config = require('./config');
const sequelize = require('./database')

app.listen(config.PORT, () => {
    console.log(`Backend listening on ${config.PORT} port!`);
});