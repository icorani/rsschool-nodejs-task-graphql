import DataLoader from 'dataloader';
import {PrismaClient} from '@prisma/client'
import {UUID} from 'crypto';

export const userLoader = (prisma: PrismaClient) => {
    return new DataLoader (async (usersID: readonly UUID[])=>{
        const fetchedUsers = await prisma.user.findMany({
            where: {
                id: {
                    in: usersID as UUID[],
                },
            },
            include: {
                subscribedToUser: true,
                userSubscribedTo: true,
            },
        })
        return usersID.map((id) => fetchedUsers.find((user)=> user.id === id))
    });
};