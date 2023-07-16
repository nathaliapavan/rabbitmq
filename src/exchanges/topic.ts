import * as amqp from 'amqplib';

async function topicExchange() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchangeName = 'topic_exchange';

  await channel.assertExchange(exchangeName, 'topic', { durable: true });

  const temperatureQueue = 'temperature_queue';
  const temperatureRoutingKey = 'sensor.temperature';
  const humidityQueue = 'humidity_queue';
  const humidityRoutingKey = 'sensor.humidity';
  const pressureQueue = 'pressure_queue';
  const pressureRoutingKey = 'sensor.*';

  await channel.assertQueue(temperatureQueue, { durable: true });
  await channel.assertQueue(humidityQueue, { durable: true });
  await channel.assertQueue(pressureQueue, { durable: true });

  await channel.bindQueue(temperatureQueue, exchangeName, temperatureRoutingKey);
  await channel.bindQueue(humidityQueue, exchangeName, humidityRoutingKey);
  await channel.bindQueue(pressureQueue, exchangeName, pressureRoutingKey);

  const temperaturePayload = 'Current temperature: 25°C';
  const humidityPayload = 'Current humidity: 50%';
  const pressurePayload = 'Current pressure: 1013 hPa';

  channel.publish(exchangeName, temperatureRoutingKey, Buffer.from(temperaturePayload));
  console.log(`Message sent to temperature_queue: ${temperaturePayload}`);

  channel.publish(exchangeName, humidityRoutingKey, Buffer.from(humidityPayload));
  console.log(`Message sent to humidity_queue: ${humidityPayload}`);

  channel.publish(exchangeName, 'sensor.pressure', Buffer.from(pressurePayload));
  console.log(`Message sent to exchange topic_exchange with routing key sensor.pressure: ${pressurePayload}`);

  channel.publish(exchangeName, 'sensor.whatever', Buffer.from(`${pressurePayload} Whatever`));
  console.log(`Message sent to exchange topic_exchange with routing key sensor.whatever: ${pressurePayload}`);

  channel.consume(temperatureQueue, (msg) => {
    if (msg) {
      console.log(`Received notification temperature_queue: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });

  channel.consume(humidityQueue, (msg) => {
    if (msg) {
      console.log(`Received notification humidity_queue: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });

  channel.consume(pressureQueue, (msg) => {
    if (msg) {
      console.log(`Received notification pressure_queue: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });
}

topicExchange();
