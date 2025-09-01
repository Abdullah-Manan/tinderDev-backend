const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, Subject, Body) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: Body,
        },
        Text: {
          Charset: "UTF-8",
          Data: Body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: Subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (Subject, Body) => {
  const sendEmailCommand = createSendEmailCommand(
    "abdullahmanan010@gmail.com",
    "Manan@abdullahs.site",
    Subject,
    Body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };
