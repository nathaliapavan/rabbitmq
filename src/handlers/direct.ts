import * as amqp from 'amqplib';

async function directExchange() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchangeName = 'direct_exchange';

  await channel.assertExchange(exchangeName, 'direct', { durable: true });

  const orderQueue = 'order_queue';
  const orderRoutingKey = 'order_key';
  const paymentQueue = 'payment_queue';
  const paymentRoutingKey = 'payment_key';
  const messageQueue = 'message_queue';
  const messageRoutingKey = 'message_key';

  await channel.assertQueue(orderQueue, { durable: true });
  await channel.assertQueue(paymentQueue, { durable: true });
  await channel.assertQueue(messageQueue, { durable: true });

  channel.bindQueue(orderQueue, exchangeName, orderRoutingKey);
  channel.bindQueue(paymentQueue, exchangeName, paymentRoutingKey);
  channel.bindQueue(messageQueue, exchangeName, messageRoutingKey);

  const orderPayload = 'new order';
  channel.publish(exchangeName, orderRoutingKey, Buffer.from(orderPayload));
  console.log(`Message sent to orderQueue: ${orderPayload}`);

  const paymentPayload = 'new payment';
  channel.publish(exchangeName, paymentRoutingKey, Buffer.from(paymentPayload));
  console.log(`Message sent to paymentQueue: ${paymentPayload}`);

  const messagePayload = 'new message';
  channel.publish(exchangeName, messageRoutingKey, Buffer.from(messagePayload));
  console.log(`Message sent to messageQueue: ${messagePayload}`);

  channel.consume(orderQueue, msg => {
    if (msg) {
      console.log(`Received order notification: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });

  channel.consume(paymentQueue, msg => {
    if (msg) {
      console.log(`Received payment notification: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });

  channel.consume(messageQueue, msg => {
    if (msg) {
      console.log(`Received message notification: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });
}

directExchange();
