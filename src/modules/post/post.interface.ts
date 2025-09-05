import { IUser } from "../user/user.interface";

export interface IPost {
  id?: string;
  title: string;
  content: string;
  published?: boolean;
  author?: IUser;
  authorId?: string | null;
}

export type IPostUpdate = Omit<Partial<IPost>, "author" | "id">;
