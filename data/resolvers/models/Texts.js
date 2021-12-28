import mongoose from "mongoose"

const schema = mongoose.Schema({
	authorId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now()
	}
})

export default mongoose.model("Texts", schema)
