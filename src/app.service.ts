import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UserModel } from './model/user';
import { UserService } from './user-service/user.service';

@Injectable()
export class AppService {
    constructor(private readonly userService: UserService) {}

    async signInWithGoogle(data) {
        if (!data.user) throw new BadRequestException();
        console.log(data.user);
        return {
            // data,
            status: 'logined',
        };
    }
}
