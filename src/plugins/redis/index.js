const { createClient } = require('redis');
const Logger = require('../../lib/logger');

const Redis = {
    ports: [6379, 6380],
    name: 'Redis',
    service: 'redis',
    init: async ({ ip, port }) => {
        Logger.debug(`Executing redis-cli with ip: ${ip} and port: ${port}`);
        try {
            const client = createClient({
                url: `redis://${ip}:${port}`,
            });
            await client.connect();
            await client.get('*');
            Logger.warn(`Found vulnerable Redis service on ${ip}:${port}`);
            await Redis.payload({ ip, port });
        } catch (error) {
            Logger.debug('Error executing redis-cli');
        }
    },
    payload: ({ ip, port }) => {
        Logger.warn(`PAYLOAD REDIS: ${ip}:${port}`);
    },
};

module.exports = Redis;
