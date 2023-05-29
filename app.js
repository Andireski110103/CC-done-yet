const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get('/', (req, res) => {
  res.send("API Aktif, hehe");
})

// Routes
const authRoutes = require("./routes/auth");

// Middlewares
app.use(bodyParser.json());

// Routes
app.use("/api", authRoutes);

// PORT

// Starting a server
const server = app.listen(process.env.PORT || 8080, () => {
  const host =server.address().address;
  const port = server.address.port;

  console.log ("Runing on port 8080");
});
