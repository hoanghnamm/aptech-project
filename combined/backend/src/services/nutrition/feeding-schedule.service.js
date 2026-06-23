const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function buildFeedingSchedule(mealsPerDay) {
  const schedules = {
    1: ["08:00"],
    2: ["08:00", "18:00"],
    3: ["07:00", "13:00", "19:00"],
    4: ["07:00", "11:00", "15:00", "19:00"],
    5: ["07:00", "11:00", "14:00", "17:00", "20:00"],
    6: ["07:00", "10:00", "13:00", "16:00", "19:00", "22:00"],
  };

  return schedules[clamp(mealsPerDay, 1, 6)] || schedules[2];
}

module.exports = {
  buildFeedingSchedule,
};