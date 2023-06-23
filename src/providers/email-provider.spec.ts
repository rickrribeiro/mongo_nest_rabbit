import { EmailProvider } from './email-provider';
import * as nodemailer from 'nodemailer';
import * as Sinon from 'sinon';

describe('EmailProvider', () => {
  const testConfig = {
    host: 'test-host',
    port: 1234,
    user: 'test-user',
    password: 'test-password',
    mail: 'test-mail',
  };
  const transporterMock = {
    sendMail: () => {
      return true;
    },
  };

  afterEach(() => {
    Sinon.restore();
  });

  describe('sendMessage', () => {
    it('should send email successfully', async () => {
      const transporterStub = Sinon.stub(nodemailer, 'createTransport').returns(
        transporterMock as any,
      );
      const sendMailStub = Sinon.stub(transporterMock, 'sendMail').returns(
        true,
      );
      const emailProvider = new EmailProvider(testConfig);
      const result = await emailProvider.sendMessage(
        'test-message',
        'test-to',
        'test-subject',
      );

      expect(result).toBe(true);
      expect(sendMailStub.calledOnce).toBe(true);
      const a = sendMailStub.getCall(0).args;
      expect(sendMailStub.getCall(0).args).toContain({
        from: 'test-mail',
        to: 'test-to',
        subject: 'test-subject',
        html: 'test-message',
      });
    });

    it('should handle error when sending email', async () => {
      const transporterStub = Sinon.stub(nodemailer, 'createTransport').returns(
        transporterMock as any,
      );
      const sendMailStub = Sinon.stub(transporterMock, 'sendMail').returns(
        false,
      );
      const emailProvider = new EmailProvider(testConfig);

      const result = await emailProvider.sendMessage(
        'test-message',
        'test-to',
        'test-subject',
      );

      expect(result).toBe(false);
      expect(sendMailStub.calledOnce).toBe(true);
      expect(sendMailStub.getCall(0).args[0]).toBe({
        from: 'test-mail',
        to: 'test-to',
        subject: 'test-subject',
        html: 'test-message',
      });
    });
  });
});
