const httpRequest = require('@apify/http-request');
const Initializer = require('../../lib/initializer');
const Logger = require('../../lib/logger');

const Elasticsearch = {
    ports: [9200, 9201, 9300],
    name: 'Elasticsearch',
    service: 'elasticsearch',
    init: async ({ ip, port }) => {
        const output = await Elasticsearch.exec({ ip, port });
        const isValid = Elasticsearch.validator({ ip, port, output });
        if (isValid) {
            await Elasticsearch.payload({ ip, port });
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
        if (output.includes('cluster_name') || output.includes('cluster_uuid')) {
            Logger.warn(`Found possible open Elasticsearch service on: http://${ip}:${port}`);
            return true;
        }

        return false;
    },
    payload: ({ ip, port }) => {
        Logger.warn(`PAYLOAD Elasticsearch: ${ip}:${port}`);
    },
};

module.exports = Elasticsearch;
