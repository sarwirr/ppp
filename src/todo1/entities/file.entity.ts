import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/entities/user.entity';


export type FileDocument = HydratedDocument<File>;

@Schema()
export class File {

  _id;
  
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  status: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop()
  deleted: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId, ref: () => "User" 
})
  owner: User;

  

}

export const TodoSchema = SchemaFactory.createForClass(File);
