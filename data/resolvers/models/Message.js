import mongoose from "mongoose"

const schema = mongoose.Schema({
	contentId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	title: {
		type: String
	},
	text: {
		type: String,
		required: true
	},
	imageUrl: {
		type: String
	},
	created: {
		type: Date,
		required: true
	}
})

export default mongoose.model("Messages", schema)
