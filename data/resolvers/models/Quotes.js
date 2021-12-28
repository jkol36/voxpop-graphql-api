import mongoose, {Schema} from "mongoose"

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
	quote: String,
	created: {
		type: Date,
		required: true
	}
})
export default mongoose.model("Quotes", schema)
