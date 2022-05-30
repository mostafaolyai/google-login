import { Injectable } from '@nestjs/common';
import { UserService } from './user-service/user.service';

@Injectable()
export class AppService {
    constructor(private readonly userService: UserService) {}
}
