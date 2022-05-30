import { EncryptionHelper } from './encryption-helper';

const bcrypt = require('bcryptjs');

export class PasswordHelper {
    public static hash(plainPassword: string): string {
        return bcrypt.hashSync(plainPassword, 10);
    }

    public static verify(plainPassword: string, password: string): boolean {
        return bcrypt.compareSync(plainPassword, password);
    }

    public static encryptPassword(pass: string): { encrypted: string; raw: string } {
        const hashPass = PasswordHelper.hash(pass);

        const encryptPass = EncryptionHelper.encrypt(hashPass);

        return { encrypted: encryptPass, raw: pass };
    }

    public static checkPassword(pass: string): boolean {
        let count = 0;
        if (pass.length >= 8 && pass.length <= 32) count++;
        if (pass.match('.*\\d.*')) count++;
        if (pass.match('.*[a-z].*')) count++;
        if (pass.match('.*[A-Z].*')) count++;
        if (pass.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)) count++;

        return count >= 5;
        // const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

        // if (pass.match(regularExpression)) return true;
        // return false;
    }
}
