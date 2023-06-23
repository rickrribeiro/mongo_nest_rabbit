import * as nodemailer from 'nodemailer';

import { IMessage } from 'src/data';
export class EmailProvider implements IMessage {
  private transporter: nodemailer.Transporter;
  private mail: string;
  constructor({ host, port, user, password, mail }) {
    this.mail = mail;
    this.transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false,
      auth: {
        user: user,
        pass: password,
      },
      tls: { rejectUnauthorized: false },
    });
  }

  public async sendMessage(message: string, to: string, subject: string) {
    try {
      const mailOptions = {
        from: this.mail,
        to: to,
        subject: subject,
        html: message,
      };
      await this.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return 'Error to send mail';
        } else {
          return 'E-mail sent!';
        }
      });
    } catch (err) {
      console.log(err);
      //throw 'Error when trying to send email';
      return false; // to dont break becase its not necessary to send the mail
    }
    return true;
  }
}
