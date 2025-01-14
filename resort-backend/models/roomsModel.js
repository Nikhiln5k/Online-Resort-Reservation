const mongoose = require("mongoose");

const roomsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  amenities: [String],
  images: [String],
  availability: Boolean,
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      rating: Number,
      comment: String,
    },
  ],
});

const rooms = mongoose.model("rooms", roomsSchema);
module.exports = rooms;

// {
//   "title":"Comfort Suit",
//   "price":"3000",
//   "description":"best comfort",
//   "amenities":["AC", "Swimming Pool", "Bar"],
//   "images":["https://media.designcafe.com/wp-content/uploads/2021/09/27095756/bedroom-design-with-window-bay-seating.jpg","https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/jas-2024-1720241010-wAOzD/wall-design-1720780354-h2rNT/wall-design-30-1721373767-iFb3S.jpg","https://image.made-in-china.com/226f3j00mOEVpnTCkMqS/Modern-Luxury-Hotel-Restaurant-Furniture-Sets-Wooden-Bar-Counter-Beach-Resort-Villa-Outdoor-Bar-Furniture.webp","https://thumbs.dreamstime.com/b/gazebo-bar-next-to-pool-tropical-beach-hotel-resort-swimming-luxury-restaurant-left-side-behind-54783934.jpg"],
//   "availability": true,
//   "reviews":[{"userId":"677bb1f399a946bc639dc1db","rating":5, "comment":"Good service"},
//   {"userId":"677bbb50cc5b3a26ce4666dd","rating":4, "comment":"Good service"}]
// }
