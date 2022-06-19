import { Injectable, UnauthorizedException } from '@nestjs/common';
import { google, Auth } from 'googleapis';

@Injectable()
export class GoogleAuthenticationService {
    oauthClient: Auth.OAuth2Client;
    constructor() // private readonly authenticationService: AuthenticationService // private readonly configService: ConfigService, // private readonly usersService: UsersService,
    {
        const clientID = '1072633392893-29lm90t8gg9h62bpu8r9usniqmk8hie6.apps.googleusercontent.com';
        const clientSecret = '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';

        this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
    }

    async authenticate(token: string) {
        const tokenInfo = await this.oauthClient.getTokenInfo(token);
        console.log(tokenInfo);
        const email = tokenInfo.email;

        try {
            // const user = await this.usersService.getByEmail(email);
            // return this.handleRegisteredUser(user);
        } catch (error) {
            if (error.status !== 404) {
                throw new error();
            }

            // return this.registerUser(token, email);
        }
    }

    // ...
}
