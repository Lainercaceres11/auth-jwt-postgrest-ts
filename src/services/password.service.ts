import bcrypt from "bcrypt"

const SALT_ROUNDS: number = 10

// Hash del password
export const hashPassword = async (password: string): Promise<string>=>{
    return await bcrypt.hash(password, SALT_ROUNDS)
}

// Compara las contraseñas
export const comparePassword = async (password: string, hashPassword: string): Promise<boolean>=>{
    return bcrypt.compare(password, hashPassword)
}