import mongoose from "mongoose"

const schema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	imageUrl: {
		type: String,
		required: true
	},
	artistId: {
		type: Number,
		required: true
	},
	albums: {
		type: [Number],
		required: true
	},
	songs: {
		type: [Number],
		required: true
	},
	followers: {
		type: [mongoose.Schema.Types.ObjectId],
		required: false
	}
})
export default mongoose.model("Artists", schema)