import { EventEmitter } from 'events';

class EventService {
    static getInstance() {
        if (!EventService.instance) {
            EventService.instance = new EventEmitter();
        }
        return EventService.instance;
    }

    static get constants() {
        return {
            scanner: {
                masscan: {
                    get: 'masscan.get',
                },
                mongo: {
                    scan: 'mongo.scan',
                },
                redis: {
                    scan: 'redis.scan',
                },
                mysql: {
                    scan: 'mysql.scan',
                },
                html: {
                    scan: 'html.scan',
                },
            },
        };
    }
}
module.exports = EventService;
