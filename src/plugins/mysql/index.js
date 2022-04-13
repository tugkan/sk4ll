const mysql = require('promise-mysql');
const Logger = require('../../lib/logger');

const Mysql = {
    ports: [3306],
    name: 'MySQL',
    service: 'mysql',
    init: async ({ ip, port }) => {
        try {
            await mysql.createConnection({
                host: ip,
                port,
                user: 'root',
            });
            await Mysql.payload({ ip, port });
        } catch (error) {
            Logger.debug('Error executing mysql shell');
        }
    },
    payload: ({ ip, port }) => {
        Logger.warn(`PAYLOAD MYSQL: ${ip}:${port}`);
    },
};

module.exports = Mysql;
