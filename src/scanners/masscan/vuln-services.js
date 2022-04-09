export default [
    { service: 'mongo', port: 27017, method: 'mongo' },
    { service: 'mongo', port: 27018, method: 'mongo' },
    { service: 'elastic', port: 9200, method: 'html' },
    { service: 'elastic', port: 9300, method: 'html' },
    { service: 'kibana', port: 5600, method: 'html' },
    { service: 'kibana', port: 5603, method: 'html' },
    { service: 'kibana', port: 5601, method: 'html' },
    { service: 'redis', port: 6379, method: 'redis' },
    { service: 'redis', port: 6380, method: 'redis' },
    { service: 'web', port: 80, method: 'html' },
    { service: 'web', port: 443, method: 'html' },
    { service: 'mysql', port: 3306, method: 'mysql' },
    { service: 'gitlab or web', port: 5000, method: 'html' },
    { service: 'gitlab or web', port: 5050, method: 'html' },
    { service: 'grafana or web', port: 3000, method: 'html' },
];
