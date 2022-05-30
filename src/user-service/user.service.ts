import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { UserDB, UserModel } from '../model/user';
import { PasswordHelper } from '../common/helper/password-helper';
import { ApiAddUserRq, ApiAddUserRs } from './rq-rs/add';
import { ApiUserLoginRq, ApiUserLoginRs } from './rq-rs/login';
import { EncryptionHelper } from '../common/helper/encryption-helper';
import { RandomKeyHelper } from '../common/helper/random-key-helper';
import { ApiUserForgetPasswordRq } from './rq-rs/forget-password';
import { ApiUserChangePasswordRq } from './rq-rs/change-password';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
    constructor(@InjectModel(UserDB) private readonly userModel: Model<UserModel>, private readonly authService: AuthService) {}

    async findUserById(userId: Types.ObjectId): Promise<UserModel> {
        const user = await this.userModel.findOne({ _id: userId });

        if (!user) throw new NotFoundException('user not found!');

        return user;
    }
    async getUser(userId: Types.ObjectId): Promise<UserModel> {
        const user = this.userModel.findOne({ _id: userId });

        return user;
    }

    //user management => add user
    async add(body: ApiAddUserRq): Promise<ApiAddUserRs> {
        //check file exist
        if (body.avatar && (await !fs.existsSync(body.avatar))) throw new NotFoundException('file not found!');

        if (body.password && !PasswordHelper.checkPassword(body.password)) throw new BadRequestException('password is invalid');

        const user = await this.userModel.findOne({ email: body.email });

        if (user) throw new ConflictException('user is already exist!');

        //if (body.role === 'CUSTOMER') throw new BadRequestException('role is wrong!');

        const password = PasswordHelper.encryptPassword(body.password);

        let newUser = {
            fullname: body.fullname,
            role: body.role,
            email: body.email,
            password: password.encrypted,
            profile: body?.avatar,
        } as UserModel;

        newUser = await this.userModel.create(newUser);

        if (newUser) {
            const role =
                newUser.role === 'ADMIN'
                    ? 'Admin'
                    : newUser.role === 'STAFF'
                    ? 'Staff'
                    : newUser.role === 'ACCOUNTMANAGER'
                    ? 'Account Manager'
                    : 'Customer';
            const model = {
                role: role,
                username: newUser.email,
                password: body.password,
            };
        }
        return { id: newUser._id.toHexString() };
    }

    async login(body: ApiUserLoginRq): Promise<ApiUserLoginRs> {
        //check email
        const user = await this.userModel.findOne({ email: body.username });
        if (!user) throw new NotFoundException('user not found!');

        //check pass
        const validPassword = PasswordHelper.verify(body.password, EncryptionHelper.decrypt(user.password));
        if (!validPassword) throw new NotFoundException('user not found!');

        //check blocking user
        if (user.deactived === true) throw new ForbiddenException("user don't has access!");

        //lastseen
        user.lastSeen = new Date();
        await user.save();

        const token = this.authService.generateJwtToken(user._id, user.role);

        return {
            token,
            user: {
                email: user.email,
                fullname: user.fullname,
                profile: user?.profile,
                role: user.role,
            },
        };
    }

    async forgetPassword(body: ApiUserForgetPasswordRq): Promise<void> {
        const user = await this.userModel.findOne({ email: body.userEmail });
        if (!user) throw new NotFoundException('user not found!');
        else if (user.deactived) throw new ForbiddenException('user not found!');

        user.forgetPasswordHash = RandomKeyHelper.create(24, RandomKeyHelper.alphaNumeric);

        user.expireForgetPasswordHash = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
        await user.save();
        //send email
        const model = {
            url: `${process.env.front_domain}/user/confirm?${user.forgetPasswordHash}`,
        };
    }

    //change password when forget password
    async changePassword(token: string, body: ApiUserChangePasswordRq): Promise<void> {
        const user = await this.userModel.findOne({ forgetPasswordHash: token });
        if (!user) throw new NotFoundException('user not found!');

        if (user.expireForgetPasswordHash < new Date()) throw new NotFoundException('user not found!');

        if (body.password !== body.rePassword || !PasswordHelper.checkPassword(body.password))
            throw new BadRequestException('password is invalid');

        const hashPass = PasswordHelper.hash(body.password);

        const encryptPass = EncryptionHelper.encrypt(hashPass);

        user.password = encryptPass;
        user.forgetPasswordHash = undefined;
        user.expireForgetPasswordHash = undefined;

        await user.save();
    }

    //check token
    async checkToken(token: string): Promise<void> {
        const user = await this.userModel.findOne({ forgetPasswordHash: token });
        if (!user) throw new NotFoundException('user not found!');

        if (user.expireForgetPasswordHash < new Date()) throw new NotFoundException('user not found!');
    }
}
