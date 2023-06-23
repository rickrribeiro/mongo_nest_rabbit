import { IUser } from 'src/models';

export interface IDatabase {
  createUser(user: IUser): Promise<boolean>;
  getUserById(id: number): Promise<IUser>;
  deleteUserAvatar(id: number): Promise<IUser>;
  getUserAvatar(id: number): Promise<string>;
}
