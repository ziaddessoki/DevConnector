const express = require("express");
const connectDB = require("./config/db");

const app = express();
//connecting to DB
connectDB();

// Init Middleware (enables reading reading req.body from routes)
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("App running"));

//Defining routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is up at ${PORT}`));
