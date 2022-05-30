import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { EncryptionHelper } from '../common/helper/encryption-helper';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    verifyJwtToken(token: string): { userId: Types.ObjectId; role: string } | null {
        let userId: Types.ObjectId = null;
        let role: string = null;

        try {
            // decrypt
            token = EncryptionHelper.decrypt(token);
            const payload = this.jwtService.verify(token, {
                ignoreExpiration: false,
                issuer: process.env.auth_jwt_issuer,
                secret: process.env.auth_jwt_secret,
            });
            userId = new Types.ObjectId(payload.userId);
            role = payload.role;
        } catch (e) {}

        return {
            userId: userId ? userId : null,
            role: role ? role : null,
        };
    }

    generateJwtToken(userId: Types.ObjectId, role: string): string {
        const o = {
            secret: process.env.auth_jwt_secret,
            expiresIn: process.env.token_expire,
            issuer: process.env.auth_jwt_issuer,
            subject: userId.toHexString(),
        };
        const token = this.jwtService.sign(
            {
                userId,
                role,
            },
            o,
        );

        // encrypt
        return EncryptionHelper.encrypt(token);
    }
}
