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
  type: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: false
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
  }
})
export default mongoose.model("Votes", schema)
