import { Model, Schema, model, Document } from 'mongoose';

// Propertiees that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// Properties that a User Model has
interface UserModel extends Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

// Properties that a User Document has
interface UserDocument extends Document, UserAttrs {}

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

export const User = model<UserDocument, UserModel>('User', userSchema);
