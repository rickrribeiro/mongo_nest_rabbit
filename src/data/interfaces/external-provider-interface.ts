import { IUser } from 'src/models';

export interface IExternalProvider {
  getUserById(id: number): Promise<IUser>;
}
