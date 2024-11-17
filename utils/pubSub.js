class PubSub {
    constructor() {
        this.topics = {};
    }

    subscribe(topic, callback) {
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }
        this.topics[topic].push(callback);
    }

    publish(topic, data) {
        if (this.topics[topic]) {
            this.topics[topic].forEach((callback) => callback(data));
        }
    }
}

const pubSub = new PubSub();
module.exports = pubSub;
