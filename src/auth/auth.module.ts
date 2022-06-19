import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { GoogleAuthenticationService } from './strategy/google.service';

@Module({
    imports: [JwtModule.register({})],
    providers: [AuthService, GoogleAuthenticationService],
    exports: [AuthService, GoogleAuthenticationService],
})
export class AuthModule {}
