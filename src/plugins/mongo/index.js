const { MongoClient } = require('mongodb');
const Logger = require('../../lib/logger');

const Mongo = {
    ports: [27017, 27018],
    name: 'Mongo',
    service: 'mongo',
    init: async ({ ip, port }) => {
        try {
            Logger.debug(`Executing mongo shell with ip: ${ip} and port: ${port}`);
            await MongoClient.connect(`mongodb://${ip}:${port}`);
            Logger.warn(`Found vulnerable Mongo service on ${ip}:${port}`);
            Mongo.payload({ ip, port });
        } catch (error) {
            Logger.debug('Error executing mongo shell');
        }
    },
    payload: ({ ip, port }) => {
        Logger.warn(`PAYLOAD Mongo: ${ip}:${port}`);
    },
};

module.exports = Mongo;
