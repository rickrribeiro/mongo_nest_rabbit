import { IMessage } from 'src/data';

export class MessageProviderWrapper implements IMessage {
  private messageProvider: any;

  constructor(messageProvider: any) {
    this.messageProvider = messageProvider;
  }

  public async sendMessage(message: string): Promise<boolean>;
  public async sendMessage(
    message: string,
    to: string,
    subject: string,
  ): Promise<boolean>;
  public async sendMessage(
    message: string,
    to?: string,
    subject?: string,
  ): Promise<boolean> {
    return await this.messageProvider.sendMessage(message, to, subject);
  }
}
