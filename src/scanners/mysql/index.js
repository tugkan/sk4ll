import { execSync } from 'child_process';
import Logger from '@helpers/logger';

const Mysql = {};

Mysql.exec = ({ ip, port }) => {
    try {
        Logger.debug(`Executing mysql shell with ip: ${ip} and port: ${port}`);
        const resultNoPassword = execSync(`mysql -h ${ip} -P ${port} -uroot -e 'show databases;' --ssl-mode=DISABLED`, { stdio: 'pipe' }).toString();
        if (!resultNoPassword.includes('denied')
         && !resultNoPassword.includes('not allowed')
         && !resultNoPassword.includes('Lost connection')) {
            Logger.warn(`Found vulnerable MySQL service on ${ip}:${port}`);
        }

        const result = execSync(`mysql -h ${ip} -P ${port} -uroot -proot -e 'show databases;' --ssl-mode=DISABLED`, { stdio: 'pipe' }).toString();
        if (!result.includes('denied')
         && !result.includes('not allowed')
         && !result.includes('Lost connection')) {
            Logger.warn(`Found vulnerable MySQL service on ${ip}:${port}`);
        }
    } catch (error) {
        Logger.debug('Error executing mysql shell');
    }
};

export default Mysql;
