import { execSync } from 'child_process';
import Logger from '@helpers/logger';
import Redis from './index';

jest.mock('child_process', () => ({
    execSync: jest.fn().mockReturnValue('Mock value'),
}));

jest.mock('@helpers/logger', () => ({
    debug: jest.fn(),
    warn: jest.fn(),
}));

describe('Redis', () => {
    it('should initialize the service', () => {
        expect(Redis).toBeDefined();
        expect(Redis.exec).toBeDefined();
    });

    it('should exec properly', () => {
        Redis.exec({
            ip: 'ip',
            port: 'port',
        });
        expect(Logger.debug).toHaveBeenCalled();
        expect(Logger.warn).toHaveBeenCalled();
        expect(execSync).toHaveBeenCalled();
    });

    it('should not print warn on exec if no vulnerable services found', () => {
        execSync.mockReturnValue('no auth error');
        Redis.exec({
            ip: 'ip',
            port: 'port',
        });
        expect(execSync).toHaveBeenCalled();
        expect(Logger.warn).not.toHaveBeenCalled();
    });

    it('should throw proper error on exec run', () => {
        execSync.mockImplementation(() => { throw new Error(); });
        Redis.exec({
            ip: 'ip',
            port: 'port',
        });
        expect(execSync).toHaveBeenCalled();
        expect(Logger.debug).toHaveBeenCalledWith('Error executing redis-cli');
    });
});
