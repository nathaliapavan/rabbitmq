import { ConsumeMessage } from 'amqplib';

export interface ConsumeMessageInput {
  queueName: string;
  callback: (message: ConsumeMessage | null) => void;
}
