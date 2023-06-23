import { IExternalProvider } from 'src/data';
import { IUser } from 'src/models';
import axios from 'axios';

export class ReqresProvider implements IExternalProvider {
  config: any;
  constructor(config) {
    this.config = config;
  }
  public async getUserById(id: number): Promise<IUser> {
    try {
      const { data, status } = await axios.get<{ data: IUser }>(
        this.config.url + `/api/users/${id}`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      return data.data;
    } catch (err) {
      console.log(err);
      throw 'Error when trying to request data to reqres';
    }
  }
}
