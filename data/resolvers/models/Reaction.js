import mongoose from "mongoose"

const schema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	messageId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	reaction: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	},
})

export default mongoose.model("Reaction", schema)
