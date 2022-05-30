import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentIdentity } from './auth/decorator/current-user';
import { IsPublic } from './auth/decorator/meta-data/is-public';
import { Identity } from './auth/models/identity';
import { ApiAddUserRq, ApiAddUserRs } from './user-service/rq-rs/add';
import { ApiUserLoginRq, ApiUserLoginRs } from './user-service/rq-rs/login';
import { UserService } from './user-service/user.service';

@Controller('app')
export class AppController {
    constructor(private readonly appService: AppService, private readonly userService: UserService) {}

    @IsPublic()
    @Post()
    async add(@Body() body: ApiAddUserRq): Promise<ApiAddUserRs> {
        return this.userService.add(body);
    }

    @IsPublic()
    @Post('login')
    async login(@Body() body: ApiUserLoginRq): Promise<ApiUserLoginRs> {
        return this.userService.login(body);
    }
}
