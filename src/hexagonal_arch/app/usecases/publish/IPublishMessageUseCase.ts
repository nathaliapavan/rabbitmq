import { PublishMessageInput } from "./PublishMessageInput";
import { PublishMessageOutput } from "./PublishMessageOutput";

export interface IPublishMessageUseCase {
  execute(input: PublishMessageInput): Promise<PublishMessageOutput>;
}
