import { Document, Model, model, Schema } from 'mongoose';
import { PasswordUtils } from '../utils/password.utils';

// Properties that are required to create a new User
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

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform: (document: UserDocument, ret: Partial<UserDocument>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await PasswordUtils.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

export const User = model<UserDocument, UserModel>('User', userSchema);
