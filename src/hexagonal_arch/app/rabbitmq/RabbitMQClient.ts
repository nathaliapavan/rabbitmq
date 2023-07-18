import { Channel, ConsumeMessage } from 'amqplib';

export class RabbitMQClient {
  private channel: Channel;

  constructor(channel: Channel) {
    this.channel = channel;
  }

  public async publishMessage(queueName: string, message: string): Promise<void> {
    await this.channel.assertQueue(queueName);
    this.channel.sendToQueue(queueName, Buffer.from(message));
  }

  public async consumeMessage(queueName: string, callback: (message: ConsumeMessage | null) => void): Promise<void> {
    await this.channel.assertQueue(queueName);
    this.channel.consume(queueName, callback);
  }

  public getChannel(): Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ connection not established');
    }
    return this.channel;
  }
}
