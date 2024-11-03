const amqp = require('amqplib');
const message = 'hello, rabbitMQ by minh'

const runProducer = async() => {
    try {
        const connection = await amqp.connect("amqp://guest:guest@localhost");
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable : true
        })

        // send message to consumer
        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`message sent ::`, message);
    } catch (error) {
        console.error(error);
    }
}

runProducer().catch(console.error);