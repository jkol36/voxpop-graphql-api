import mongoose from "mongoose"

const schema = mongoose.Schema({
	contentId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	startWordIndex: {
		type: Number,
		required: true
	},
	endWordIndex: {
		type: Number,
		required: true
	},
	created: {
		type: Date,
		required: true
	},
	hashtags: {
		type: [String],
		required: false
	},
	quote: {
		type: String,
		required: false
	}
})

export default mongoose.model("Comments", schema)
