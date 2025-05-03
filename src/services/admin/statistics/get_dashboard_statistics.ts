import { Request, Response } from "express";
import User from "../../../models/User";
import Post from "../../../models/Post";
import { calculate_growth } from "./calculate_growth/calculate_growth";
import MonthGrowth from "../../../models/MonthGrowth";

export const get_dashboard_statistics = async (req: Request, res: Response) => {
  try {
    const users = await User.find({
      // Exclude admin users
      role: { $ne: "admin" },
    });

    const posts = await Post.find();

    const total_interactions = posts.reduce(
      (acc, post) => acc + post.comments.length + post.likes.length,
      0
    );

    // popular insterests
    const interests = users.reduce((acc: Record<string, number>, user) => {
      user.interests?.forEach((interest) => {
        if (acc[interest]) {
          acc[interest]++;
        } else {
          acc[interest] = 1;
        }
      });
      return acc;
    }, {});

    // Sort interests by popularity
    const sorted_interests = Object.entries(interests).sort(
      (a, b) => b[1] - a[1]
    );
    const popular_interests = sorted_interests.slice(0, 5).map((item) => ({
      interest: item[0],
      count: item[1],
    }));

    // user states
    const locations = users.reduce((acc: Record<string, number>, user) => {
      const location = user.adress?.state;
      if (location) {
        if (acc[location]) {
          acc[location]++;
        } else {
          acc[location] = 1;
        }
      }
      return acc;
    }, {});

    // Sort locations by popularity
    const sorted_locations = Object.entries(locations).sort(
      (a, b) => b[1] - a[1]
    );

    // Format locations
    const formatted_locations = sorted_locations.map((item) => ({
      location: item[0],
      count: item[1],
    }));

    // get grwowth rate
    calculate_growth();
    const growth_data = await MonthGrowth.find();

    // user enthusiast_level count
    const enthusiast_levels = users.reduce(
      (acc: Record<string, number>, user) => {
        const level = user.enthusiast_level;
        if (level) {
          if (acc[level]) {
            acc[level]++;
          } else {
            acc[level] = 1;
          }
        }
        return acc;
      },
      {}
    );
    // Sort enthusiast levels by popularity
    const sorted_enthusiast_levels = Object.entries(enthusiast_levels).sort(
      (a, b) => b[1] - a[1]
    );
    // Format enthusiast levels
    const formatted_enthusiast_levels = sorted_enthusiast_levels.map(
      (item) => ({
        level: item[0],
        count: item[1],
      })
    );

    res.status(200).json({
      total_users: users.length,
      total_posts: posts.length,
      total_interactions: total_interactions,
      popular_interests: popular_interests,
      user_locations: formatted_locations,
      growth_rate: growth_data,
      enthusiast_levels: formatted_enthusiast_levels,
    });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
