const util = require('util');
const { exec } = require('child_process');
const Logger = require('../../lib/logger');

const execP = util.promisify(exec);

const Mysql = {
    ports: [3306],
    name: 'MySQL',
    service: 'mysql',
    init: async ({ ip, port }) => {
        const output = await Mysql.exec({ ip, port });
        const isValid = Mysql.validator({ ip, port, output });
        if (isValid) {
            await Mysql.payload({ ip, port });
        }
    },
    exec: async ({ ip, port }) => {
        try {
            Logger.debug(`Executing mysql shell with ip: ${ip} and port: ${port}`);
            const [output, outputWithPass] = await Promise.all([
                execP(`mysql -h ${ip} -P ${port} -uroot -e 'show databases;' --ssl-mode=DISABLED`),
                execP(`mysql -h ${ip} -P ${port} -uroot -proot -e 'show databases;' --ssl-mode=DISABLED`),
            ]);
            return `${output.stdout}\n${outputWithPass.stdout}`;
        } catch (error) {
            Logger.debug('Error executing mysql shell');
        }
        return '';
    },
    validator: ({ ip, port, output }) => {
        if (!output.includes('denied')
        && !output.includes('not allowed')
        && !output.includes('Lost connection')) {
            Logger.warn(`Found vulnerable MySQL service on ${ip}:${port}`);
            return true;
        }

        return false;
    },
    payload: ({ ip, port }) => {
        Logger.warn(`PAYLOAD MYSQL: ${ip}:${port}`);
    },
};

module.exports = Mysql;
