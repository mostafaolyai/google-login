import { Schema, Prop, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class BaseModel extends mongoose.Document {
    @Prop()
    readonly _id: Types.ObjectId;

    @Prop()
    readonly created: Date;
    @Prop({
        required: false,
        type: raw({
            id: { required: false, type: Types.ObjectId },
            fullname: { required: false, type: String },
            email: { required: false, type: String },
            avatar: { required: false, type: String },
        }),
    })
    createdBy: {
        id: Types.ObjectId;
        fullname: string;
        email?: string;
        avatar?: string;
    };

    @Prop({ required: false })
    readonly updated: Date;
    @Prop({
        required: false,
        type: raw({
            id: { required: false, type: Types.ObjectId },
            fullname: { required: false, type: String },
            email: { required: false, type: String },
            avatar: { required: false, type: String },
        }),
    })
    updatedBy: {
        id: Types.ObjectId;
        fullname: string;
        email: string;
        avatar?: string;
    };

    @Prop()
    readonly deactived: boolean;

    @Prop()
    readonly deleted: boolean;
}
