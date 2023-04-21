import prisma from "@/lib/prisma"
import { compare } from "bcrypt"
import NextAuth, { type NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "email",
                    type: "email",
                    placeholder: "akane@not.best.girl.hehe",
                },
                password: {
                    label: "password",
                    type: "password",
                    placeholder: "input your password"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) {
                    return null
                }

                const isPasswordValid = await compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    return null
                }

                return {
                    email: user.email,
                    role: user.role,
                }
            }
        })
    ],
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    email: token.email,
                    role: token.role,
                }
            }
        },
        jwt: ({ token, user }) => {
            if (user) {
                return {
                    ...token,
                    email: user.email,
                    role: user.role,
                }
            }
            return token
        },
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }