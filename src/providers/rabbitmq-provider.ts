import * as amqp from 'amqplib';
import { IMessage } from 'src/data';
export class RabbitMQProvider implements IMessage {
  private channel: amqp.Channel;

  public async connect({ host, port, password, username }) {
    try {
      const connection: amqp.Connection = await amqp.connect(
        `amqp://${username}:${password}@${host}:${port}`,
      );
      this.channel = await connection.createChannel();
      await this.channel.assertQueue('rickrribeiro');
      // console.log('Connected to RabbitMQ');
    } catch (err) {
      console.log(err);
      throw 'Error when connecting to RabbitMQ';
    }
  }

  public async sendMessage(message: string) {
    try {
      await this.channel.sendToQueue('rickrribeiro', Buffer.from(message));
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
