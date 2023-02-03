const mongoose = require("mongoose");
const shortUrls = require("./models/shortUrls");
const express = require("express");
const app = new express();

mongoose
.connect('mongodb://127.0.0.1:27017/myapp',
 {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully..."))
  .catch(() => console.error("Unable to connect..", err));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrl = await shortUrls.find();
  res.render("index", { shortUrl: shortUrl }); // passing the object to view
});

app.post("/shortUrls", async (req, res) => {
  await shortUrls.create({
    full: req.body.fullURL,
  });
  res.redirect("/");
});

app.get("/:shortUrls", async (req, res) => {
  const shortUrl = await shortUrls.findOne({ short: req.params.shortUrls });
  if (!shortUrl) return res.status(404).send("Not Found");
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`listening on port: ${port}..`));
