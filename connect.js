const mongoose = require("mongoose");
module.exports.connectdb = () => {
  return mongoose
    .connect(
      // "mongodb+srv://reemsina:Reemebrahim99@cluster0.olymr.mongodb.net/uber"
      "mongodb+srv://reemsina:A6dg7ia4%40@cluster0.f01jr9o.mongodb.net/uber"
    )
    .then(() => {
      console.log("done connect to database");
    })
    .catch((error) => {
      console.log("error in connect", error);
    });
};
