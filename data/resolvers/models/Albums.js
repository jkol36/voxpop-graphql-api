import mongoose from "mongoose"

const schema = mongoose.Schema({
	albumId: {
		type: Number,
		required: false
	},
	artistId: {
		type: Number,
		required: true
	},
	songIds: {
		type: [Number],
		required: true
	},
	title: {
		type: String,
		required: true
	},
})

export default mongoose.model("Albums", schema)
