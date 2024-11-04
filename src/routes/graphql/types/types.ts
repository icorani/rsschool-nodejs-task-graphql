import DataLoader from "dataloader";
import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';
import {UUIDType} from "./uuid.js";
import {MemberType as PrismaMemberType, Post, PrismaClient, Profile, User,} from "@prisma/client";
import {IUser} from "./interfaces.js";

type Loaders = {
    userLoader: DataLoader<string, User>;
    profileLoader: DataLoader<string, Profile>;
    profileByIdLoader: DataLoader<string, Profile>;
    membersLoader: DataLoader<string, PrismaMemberType>;
    postsLoader: DataLoader<string, Post>;
    postLoader: DataLoader<string, Post>;
}

export type GqlContext = {
    prisma: PrismaClient;
    loaders: Loaders;
};

export const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: {type: UUIDType},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        authorId: {type: UUIDType},
    }),
});

export const MemberTypeId = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        BASIC: {value: 'BASIC'},
        BUSINESS: {value: 'BUSINESS'},
    },
});

export enum MemberTypeIdType {
    BASIC = 'BASIC',
    BUSINESS = 'BUSINESS',
}

export const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: {type: MemberTypeId},
        discount: {type: GraphQLFloat},
        postsLimitPerMonth: {type: GraphQLInt},
    }),
});
export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: {type: UUIDType},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
        memberTypeId: {type: GraphQLString},
        memberType: {
            type: MemberType,
            resolve: async (parent: { memberTypeId: string }, _, context: GqlContext) => {
                return await context.loaders.membersLoader.load(parent.memberTypeId);
            },
        },
    }),
});

export const UserType: GraphQLObjectType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: UUIDType},
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat},
        profile: {
            type: ProfileType,
            resolve: async (parent: IUser, _, context: GqlContext) => {
                return await context.loaders.profileLoader.load(parent.id);
            },
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async (parent: IUser, _, context: GqlContext) => {
                return await context.loaders.postsLoader.load(parent.id);
            },
        },
        userSubscribedTo: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
            resolve: async (parent: IUser, _args, context: GqlContext) => {
                const userSubs = parent.userSubscribedTo || [];
                return context.loaders.userLoader.loadMany(userSubs.map((s) => s.authorId));
            },
        },
        subscribedToUser: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
            resolve: async (parent: IUser, _args, context: GqlContext) => {
                const subsToUser = parent.subscribedToUser || [];
                return context.loaders.userLoader.loadMany(subsToUser.map((s) => s.subscriberId));
            },
        },
    }),
});

