import { UserService } from '../../user-service/user.service';
import { AuthService } from '../auth.service';
import { Identity } from '../models/identity';
import { RandomKeyHelper } from '../../common/helper/random-key-helper';
import { GoogleAuthenticationService } from '../strategy/google.service';

class JwtMiddleware {
    private headerPrefix = 'Bearer ';

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly authhhService: GoogleAuthenticationService,
    ) {}

    public async run(req, res, next) {
        req['id'] = RandomKeyHelper.create(24, RandomKeyHelper.alphaNumeric);

        const token = this.extractToken(req);

        req['identity'] = new Identity();
        const identity: Identity = req['identity'];

        if (token) {
            const tt = this.authhhService.authenticate(token);
            const { userId, role } = this.authService.verifyJwtToken(token);

            if (userId) {
                const user = await this.userService.getUser(userId);
                if (user && user.deactived !== true) identity.user = user;
            }
        }
        next();
    }

    private extractToken(req): string {
        return req.headers['authorization']?.substr(this.headerPrefix.length) ?? null;
    }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function getJwtMiddleware(authService: AuthService, userService: UserService, authhhService: GoogleAuthenticationService): Function {
    const e = new JwtMiddleware(authService, userService, authhhService);
    return e.run.bind(e);
}
