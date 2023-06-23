import { IContext } from './interfaces';

export class Context {
  reqresUrl: string;

  constructor(config: IContext) {
    this.reqresUrl = config.reqresUrl;
  }
}
