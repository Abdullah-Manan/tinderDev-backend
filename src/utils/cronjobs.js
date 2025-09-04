const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../model/connectionRequest");
const sendEmail = require("./sendEmail");

cron.schedule("31 12 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yeasterdatStart = startOfDay(yesterday);
    const yeasterdatEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: { $gte: yeasterdatStart, $lte: yeasterdatEnd },
    }).populate("fromUserId toUserId");

    const listOfUsers = [
      ...new Set(pendingRequests.map((request) => request.fromUserId.email)),
    ];

    for (const user of listOfUsers) {
      const emailResponse = await sendEmail.run(
        "You have a new connection request",
        "You have a new connection request" + user
      );
      console.log(emailResponse);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = { cron };
