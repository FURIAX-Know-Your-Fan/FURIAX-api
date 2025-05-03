import mongoose, { Schema } from "mongoose";

const MonthGrowthSchema = new Schema(
  {
    month: {
      type: Number, // 0 (Jan) a 11 (Dez)
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    userGrowth: {
      type: Number, // ex: 25 para +25%
      required: true,
    },
    postGrowth: {
      type: Number, // opcional
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "month_growth" }
);

const MonthGrowth = mongoose.model("MonthGrowth", MonthGrowthSchema);

export default MonthGrowth;
