import mongoose, { Schema } from "mongoose";

const TweetSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    tweets: [
      {
        text: {
          type: String,
          required: true,
        },
        created_at: {
          type: Date,
          required: true,
        },
        retweet_count: {
          type: Number,
          required: true,
        },
        favorite_count: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    collection: "users_tweets",
  }
);

const Tweet = mongoose.model("Tweet", TweetSchema);

export default Tweet;
