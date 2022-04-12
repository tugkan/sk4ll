const util = require('util');
const { exec } = require('child_process');
const Logger = require('../../lib/logger');

const execP = util.promisify(exec);

const FTP = {
    ports: [21],
    name: 'FTP',
    service: 'ftp',
    init: async ({ ip, port }) => {
        const output = await FTP.exec({ ip, port });
        const isValid = FTP.validator({ ip, port, output });
        if (isValid) {
            await FTP.payload({ ip, port });
        }
    },
    exec: async ({ ip, port }) => {
        try {
            Logger.debug(`Executing FTP with ip: ${ip} and port: ${port}`);
            const { stdout } = await execP(`wget ftp://${ip}`);

            return stdout;
        } catch (error) {
            Logger.debug('Error executing FTP shell');
        }
        return '';
    },
    validator: ({ ip, port, output }) => {
        if (output.includes('Logged in')) {
            Logger.warn(`Found vulnerable FTP service on ${ip}:${port}`);
            return true;
        }

        return false;
    },
    payload: ({ ip, port }) => {
        Logger.warn(`PAYLOAD FTP: ${ip}:${port}`);
    },
};

module.exports = FTP;
