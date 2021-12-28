import mongoose from 'mongoose';

const UserInviteSchema = mongoose.Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		required: true
	},
	status: {
		type: String,
		required: true,
		default: "NEW"
	},
	_userId: {
		type: mongoose.Schema.Types.ObjectId
	},
	created: {
		type: Date,
		default: Date.now
	},
});

export default mongoose.model('UserInvites', UserInviteSchema);