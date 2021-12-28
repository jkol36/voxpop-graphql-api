import mongoose from "mongoose"

const schema = mongoose.Schema({
	albumId: {
		type: Number,
		required: false
	},
	artistIds: {
		type: [Number],
		required: true
	},
	featuredArtistIds: {
		type: [Number],
		required: false
	},
	songId: {
		type: Number,
		required: true
	},
	fullTitle: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	lyrics: {
		type: String,
		required: false
	},
	media: {
		type: [JSON],
		required: false
	},
	thumbnail: {
		type: String
	}
})

export default mongoose.model("Songs", schema)
