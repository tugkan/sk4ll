import { execSync } from 'child_process';
import Logger from '@helpers/logger';

const Redis = {};

Redis.exec = ({ ip, port }) => {
    Logger.debug(`Executing redis-cli with ip: ${ip} and port: ${port}`);
    try {
        const result = execSync(`redis-cli -h ${ip} -p ${port} --scan`, { stdio: 'pipe' }).toString();

        if (!result.includes('error')) {
            Logger.warn(`Found vulnerable Redis service on ${ip}:${port}`);
        }
    } catch (error) {
        Logger.debug('Error executing redis-cli');
    }
};

export default Redis;
