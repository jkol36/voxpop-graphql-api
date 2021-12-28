import mongoose from "mongoose"

const schema = mongoose.Schema({
  userId: {
	type: mongoose.Schema.Types.ObjectId,
	required: true
  },
  senderUserId: {
    type: mongoose.Schema.Types.ObjectId
  },
  messageRoomId: {
    type: mongoose.Schema.Types.ObjectId
  },
  followerUserId: {
    type: mongoose.Schema.Types.ObjectId
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId
  },
  contentDomain: {
    type: String
  },
  label: {
	type: String,
	required: true
  },
  status: {
	type: String,
	required: true
  },
  created: {
	type: Date,
	required: true
  },
  notifType: {
    type: String,
    required: true
  }
})

export default mongoose.model("Notifications", schema)
