import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserDB, UserSchema } from '../model/user';
import { UserService } from './user.service';

//.env config
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
    imports: [MongooseModule.forFeature([{ name: UserDB, schema: UserSchema }]), AuthModule],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
