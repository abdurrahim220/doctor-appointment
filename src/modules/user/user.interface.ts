import { IPost } from "../post/post.interface";

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  posts?: IPost[];
}
