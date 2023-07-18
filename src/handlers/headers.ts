import * as amqp from 'amqplib';

async function headersExchange() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchangeName = 'headers_exchange';

  await channel.assertExchange(exchangeName, 'headers', { durable: true });

  const electronicQueue = 'electronic_queue';
  const clothingQueue = 'clothing_queue';

  await channel.assertQueue(electronicQueue, { durable: true });
  await channel.assertQueue(clothingQueue, { durable: true });

  const electronicHeaders = { category: 'electronics' };
  const clothingHeaders = { category: 'clothing' };

  channel.bindQueue(electronicQueue, exchangeName, '', electronicHeaders);
  channel.bindQueue(clothingQueue, exchangeName, '', clothingHeaders);

  const eletronicPayload = 'new phone';
  const eletronicProperties = { headers: electronicHeaders };
  channel.publish(exchangeName, '', Buffer.from(eletronicPayload), eletronicProperties);
  console.log(`Message sent to electronic_queue: ${eletronicPayload}`);

  const clothingPayload = 'new pants';
  const clothingProperties = { headers: clothingHeaders };
  channel.publish(exchangeName, '', Buffer.from(clothingPayload), clothingProperties);
  console.log(`Message sent to clothing_queue: ${clothingPayload}`);

  channel.consume(electronicQueue, msg => {
    if (msg) {
      const receivedHeaders = msg.properties.headers;
      console.log(`Received electronic product: ${msg.content.toString()}`);
      console.log(`Headers electronic product: ${JSON.stringify(receivedHeaders)}`);
      channel.ack(msg);
    }
  });
  channel.consume(clothingQueue, msg => {
    if (msg) {
      const receivedHeaders = msg.properties.headers;
      console.log(`Received clothing product: ${msg.content.toString()}`);
      console.log(`Headers clothing product: ${JSON.stringify(receivedHeaders)}`);
      channel.ack(msg);
    }
  });
}

headersExchange();
