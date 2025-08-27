import { IPost } from "../post/post.interface";

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  posts?: IPost[];
}
