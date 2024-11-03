'use strict';

const Redis = require('redis');

class RedisPubSubService {
    constructor() {
        this.subscriber = Redis.createClient({
            socket: {
                host: 'localhost', // Đảm bảo rằng đây là địa chỉ đúng của Redis server
                port: 6379, // Đảm bảo rằng đây là cổng đúng của Redis server
                reconnectStrategy: retries => Math.min(retries * 50, 500),
                connectTimeout: 10000 // Tăng thời gian chờ kết nối lên 10 giây
            }
        });
        this.publisher = Redis.createClient({
            socket: {
                host: 'localhost', // Đảm bảo rằng đây là địa chỉ đúng của Redis server
                port: 6379, // Đảm bảo rằng đây là cổng đúng của Redis server
                reconnectStrategy: retries => Math.min(retries * 50, 500),
                connectTimeout: 10000 // Tăng thời gian chờ kết nối lên 10 giây
            }
        });

        this.subscriber.on('error', (err) => console.error('Subscriber Redis Client Error', err));
        this.publisher.on('error', (err) => console.error('Publisher Redis Client Error', err));

        this.subscriber.connect().catch(console.error);
        this.publisher.connect().catch(console.error);
    }

    publish(channel, message) {
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (err, reply) => {
                if (err) reject(err);
                else resolve(reply);
            });
        });
    }

    subscribe(channel, callback) {
        this.subscriber.subscribe(channel);
        this.subscriber.on('message', (subscriberChannel, message) => {
            if (channel === subscriberChannel) {
                callback(channel, message);
            }
        });
    }
}

module.exports = new RedisPubSubService();