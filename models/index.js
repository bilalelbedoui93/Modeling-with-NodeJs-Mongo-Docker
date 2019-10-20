const mongoose = require("mongoose");

const model = mongoose.model.bind(mongoose);

const {
    group,
    channel,
    subchannel,
    content,
    pdf,
    video,
    text
} = require("./schemas")

module.exports = {
    Group: model("groups", group),
    Channel: model("channels", channel),
    Subchannel: model("subchannels", subchannel),
    Content: model("content", content),
    Pdf: model("pdfs", pdf),
    Video: model("videos", video),
    Text: model("texts", text)
};



