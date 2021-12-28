const Lyrics = (mongoose) => {
	const Schema = mongoose.Schema;
	const schema = new Schema({
		_id: Schema.Types.ObjectId,
		_songId: Schema.Types.ObjectId,
		_wordsId: [{
			_wordId: Schema.Types.ObjectId,
			upvotes: {
				type: Number,
				default: 0
			},
			downvotes: {
				type: Number,
				default: 0
			},
			score: {
				type: Number,
				default: 0
			}
		}],
		upvotes: {
			type: Number,
			default: 0
		},
		downvotes: {
			type: Number,
			default: 0
		},
		score: {
			type: Number,
			default: 0
		}
	});
	schema.index({score: -1});
	schema.method.findTopQuote = (cb) => {
		//find top quote & call calback
	};
	return mongoose.model('Lyrics', schema);
};

export default Lyrics;