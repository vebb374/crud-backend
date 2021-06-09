const express = require("express");
const cors = require("cors");
const actorrouter = require("./routes/actors.routes");

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const app = express();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api", actorrouter);

// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
