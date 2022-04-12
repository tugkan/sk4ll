const { EventEmitter } = require('events');

class EventService {
    static getInstance() {
        if (!EventService.instance) {
            EventService.instance = new EventEmitter();
        }
        return EventService.instance;
    }
}
module.exports = EventService;
