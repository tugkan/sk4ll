import httpRequest from '@apify/http-request';
import Logger from '@lib/logger';
import Initializer from '@lib/initializer';

const DirectoryListing = {
    ports: [80, 443],
    name: 'Directory Listing',
    service: 'directorylisting',
    init: async ({ ip, port }) => {
        const output = await DirectoryListing.exec({ ip, port });
        const isValid = DirectoryListing.validator({ ip, port, output });
        if (isValid) {
            await DirectoryListing.payload({ ip, port });
        }
    },
    exec: async ({ ip, port }) => {
        try {
            const protocol = port === 443 ? 'https://' : 'http://';

            const proxyUrl = Initializer.argv.p || Initializer.argv.proxy;
            const response = await httpRequest({
                url: `${protocol}${ip}:${port}`,
                method: 'GET',
                ...(proxyUrl ? { proxyUrl } : {}),
                timeoutSecs: 120,
                https: {
                    rejectUnauthorized: false,
                },
                abortFunction: () => false,
            });

            return response.body;
        } catch (error) {
            Logger.debug(error);
        }
        return '';
    },
    validator: ({ ip, port, output }) => {
        if (output.includes('Index of')) {
            Logger.warn(`Found possible Directory Listing on: http://${ip}:${port}`);
            return true;
        }
        return false;
    },
    payload: ({ ip, port }) => {
        Logger.warn(`PAYLOAD DirectoryListing: ${ip}:${port}`);
    },
};

export default DirectoryListing;
