import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient()
async function main() {
    const password = await hash('!akane_best', 12)
    await prisma.user.upsert({
        where: {
            email: 'zuha@source.music.ent'
        },
        update: {},
        create: {
            email: 'zuha@source.music.ent',
            role: 'ADMIN',
            password,
        }
    })
}

main().then(async() => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})