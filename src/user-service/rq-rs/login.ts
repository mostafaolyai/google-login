import { RoleType } from '../../common/type/role-type';

export class UserLoginInfo {
    fullname: string;
    role: RoleType;
    email: string;
    profile: string;
}

export class ApiUserLoginRq {
    username: string;
    password: string;
}

export class ApiUserLoginRs {
    token: string;
    user: UserLoginInfo;
}
