import util from 'util';
import { exec } from 'child_process';
import Logger from '@lib/logger';

const execP = util.promisify(exec);

const SSH = {
    ports: [22],
    name: 'SSH',
    service: 'ssh',
    init: async ({ ip, port }) => {
        const output = await SSH.exec({ ip, port });
        const isValid = SSH.validator({ ip, port, output });
        if (isValid) {
            await SSH.payload({ ip, port });
        }
    },
    exec: async ({ ip, port }) => {
        try {
            Logger.debug(`Executing SSH with ip: ${ip} and port: ${port}`);
            const { stdout } = await execP(`ssh -o StrictHostKeyChecking=no root@${ip} -t 'whoami'`);
            return stdout;
        } catch (error) {
            Logger.debug('Error executing SSH shell');
        }
    },
    validator: ({ ip, port, output }) => {
        if (output.includes('root')) {
            Logger.warn(`Found vulnerable SSH service on ${ip}:${port}`);
            return true;
        }

        return false;
    },
    payload: ({ ip, port }) => {
        Logger.warn(`PAYLOAD SSH: ${ip}:${port}`);
    },
};

export default SSH;
