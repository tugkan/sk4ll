import util from 'util';
import { exec } from 'child_process';
import Logger from '@lib/logger';

const execP = util.promisify(exec);

const Redis = {
    ports: [6379, 6380],
    name: 'Redis',
    service: 'redis',
    init: async ({ ip, port }) => {
        const output = await Redis.exec({ ip, port });
        const isValid = Redis.validator({ ip, port, output });
        if (isValid) {
            await Redis.payload({ ip, port });
        }
    },
    exec: async ({ ip, port }) => {
        Logger.debug(`Executing redis-cli with ip: ${ip} and port: ${port}`);
        try {
            const { stdout } = await execP(`redis-cli -h ${ip} -p ${port} --scan`);
            return stdout;
        } catch (error) {
            Logger.debug('Error executing redis-cli');
        }
        return '';
    },
    validator: ({ ip, port, output }) => {
        if (!output.includes('error')) {
            Logger.warn(`Found vulnerable Redis service on ${ip}:${port}`);
            return true;
        }

        return false;
    },
    payload: ({ ip, port }) => {
        Logger.warn(`PAYLOAD REDIS: ${ip}:${port}`);
    },
};

export default Redis;
