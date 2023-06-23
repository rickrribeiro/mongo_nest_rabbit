export interface IMessage {
  sendMessage:
    | ((message: string) => Promise<boolean>)
    | ((message: string, to: string, subject: string) => Promise<boolean>);
  connect?(any): Promise<void>; // to go fast
}
