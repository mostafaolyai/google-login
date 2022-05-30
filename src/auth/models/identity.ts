import { UserModel } from '../../model/user';

/**
 * It is extract from database using Payload of JWT
 */
export class Identity {
    user: UserModel;
    public get isAuthenticated(): boolean {
        return this.user ? true : false;
    }
}
