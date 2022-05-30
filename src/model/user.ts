import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { RoleType, RoleTypesList } from '../common/type/role-type';
import { BaseModel } from './base/base';

export const UserDB = 'User';

@Schema({ versionKey: false, collection: 'user' })
export class UserModel extends BaseModel {
    @Prop({ required: true, type: String })
    fullname: string;

    @Prop({ required: false, type: String })
    companyName: string;

    // @Prop({ required: false, type: String })
    // companyLogo: string;

    @Prop({ required: false, type: String })
    countryName: string;

    @Prop({ required: true, enum: RoleTypesList })
    role: RoleType;

    @Prop({ required: false, type: Date })
    lastSeen: Date;

    @Prop({ required: true, type: String })
    email: string;

    @Prop({ required: true, type: String })
    password: string;

    @Prop({ required: false, type: String })
    profile: string;

    @Prop({ required: false, type: String })
    forgetPasswordHash: string;

    @Prop({ required: false, type: Date })
    expireForgetPasswordHash: Date;
}

export const UserSchema: mongoose.Schema = SchemaFactory.createForClass(UserModel);

UserSchema.pre('save', function () {
    this.set(this.isNew ? 'created' : 'updated', new Date());
});
