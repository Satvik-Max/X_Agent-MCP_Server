import { config } from "dotenv"
import { TwitterApi } from "twitter-api-v2"
config()


const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

export async function createPost(status) {
    const newPost = await twitterClient.v2.tweet(status)

    return {
        content: [
            {
                type: "text",
                text: `Tweeted: ${status}`
            }
        ]
    }
}

export async function deleteLatestPost() {
  try {
    const user = await twitterClient.v2.me();
    const timeline = await twitterClient.v2.userTimeline(user.data.id, { max_results: 5 });

    if (!timeline.data?.data?.length) {
      return {
        content: [{ type: "text", text: "⚠️ No tweets found to delete." }]
      };
    }

    const latestTweetId = timeline.data.data[0].id;

    await twitterClient.v2.deleteTweet(latestTweetId);

    return {
      content: [{ type: "text", text: `🗑️ Deleted tweet with ID: ${latestTweetId}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `❌ Error deleting tweet. ${error.message}` }]
    };
  }
}