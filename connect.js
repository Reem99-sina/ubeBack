const mongoose = require("mongoose");
module.exports.connectdb = () => {
    return mongoose.connect("mongodb+srv://reemsina:Reemebrahim99@cluster0.olymr.mongodb.net/uber").then(() => {
        console.log("done connect to database")
    }).catch((error) => {
        console.log("error in connect", error)
    })
}