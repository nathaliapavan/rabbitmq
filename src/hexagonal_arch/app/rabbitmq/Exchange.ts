import { RabbitMQClient } from './RabbitMQClient';

export class Exchange {
  private rabbitMQClient: RabbitMQClient;
  private exchangeName: string;

  constructor(rabbitMQClient: RabbitMQClient, exchangeName: string) {
    this.rabbitMQClient = rabbitMQClient;
    this.exchangeName = exchangeName;
  }

  public async assertExchange(exchangeType: string): Promise<void> {
    await this.rabbitMQClient.getChannel().assertExchange(this.exchangeName, exchangeType, { durable: true });
  }

  public async publishMessage(routingKey: string, message: string): Promise<void> {
    await this.rabbitMQClient.getChannel().publish(this.exchangeName, routingKey, Buffer.from(message));
  }

  public async consumeQueue(queueName: string, callback: (message: any) => void): Promise<void> {
    await this.rabbitMQClient.getChannel().consume(queueName, message => {
      if (message) {
        callback(message.content.toString());
        this.rabbitMQClient.getChannel().ack(message);
      }
    });
  }

  public async bindQueue(queueName: string, routingKey: string): Promise<void> {
    await this.rabbitMQClient.getChannel().bindQueue(queueName, this.exchangeName, routingKey);
  }
}
