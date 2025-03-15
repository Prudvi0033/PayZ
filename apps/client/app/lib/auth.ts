import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt, { hash } from "bcryptjs";
import db from "@repo/db/client"
providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            phone: { label: "Phone Number", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials : any) {
            const hashedPassword = await bcrypt.hash(credentials.password, 10)
            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if(existingUser){
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password)
                if(passwordValidation){
                    return {id: existingUser.id.toString()}
                }
            }
            return null
        },
    })
]