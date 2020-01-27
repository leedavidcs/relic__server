import { genSaltSync, hashSync } from "bcryptjs";
import { Document, model, Model, Schema } from "mongoose";
import Validator from "validator";

const PASSWORD_MIN_LENGTH = 8;
const BCRYPT_SALT_ROUNDS = 10;

export interface IUser extends Document {
	email: string;
	emailVerified: boolean;
	password: string;
	username: string;
}

const UserSchema: Schema<IUser> = new Schema({
	email: {
		type: String,
		required: true,
		index: {
			unique: true
		},
		set: (email: string): string => email.toLowerCase(),
		validate: [(email: string) => Validator.isEmail(email), "Invalid email"]
	},
	emailVerified: {
		type: Boolean,
		default: false
	},
	password: {
		type: String,
		required: true,
		minlength: PASSWORD_MIN_LENGTH,
		set: (password: string): string => {
			const salt: string = genSaltSync(BCRYPT_SALT_ROUNDS);
			const hash: string = hashSync(password, salt);

			return hash;
		}
	},
	username: {
		type: String,
		required: true,
		index: {
			unique: true
		},
		minlength: 1,
		validate: [
			(username: string) => /[a-z0-9_\-.]{3,30}/i.test(username),
			"Usernames must be between 3 and 30 characters, and can only contain alphanumeric " +
				"characters, and the following special characters: (-), (_) and (.)"
		]
	}
});

export const UserModel: Model<IUser> = model<IUser>("User", UserSchema);
