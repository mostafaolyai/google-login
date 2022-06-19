import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: '1072633392893-29lm90t8gg9h62bpu8r9usniqmk8hie6.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/app/auth/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            accessToken,
        };
        done(null, user);
    }
}
