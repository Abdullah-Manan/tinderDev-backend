const cron = require("node-cron");

cron.schedule("* * * * *", () => {
  console.log("Cron job running" + new Date());
});

module.exports = { cron };
