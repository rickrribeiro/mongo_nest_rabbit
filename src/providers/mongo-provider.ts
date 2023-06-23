import mongoose, * as Mongoose from 'mongoose';
import { IDatabase } from 'src/data';
import { IUser } from 'src/models';
import axios from 'axios';

interface IUserDoc extends Mongoose.Document {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const UserSchema = new Mongoose.Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  avatar: { type: String, required: true },
});

const User = Mongoose.model<IUserDoc>('User', UserSchema);

export class MongoProvider implements IDatabase {
  private database: Mongoose.Connection;
  private bucket: Mongoose.mongo.GridFSBucket;

  constructor({ host, port, password, username }) {
    const uri = `mongodb://${username}:${password}@${host}:${port}`;
    if (this.database) return;

    Mongoose.connect(uri);
    this.database = Mongoose.connection;
    this.database.once('open', async () => {
      this.bucket = new Mongoose.mongo.GridFSBucket(this.database.db);
      console.log('Connected to database');
    });

    this.database.on('error', () => {
      console.log('Error connecting to database');
    });
  }

  public async createUser(user: IUser): Promise<boolean> {
    try {
      const newUser = new User(user);
      await newUser.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async getUserById(id: number): Promise<IUser> {
    try {
      const user = await User.findOne({ id: id });
      return user;
    } catch (err) {
      console.log(err);
      throw 'Error to get user';
    }
  }

  public async getUserAvatar(id: number): Promise<string> {
    try {
      const user = await User.findOne({ id: id });
      // small, doesnt need streams to download
      const image = await axios.get(user.avatar, {
        responseType: 'arraybuffer',
      });

      const file = await this.database
        .collection('fs.files')
        .findOne({ filename: user._id });

      let imageBytes;
      if (file) {
        console.log('Get Downloaded File');
        const downloadStream = this.bucket.openDownloadStreamByName(user._id);

        imageBytes = await new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          downloadStream.on('data', (chunk: Buffer) => chunks.push(chunk));
          downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
          downloadStream.on('error', (err: Error) => reject(err));
        });
      } else {
        console.log(`File not found, downloading it`);
        imageBytes = image.data;
        const uploadStream = this.bucket.openUploadStream(user._id);
        uploadStream.write(image.data);
        uploadStream.end();
      }
      const base64Image = Buffer.from(imageBytes).toString('base64');

      return base64Image;
    } catch (err) {
      console.log(err);
      throw 'Error to get user';
    }
  }

  public async deleteUserAvatar(id: number): Promise<IUser> {
    try {
      const user = await User.findOneAndUpdate({ id: id }, { avatar: '' });
      return user;
    } catch (err) {
      console.log(err);
      throw 'Error to delete user avatar';
    }
  }
}
