import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient()
async function main() {
    const password = await hash('!akane_best', 12)
    await prisma.user.upsert({
        where: {
            email: "akane@not.best.girl.hehe"
        },
        update: {},
        create: {
            email: "akane@not.best.girl.hehe",
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