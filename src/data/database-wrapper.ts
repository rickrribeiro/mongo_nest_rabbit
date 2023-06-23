import { IDatabase } from 'src/data';
import { IUser } from 'src/models';

export class DatabaseProviderWrapper implements IDatabase {
  private databaseProvider: IDatabase;

  constructor(databaseProvider: any) {
    this.databaseProvider = databaseProvider;
  }

  public async createUser(user: IUser): Promise<boolean> {
    return this.databaseProvider.createUser(user);
  }
  public async getUserAvatar(id: number): Promise<string> {
    return this.databaseProvider.getUserAvatar(id);
  }

  public async deleteUserAvatar(id: number): Promise<IUser> {
    return this.databaseProvider.deleteUserAvatar(id);
  }
  public async getUserById(id: number): Promise<IUser> {
    return this.databaseProvider.getUserById(id);
  }
}
