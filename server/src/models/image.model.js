import mongoose, {Schema} from "mongoose";

const imageSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    transformationType: {
      type: String,
      required: true
    },
    publicId: {
      type: String, 
      required: true
    },
    secureURL: {
      type: String, 
      required: true
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    config: {
      type: Object
    },
    transformationURL: {
      type: String
    },
    aspectRatio: {
      type: String 
    },
    color: {
      type: String 
    },
    prompt: {
      type: String 
    },
    author: {
      type: Schema.Types.ObjectId, 
      ref: "User" 
    }
  },
  {
    timestamps: true
  }
)

export const Image = mongoose.model("Image", imageSchema)