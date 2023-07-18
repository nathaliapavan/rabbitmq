import { RabbitMQClient } from './rabbitmq/RabbitMQClient';
import { RabbitMQConnection } from './rabbitmq/RabbitMQConnection';
import { PublishMessageUseCase } from './usecases/publish/PublishMessageUseCase';
import { ConsumeMessageUseCase } from './usecases/consume/ConsumeMessageUseCase';

async function main() {
  // Crie uma instância da conexão RabbitMQ
  const rabbitMQConnection = RabbitMQConnection.getInstance();
  await rabbitMQConnection.connect('amqp://localhost');

  // Crie uma instância do cliente RabbitMQ
  const rabbitMQClient = new RabbitMQClient(rabbitMQConnection.getChannel());

  // Crie instâncias dos casos de uso
  const publishMessageUseCase = new PublishMessageUseCase(rabbitMQClient);
  const consumeMessageUseCase = new ConsumeMessageUseCase(rabbitMQClient);

  // Exemplo de uso do caso de uso de publicação de mensagem
  const publishMessageInput = {
    queueName: 'my_queue',
    message: 'Hello, RabbitMQ!',
  };
  const publishMessageOutput = await publishMessageUseCase.execute(publishMessageInput);
  console.log('Publish Message Output:', publishMessageOutput);

  // Exemplo de uso do caso de uso de consumo de mensagem
  const consumeMessageInput = {
    queueName: 'my_queue',
    callback: (message: any) => {
      if (message) {
        console.log('Received Message:', message.content.toString());
        rabbitMQClient.getChannel().ack(message);
      }
    },
  };
  const consumeMessageOutput = await consumeMessageUseCase.execute(consumeMessageInput);
  console.log('Consume Message Output:', consumeMessageOutput);
}

main().catch(error => {
  console.error('An error occurred:', error);
});
