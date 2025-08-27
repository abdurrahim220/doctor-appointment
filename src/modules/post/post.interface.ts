import { IUser } from "../user/user.interface";

export interface IPost {
  id?: number;
  title: string;
  content: string;
  published?: boolean;
  author?: IUser;
  authorId?: number;
}

export type IPostUpdate = Omit<Partial<IPost>, "author" | "id">;
