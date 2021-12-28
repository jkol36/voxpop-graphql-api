import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = mongoose.Schema({
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		required: true
	},
	hash_password: {
		type: String,
		required: true
	},
	tokens: {
		type: Number,
		default: 0
	},
	_wallet: {
		type: String
		// required: true
	},
	avatar: {
		type: String,
		default:
			"https://www.vccircle.com/wp-content/uploads/2017/03/default-profile.png"
	},
	_followersId: {
		type: [mongoose.Schema.Types.ObjectId],
		required: false
	},
	_followingId: {
		type: [mongoose.Schema.Types.ObjectId],
		required: false
	},
	_votesId: {
		type: mongoose.Schema.Types.ObjectId
	},
	created: {
		type: Date,
		default: Date.now
	},
	admin: {
		type: Boolean,
		required: true,
		default: false
	},
	primary: {
		type: Boolean,
		required: true,
		default: false
	}
})

UserSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.hash_password)
}

export default mongoose.model("Users", UserSchema)
