import util from 'util';
import { exec } from 'child_process';
import Logger from '@lib/logger';

const execP = util.promisify(exec);

const Mongo = {
    ports: [27017, 27018],
    name: 'Mongo',
    service: 'mongo',
    init: async ({ ip, port }) => {
        const output = await Mongo.exec({ ip, port });
        const isValid = Mongo.validator({ ip, port, output });
        if (isValid) {
            await Mongo.payload({ ip, port });
        }
    },
    exec: async ({ ip, port }) => {
        try {
            Logger.debug(`Executing mongo shell with ip: ${ip} and port: ${port}`);
            const { stdout } = await execP(`mongo ${ip}:${port} --eval 'db.adminCommand({listDatabases:1})'`);
            return stdout;
        } catch (error) {
            Logger.debug('Error executing mongo shell');
        }
        return '';
    },
    validator: ({ ip, port, output }) => {
        if (output.includes('"databases"')) {
            Logger.warn(`Found vulnerable Mongo service on ${ip}:${port}`);
            return true;
        }
        return false;
    },
    payload: ({ ip, port }) => {
        Logger.warn(`PAYLOAD Mongo: ${ip}:${port}`);
    },
};

export default Mongo;
