console.log("hello");
//make server using express
const express = require("express");
const app = express();
//make server using express
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  console.log("hello");
  res.json({
    status: "success",
  });
});

//listen to port 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
