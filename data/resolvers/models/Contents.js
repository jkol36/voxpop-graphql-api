import mongoose from "mongoose"

const schema = mongoose.Schema({
	collectionId: {
		type: mongoose.Schema.Types.ObjectId,
		required: false
	},
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	coCreatorIds: {
		type: [mongoose.Schema.Types.ObjectId],
		required: false
	},
	domainId: {
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
	media: {
		type: [JSON],
		required: false
	},
	thumbnail: {
		type: String,
		required: false
	},
	options: {
		type: JSON,
		required: false
	},
	score: {
		type: Number,
		required: true,
		default: 0
	},
	created: {
		type: Date,
		required: true
	}
})

schema.index({'$**': 'text'})

export default mongoose.model("Contents", schema)
