const amqp = require("amqplib");
const message = "hello, rabbitMQ by minh";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();

    const notificationExchange = "notificationEx"; // notificationEx direct
    const notiQueue = "notificationQueueProcess"; // assert queue
    const notificationExchangeDLX = "notificationExDLX"; // notificationEx direct
    const notificationRoutingKeyDLX = "notificationRoutingKeyDLX"; // assert

    // 1. create exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // 1.1 delete existing queue if it exists
    await channel.deleteQueue(notiQueue);

    // 2. create queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // cho phép các kết nối truy cập vào cùng một hàng đợi (cùng một lúc)
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // 3. bindQueue
    await channel.bindQueue(queueResult.queue, notificationExchange, '');

    // 4. send message
    const msg = "a new product";
    console.log(`producer msg:: `, msg);
    await channel.publish(notificationExchange,"", Buffer.from(msg), {
      expiration: "10000",
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);