import {User} from "@prisma/client";
import {MemberTypeIdType} from "./types.js";

export interface ICreateProfile {
  userId: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
}

export interface ICreatePost {
  title: string;
  content: string;
  authorId: string;
}

export interface ICreateUser {
  name: string;
  balance: number;
}

export interface UserSubscriptions extends User {
  userSubscribedTo?: {
    subscriberId: string;
    authorId: string;
  }[];
  subscribedToUser?: {
    subscriberId: string;
    authorId: string;
  }[];
}
interface ISubscriptions {
  subscriberId: string;
  authorId: string;
}

export interface IUser {
  id: string;
  name: string;
  balance: number;
  profile?: IProfile;
  posts?: IPost[];
  userSubscribedTo: ISubscriptions[];
  subscribedToUser: ISubscriptions[];
}

interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberType: IMemberType;
}

interface IMemberType {
  id: MemberTypeIdType;
  discount: number;
  postsLimitPerMonth: number;
}

interface IPost {
  id: string;
  title: string;
  content: string;
}