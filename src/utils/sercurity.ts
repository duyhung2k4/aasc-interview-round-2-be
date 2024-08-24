import { hashSync, genSaltSync, compare } from "bcryptjs";

export class SercurityUtils {
    hashPassword (password: string): string | Error {
        const salt = genSaltSync(14);
        const hashString = hashSync(password, salt);
        return hashString;
    }

    async comparePassword(password: string, passwordHash: string): Promise<boolean | Error> {
        try {
            const result = await compare(password, passwordHash);
            return result;
        } catch (error) {
            return new Error(JSON.stringify(error));
        }
    }

    generateRandomSixDigitString() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}