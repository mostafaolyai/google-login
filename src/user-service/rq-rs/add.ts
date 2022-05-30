import { RoleType } from '../../common/type/role-type';

export class ApiAddUserRq {
    fullname: string;
    email: string;
    role: RoleType;
    password: string;

    avatar: string;
}
export class ApiAddUserRs {
    id: string;
}
