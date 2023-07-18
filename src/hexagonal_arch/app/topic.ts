import { Exchange } from './rabbitmq/Exchange';
import { RabbitMQClient } from './rabbitmq/RabbitMQClient';
import { RabbitMQConnection } from './rabbitmq/RabbitMQConnection';

async function main() {
  const rabbitMQConnection = RabbitMQConnection.getInstance();
  await rabbitMQConnection.connect('amqp://localhost');

  const rabbitMQClient = new RabbitMQClient(rabbitMQConnection.getChannel());

  const topicExchange = new Exchange(rabbitMQClient, 'topic_exchange');

  // Assert Exchange
  await topicExchange.assertExchange('topic');

  // Bind Queues
  await topicExchange.bindQueue('temperature_queue', 'sensor.temperature');
  await topicExchange.bindQueue('humidity_queue', 'sensor.humidity');
  await topicExchange.bindQueue('pressure_queue', 'sensor.*');

  // Publish Messages
  await topicExchange.publishMessage('sensor.temperature', 'Current temperature: 25°C');
  await topicExchange.publishMessage('sensor.humidity', 'Current humidity: 50%');
  await topicExchange.publishMessage('sensor.pressure', 'Current pressure: 1013 hPa');
  await topicExchange.publishMessage('sensor.whatever', 'Current pressure: 1013 hPa Whatever');

  // Consume Messages
  await topicExchange.consumeQueue('temperature_queue', message => {
    console.log(`Received notification temperature_queue: ${message}`);
  });

  await topicExchange.consumeQueue('humidity_queue', message => {
    console.log(`Received notification humidity_queue: ${message}`);
  });

  await topicExchange.consumeQueue('pressure_queue', message => {
    console.log(`Received notification pressure_queue: ${message}`);
  });

  await rabbitMQConnection.closeConnection();
}

main().catch(error => {
  console.error('An error occurred:', error);
});
