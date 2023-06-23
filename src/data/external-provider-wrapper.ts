import { IExternalProvider } from 'src/data';
import { IUser } from 'src/models';

export class ExternalProviderWrapper implements IExternalProvider {
  private externalProvider: any;

  constructor(externalProvider: any) {
    this.externalProvider = externalProvider;
  }

  public async getUserById(id: number): Promise<IUser> {
    return await this.externalProvider.getUserById(id);
  }
}
