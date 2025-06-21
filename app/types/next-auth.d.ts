declare module "next-auth" {
    interface User {
        id: string
        username: string
        avatar?: string | null
    }

    interface Session {
        user: {
            id: string
            email: string
            name?: string | null
            username: string
            avatar?: string | null
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        username: string
        avatar?: string | null
    }
}
