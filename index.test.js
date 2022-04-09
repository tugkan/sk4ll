import Initializer from '@helpers/initializer';
import Masscan from '@scanners/masscan';

import App from './index';

jest.mock('@scanners/masscan', () => ({
    exec: jest.fn(),
}));

jest.mock('@helpers/initializer', () => ({
    init: jest.fn().mockReturnValue({
        cidrBlocks: [],
        ports: [],
    }),
    initListeners: jest.fn(),
}));

describe('App', () => {
    it('should run the base app', () => {
        App.init();
        expect(Initializer.init).toHaveBeenCalled();
        expect(Masscan.exec).toHaveBeenCalledWith([], []);
        expect(Initializer.initListeners).toHaveBeenCalled();
    });
});
