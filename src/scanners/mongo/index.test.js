import { execSync } from 'child_process';
import Logger from '@helpers/logger';
import Mongo from './index';

jest.mock('child_process', () => ({
    execSync: jest.fn().mockReturnValue('Mock value'),
}));

jest.mock('@helpers/logger', () => ({
    debug: jest.fn(),
    warn: jest.fn(),
}));

describe('Mongo', () => {
    it('should initialize the service', () => {
        expect(Mongo).toBeDefined();
        expect(Mongo.exec).toBeDefined();
    });

    it('should not print anything if no vulnerable services found on exec', () => {
        Mongo.exec({
            ip: 'ip',
            port: 'port',
        });
        expect(execSync).toHaveBeenCalled();
        expect(Logger.warn).not.toHaveBeenCalled();
    });

    it('should print warn on exec if vulnerable services found', () => {
        execSync.mockReturnValue('"databases"');
        Mongo.exec({
            ip: 'ip',
            port: 'port',
        });
        expect(execSync).toHaveBeenCalled();
        expect(Logger.warn).toHaveBeenCalled();
    });

    it('should throw proper error on exec run', () => {
        execSync.mockImplementation(() => { throw new Error(); });
        Mongo.exec({
            ip: 'ip',
            port: 'port',
        });
        expect(execSync).toHaveBeenCalled();
        expect(Logger.debug).toHaveBeenCalledWith('Error executing mongo shell');
    });
});
