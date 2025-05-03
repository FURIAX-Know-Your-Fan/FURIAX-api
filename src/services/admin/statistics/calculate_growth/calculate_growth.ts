import MonthGrowth from "../../../../models/MonthGrowth";
import User from "../../../../models/User";

export const calculate_growth = async () => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-based
  const previousMonth = (currentMonth + 11) % 12;
  const currentYear = now.getFullYear();
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const usersThisMonth = await User.find({
    createdAt: {
      $gte: new Date(currentYear, currentMonth, 1),
      $lt: new Date(currentYear, currentMonth + 1, 1),
    },
  });

  const usersLastMonth = await User.find({
    createdAt: {
      $gte: new Date(previousYear, previousMonth, 1),
      $lt: new Date(previousYear, previousMonth + 1, 1),
    },
  });

  const currentCount = usersThisMonth.length;
  const lastCount = usersLastMonth.length;

  const growthRate =
    lastCount === 0 ? 100 : ((currentCount - lastCount) / lastCount) * 100;

  const growthRateRounded = Math.round(growthRate);

  await MonthGrowth.updateOne(
    { month: currentMonth, year: currentYear },
    {
      $set: {
        userGrowth: growthRateRounded,
      },
    },
    { upsert: true } // cria caso não exista
  );
};
