import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({ imports: [JwtModule.register({})], providers: [AuthService], exports: [AuthService] })
export class AuthModule {}
