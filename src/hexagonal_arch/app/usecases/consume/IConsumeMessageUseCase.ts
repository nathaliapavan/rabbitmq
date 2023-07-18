import { ConsumeMessageInput } from "./ConsumeMessageInput";
import { ConsumeMessageOutput } from "./ConsumeMessageOutput";

export interface IConsumeMessageUseCase {
  execute(input: ConsumeMessageInput): Promise<ConsumeMessageOutput>;
}
