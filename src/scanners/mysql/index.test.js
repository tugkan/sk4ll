import { execSync } from 'child_process';
import Logger from '@helpers/logger';
import Mysql from './index';

jest.mock('child_process', () => ({
    execSync: jest.fn().mockReturnValue('Mock value'),
}));

jest.mock('@helpers/logger', () => ({
    debug: jest.fn(),
    warn: jest.fn(),
}));

describe('Mysql', () => {
    it('should initialize the service', () => {
        expect(Mysql).toBeDefined();
        expect(Mysql.exec).toBeDefined();
    });

    it('should print on vulnerable services found on exec', () => {
        Mysql.exec({
            ip: 'ip',
            port: 'port',
        });
        expect(execSync).toHaveBeenCalled();
        expect(Logger.warn).toHaveBeenCalled();
    });

    it('should print on vulnerable services found on exec', () => {
        execSync.mockImplementation(() => { throw new Error(); });
        Mysql.exec({
            ip: 'ip',
            port: 'port',
        });
        expect(execSync).toHaveBeenCalled();
        expect(Logger.debug).toHaveBeenCalled();
    });
});
