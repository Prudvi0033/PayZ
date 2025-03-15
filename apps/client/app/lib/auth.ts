import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt, { hash } from "bcryptjs";
import db from "@repo/db/client"
const authProviders = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: "Phone Number", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any) {
                const hashedPassword = await bcrypt.hash(credentials.password, 10)
                const existingUser = await db.user.findFirst({
                    where: {
                        number: credentials.phone
                    }
                });

                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password)
                    if (passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.email
                        }
                    }
                    return null
                }
                try {
                    const user = await db.user.create({
                        data: {
                            number: credentials.phone,
                            password: credentials.password
                        }
                    })
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.number
                    }
                } catch (error) {
                    console.error(error);
                }
                return null
            }
        }),

    ],
    secret : process.env.AUTH_SECRET,
    callbacks : {
        async session({token, session} : any) {
            session.user.id = token.sub
            return session
        }
    }
}