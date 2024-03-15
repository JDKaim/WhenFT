require("./mongoose.js"); // Connect to MongoDB database
const express = require("express");
const cors = require("cors");
const postRouter = require("./routers/users");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json()); // Expect JSON data to be sent to/from
app.use(cors()); // Enable all CORS requests instead cuz why not
app.use(postRouter); // Enable POST requests from other file

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
