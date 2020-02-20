import { Document, model, Model, Schema } from "mongoose";

export interface IUser extends Document {
	email: string;
	emailVerified: boolean;
	password: string;
	username: string;
}

const UserSchema: Schema<IUser> = new Schema(
	{
		email: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		},
		emailVerified: {
			type: Boolean,
			default: false
		},
		password: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		}
	},
	{ timestamps: true }
);

export const UserModel: Model<IUser> = model<IUser>("User", UserSchema);
