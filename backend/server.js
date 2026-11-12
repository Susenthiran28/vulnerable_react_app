const uri = "";
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

let helmet;
try {
  helmet = require("helmet");
} catch (e) {
  helmet = () => (req, res, next) => next();
}

const app = express();
const PORT = 5000;
const SECRET_KEY = "secretkey";
const JWT_ALGORITHMS = ["HS256"];
const JSON_BODY_LIMIT = process.env.JSON_BODY_LIMIT || "1mb";

// Middleware
app.use(helmet());
// Configure allowed browser origins via CORS_ORIGINS (comma-separated) for deployment.
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser or same-origin requests with no Origin header (e.g., curl/server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);
app.use(bodyParser.json({ limit: JSON_BODY_LIMIT }));

// MongoDB Bağlantısı (Güncelleme)
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Kullanıcı Şeması
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
  })
);

function normalizeCredentials(body) {
  const { username, password } = body || {};

  if (typeof username !== "string" || typeof password !== "string") {
    return { error: "Geçersiz giriş verileri!" };
  }

  const normalizedUsername = username.trim();
  const normalizedPassword = password.trim();

  if (!normalizedUsername || !normalizedPassword) {
    return { error: "Geçersiz giriş verileri!" };
  }

  if (normalizedUsername.length > 64 || normalizedPassword.length > 128) {
    return { error: "Geçersiz giriş verileri!" };
  }

  return { username: normalizedUsername, password: normalizedPassword };
}

// Register Route
app.post("/register", async (req, res) => {
  const normalized = normalizeCredentials(req.body);
  if (normalized.error) {
    return res.status(400).json({ message: "Geçersiz giriş verileri!" });
  }

  const newUser = new User({
    username: normalized.username,
    password: normalized.password,
  });

  try {
    await newUser.save();
    res.json({ message: "Kayıt başarılı!" });
  } catch (error) {
    res.status(400).json({ message: "Kullanıcı zaten var!" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const normalized = normalizeCredentials(req.body);
  if (normalized.error) {
    return res.status(400).json({ message: "Geçersiz giriş verileri!" });
  }

  const user = await User.findOne({
    username: normalized.username,
    password: normalized.password,
  });

  if (!user) {
    return res.status(401).json({ message: "Giriş başarısız!" });
  }

  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Giriş başarılı!", token });
});

// Korunan Route
app.get("/protected", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = typeof authHeader === "string" && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader;

  if (!token) {
    return res.status(403).json({ message: "Token gerekli!" });
  }

  jwt.verify(token, SECRET_KEY, { algorithms: JWT_ALGORITHMS }, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Yetkisiz erişim!" });
    }

    const userId = decoded && decoded.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "Yetkisiz erişim!" });
    }

    try {
      const user = await User.findById(userId).select("username");
      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
      }

      res.json({
        message: "Korunan Sayfaya Hoşgeldiniz!",
        username: user.username,
      });
    } catch (error) {
      return res.status(500).json({ message: "Sunucu hatası!" });
    }
  });
});

app.use((err, req, res, next) => {
  if (err && err.type === "entity.too.large") {
    return res.status(413).json({ message: "İstek gövdesi çok büyük!" });
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Geçersiz JSON!" });
  }

  return next(err);
});

// Sunucu Başlat
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));