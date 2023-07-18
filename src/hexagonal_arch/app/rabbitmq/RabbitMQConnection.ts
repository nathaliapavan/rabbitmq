import { connect, Connection, Channel } from 'amqplib';

export class RabbitMQConnection {
  private static instance: RabbitMQConnection;
  private connection: Connection | undefined;
  private channel: Channel | undefined;

  private constructor() {}

  public static getInstance(): RabbitMQConnection {
    if (!RabbitMQConnection.instance) {
      RabbitMQConnection.instance = new RabbitMQConnection();
    }
    return RabbitMQConnection.instance;
  }

  public async connect(uri: string): Promise<void> {
    this.connection = await connect(uri);
    this.channel = await this.connection.createChannel();
  }

  public getChannel(): Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ connection not established');
    }
    return this.channel;
  }

  public async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
    }
  }
}
