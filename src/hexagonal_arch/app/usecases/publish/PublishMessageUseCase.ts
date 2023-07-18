
import { RabbitMQClient } from '../../rabbitmq/RabbitMQClient';
import { PublishMessageInput } from './PublishMessageInput';
import { PublishMessageOutput } from './PublishMessageOutput';
import { IPublishMessageUseCase } from './IPublishMessageUseCase';

export class PublishMessageUseCase implements IPublishMessageUseCase {
  private rabbitMQClient: RabbitMQClient;

  constructor(rabbitMQClient: RabbitMQClient) {
    this.rabbitMQClient = rabbitMQClient;
  }

  public async execute(input: PublishMessageInput): Promise<PublishMessageOutput> {
    try {
      await this.rabbitMQClient.publishMessage(input.queueName, input.message);
      return { success: true };
    } catch (error) {
      // Trate o erro adequadamente
      console.error('Error publishing message:', error);
      return { success: false };
    }
  }
}
