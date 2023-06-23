import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ExternalProviderWrapper,
  MessageProviderWrapper,
  DatabaseProviderWrapper,
} from './data';
import {
  ReqresProvider,
  RabbitMQProvider,
  EmailProvider,
  MongoProvider,
} from './providers';
import config from './config/config';
import { IUser } from './models';

@Controller()
export class AppController {
  externalProvider: ExternalProviderWrapper;
  queueProvider: MessageProviderWrapper;
  mailProvider: MessageProviderWrapper;
  databaseProvider: DatabaseProviderWrapper;

  constructor(private readonly appService: AppService) {
    this.externalProvider = new ExternalProviderWrapper(
      new ReqresProvider(config.reqres),
    );
    this.mailProvider = new MessageProviderWrapper(
      new EmailProvider(config.mail),
    );
    const queueProvider = new RabbitMQProvider();
    queueProvider.connect(config.rabbitMQ);
    this.queueProvider = new MessageProviderWrapper(queueProvider);

    this.databaseProvider = new DatabaseProviderWrapper(
      new MongoProvider(config.mongo),
    );
  }

  @Get('/api/users/:id')
  async getUser(@Param('id') id): Promise<{
    status: number;
    body: { message?: string; user?: IUser };
    messagesStatus?: any;
  }> {
    try {
      const user = await this.externalProvider.getUserById(id);
      return { status: 200, body: { user: user } };
    } catch (err) {
      return { status: 500, body: { message: 'error to get user' } };
    }
  }

  @Get('/api/users/:id/avatar')
  async getUserAvatar(@Param('id') id): Promise<{
    status: number;
    body: { message?: string; avatar?: string };
    messagesStatus?: any;
  }> {
    try {
      const userAvatar = await this.databaseProvider.getUserAvatar(id);
      return { status: 200, body: { avatar: userAvatar } };
    } catch (err) {
      return { status: 500, body: { message: 'error to get user avatar' } };
    }
  }

  @Get('/api/users/db/:id')
  async getUserDB(@Param('id') id): Promise<{
    status: number;
    body: { message?: string; user?: IUser };
    messagesStatus?: any;
  }> {
    try {
      const user = await this.databaseProvider.getUserById(id);

      return { status: 200, body: { user: user } };
    } catch (err) {
      return { status: 500, body: { message: 'error to get user' } };
    }
  }

  @Delete('/api/users/:id/avatar')
  async deleteUserAvatar(@Param('id') id): Promise<{
    status: number;
    body: { message?: string; user?: IUser };
    messagesStatus?: any;
  }> {
    try {
      const user = await this.databaseProvider.deleteUserAvatar(id);

      return { status: 200, body: { user: user } };
    } catch (err) {
      return { status: 500, body: { message: 'error to delete user avatar' } };
    }
  }

  @Post('/api/users')
  async createUser(@Body() body): Promise<{
    status: number;
    body: { message: string };
    messagesStatus?: any;
  }> {
    try {
      const user = await this.databaseProvider.createUser(body);

      const messagesStatus = {
        mailSent: false,
        queuePosted: false,
      };
      messagesStatus.mailSent = await this.mailProvider.sendMessage(
        '123',
        body.email,
        'User created',
      );
      messagesStatus.queuePosted = await this.queueProvider.sendMessage('123');

      return { status: 200, body: { message: 'user created' }, messagesStatus };
    } catch (err) {
      return { status: 500, body: { message: 'error to create user' } };
    }
  }
}
