import {PrismaClient} from "@prisma/client";
import {userLoader} from "./userLoader.js";
import {postLoader, postsLoader} from "./postsLoader.js";
import {memberLoader, membersLoader} from "./membersLoader.js";
import {profileByIdLoader, profileLoader} from "./profileLoader.js";


export const graphQlLoaders = (prisma: PrismaClient) => ({
    userLoader: userLoader(prisma),
    profileByIdLoader: profileByIdLoader(prisma),
    profileLoader: profileLoader(prisma),
    postsLoader: postLoader(prisma),
    postLoader: postsLoader(prisma),
    membersLoader: membersLoader(prisma),
    memberLoader: memberLoader(prisma),
})