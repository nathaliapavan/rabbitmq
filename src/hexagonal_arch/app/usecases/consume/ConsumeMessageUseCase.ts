
import { RabbitMQClient } from '../../rabbitmq/RabbitMQClient';
import { ConsumeMessageInput } from './ConsumeMessageInput';
import { ConsumeMessageOutput } from './ConsumeMessageOutput';
import { IConsumeMessageUseCase } from './IConsumeMessageUseCase';

export class ConsumeMessageUseCase implements IConsumeMessageUseCase {
  private rabbitMQClient: RabbitMQClient;

  constructor(rabbitMQClient: RabbitMQClient) {
    this.rabbitMQClient = rabbitMQClient;
  }

  public async execute(input: ConsumeMessageInput): Promise<ConsumeMessageOutput> {
    try {
      await this.rabbitMQClient.consumeMessage(input.queueName, input.callback);
      return { success: true };
    } catch (error) {
      // Trate o erro adequadamente
      console.error('Error consuming message:', error);
      return { success: false };
    }
  }
}
