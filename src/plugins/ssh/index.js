const { NodeSSH } = require('node-ssh');
const Logger = require('../../lib/logger');

const ssh = new NodeSSH();

const SSH = {
    ports: [22],
    name: 'SSH',
    service: 'ssh',
    init: async ({ ip, port }) => {
        try {
            Logger.debug(`Executing SSH with ip: ${ip} and port: ${port}`);
            await ssh.connect({
                host: ip,
                username: 'root',
            });
            await SSH.payload({ ip, port });
        } catch (error) {
            Logger.debug('Error executing SSH shell');
        }
    },
    payload: ({ ip, port }) => {
        Logger.warn(`PAYLOAD SSH: ${ip}:${port}`);
    },
};

module.exports = SSH;
