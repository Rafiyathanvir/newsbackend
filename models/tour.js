import mongoose from "mongoose";

const tourSchema = mongoose.Schema({
  title: String,
  description: String,
  name: String,
  creator: String,
  tags: [String],
  imageFile: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likes: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    default: "General", // You can set a default category if needed
  },
});

const TourModal = mongoose.model("Tour", tourSchema);

export default TourModal;
