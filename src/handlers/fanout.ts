import * as amqp from 'amqplib';

async function fanoutExchange() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchangeName = 'fanout_exchange';

  await channel.assertExchange(exchangeName, 'fanout', { durable: true });

  const fanQueue = 'fan_queue';
  const reporterQueue = 'reporter_queue';

  await channel.assertQueue(fanQueue, { durable: true });
  await channel.assertQueue(reporterQueue, { durable: true });

  channel.bindQueue(fanQueue, exchangeName, '');
  channel.bindQueue(reporterQueue, exchangeName, '');

  const message = 'Concert in the city';
  channel.publish(exchangeName, '', Buffer.from(message));
  console.log(`Message sent to queues: ${message}`);

  channel.consume(fanQueue, msg => {
    if (msg) {
      console.log(`Fan received event: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });

  channel.consume(reporterQueue, msg => {
    if (msg) {
      console.log(`Reporter received event: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });
}

fanoutExchange();
