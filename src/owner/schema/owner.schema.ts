import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
        },
    },
})
export class Owner {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    address: string;

}
export const OwnerSchema = SchemaFactory.createForClass(Owner);

