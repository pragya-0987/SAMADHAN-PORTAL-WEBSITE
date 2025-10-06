const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const cors = require("cors");

const app = express();
connectDB();
app.use(express.json()); // For JSON bodies
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "samadhanSecret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://guptatejasv86086:IHiNa09sVQaCgM9N@cluster0.6etxq2u.mongodb.net/samadhaan_db?retryWrites=true&w=majority&appName=Cluster0",
    }),
  })
);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Auth Routes
app.use("/", authRoutes);

// complaint route
const complaintRoutes = require("./routes/submitComplaint");

app.use("/complaints", complaintRoutes);

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login.html");
}

// Example protected route
app.get("/home.html", isAuthenticated, (req, res, next) => {
  next();
});

// Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
