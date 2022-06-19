import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { CurrentIdentity } from './auth/decorator/current-user';
import { IsPublic } from './auth/decorator/meta-data/is-public';
import { Role } from './auth/decorator/meta-data/needs-permission';
import { Identity } from './auth/models/identity';
import { ApiAddUserRq, ApiAddUserRs } from './user-service/rq-rs/add';
import { ApiUserLoginRq, ApiUserLoginRs } from './user-service/rq-rs/login';
import { UserService } from './user-service/user.service';

@Controller('app')
export class AppController {
    constructor(private readonly appService: AppService, private readonly userService: UserService) {}

    @UseGuards(AuthGuard('google'))
    @IsPublic()
    @Get('google')
    async signInWithGoogle() {}

    @IsPublic()
    @UseGuards(AuthGuard('google'))
    @Get('auth/callback')
    async signInWithGoogleRedirect(@Req() req) {
        return this.appService.signInWithGoogle(req);
    }

    //////////////////
    @IsPublic()
    @Post()
    async add(@Body() body: ApiAddUserRq): Promise<ApiAddUserRs> {
        return this.userService.add(body);
    }

    // @IsPublic()
    // @Post('login')
    // async login(@Body() body: ApiUserLoginRq): Promise<ApiUserLoginRs> {
    //     return this.userService.login(body);
    // }
    @IsPublic()
    @Post('login1')
    async login1(): Promise<string> {
        return 'test';
    }
}
