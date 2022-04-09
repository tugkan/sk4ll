import httpRequest from '@apify/http-request';
import cheerio from 'cheerio';
import Logger from '@helpers/logger';
import Initializer from '@helpers/initializer';

const HTMLParser = {};

function checkVulnerableHTML(body, ip, port, protocol) {
    const $ = cheerio.load(body);
    if (body.includes('Index of')) {
        Logger.warn(`Found possible Directory Listing on: http://${ip}:${port}`);
    } else if (body.includes('cluster_name') || body.includes('cluster_uuid')) {
        Logger.warn(`Found possible open Elasticsearch service on: http://${ip}:${port}`);
    } else {
        Logger.output(`Found title on ${protocol}${ip}:${port} - ${$('title').text().trim()}`);
    }
}

HTMLParser.parse = async ({ ip, port }) => {
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

        checkVulnerableHTML(response.body, ip, port, protocol);
    } catch (error) {
        Logger.debug(error);
    }
};

export default HTMLParser;
