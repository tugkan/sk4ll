import { execSync } from 'child_process';
import Logger from '@helpers/logger';

const Mongo = {};

Mongo.exec = ({ ip, port }) => {
    Logger.debug(`Executing mongo shell with ip: ${ip} and port: ${port}`);
    try {
        const result = execSync(`mongo ${ip}:${port} --eval 'db.adminCommand({listDatabases:1})'`, { stdio: 'pipe' }).toString();
        if (result.includes('"databases"')) {
            Logger.warn(`Found vulnerable Mongo service on ${ip}:${port}`);
        }
    } catch (error) {
        Logger.debug('Error executing mongo shell');
    }
};

export default Mongo;
