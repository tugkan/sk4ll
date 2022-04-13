const { Client } = require('pg');
const Logger = require('../../lib/logger');

const PostgreSQL = {
    ports: [5432, 5433],
    name: 'Postgre SQL',
    service: 'postgresql',
    init: async ({ ip, port }) => {
        try {
            Logger.debug(`Executing PostgreSQL connection with ip: ${ip} and port: ${port}`);

            const client = new Client({
                user: 'postgres',
                password: 'postgres',
                host: ip,
                port,
            });
            await client.connect();

            Logger.warn(`Found vulnerable PostgreSQL service on ${ip}:${port}`);
            PostgreSQL.payload({ ip, port });
        } catch (error) {
            Logger.debug('Error executing PostgreSQL connection');
        }
    },
    payload: ({ ip, port }) => {
        Logger.warn(`PAYLOAD PostgreSQL: ${ip}:${port}`);
    },
};

module.exports = PostgreSQL;
