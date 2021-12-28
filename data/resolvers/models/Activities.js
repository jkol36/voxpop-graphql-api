import mongoose from "mongoose"

const schema = mongoose.Schema({
    event: {
        type: String,
        required: true
    },
    ids: {
        type: JSON,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true
    }
})
schema.index({content: 'text'})

export default mongoose.model("Activities", schema)
