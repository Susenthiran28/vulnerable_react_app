
const uri = "";
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const SECRET_KEY = "secretkey";
const JWT_ALGORITHM = "HS256";
const JSON_BODY_LIMIT = "1mb";

const CORS_ORIGINS = (process.env.CORS_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean);
const CORS_METHODS = (process.env.CORS_METHODS || "GET,POST,PUT,PATCH,DELETE,OPTIONS").split(",").map((method) => method.trim().toUpperCase()).filter(Boolean);
const CORS_ALLOWED_HEADERS = (process.env.CORS_ALLOWED_HEADERS || "Content-Type,Authorization").split(",").map((header) => header.trim()).filter(Boolean);
const CORS_CREDENTIALS = process.env.CORS_CREDENTIALS === "true";

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (CORS_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: CORS_METHODS,
  allowedHeaders: CORS_ALLOWED_HEADERS,
  credentials: CORS_CREDENTIALS,
};

// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(bodyParser.json({ limit: JSON_BODY_LIMIT }));

// MongoDB Bağlantısı (Güncelleme)
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Defense-in-depth for query safety
mongoose.set("sanitizeFilter", true);
mongoose.set("strictQuery", true);

// Kullanıcı Şeması
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
  })
);

function parseCredentials(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const { username, password } = body;

  if (typeof username !== "string" || typeof password !== "string") {
    return null;
  }

  const normalizedUsername = username.trim();
  const normalizedPassword = password.trim();

  if (!normalizedUsername || !normalizedPassword) {
    return null;
  }

  if (normalizedUsername.length > 128 || normalizedPassword.length > 256) {
    return null;
  }

  return { username: normalizedUsername, password: normalizedPassword };
}

// Register Route
app.post("/register", async (req, res) => {
  const credentials = parseCredentials(req.body);

  if (!credentials) {
    return res.status(400).json({ message: "Geçersiz giriş verileri!" });
  }

  const newUser = new User(credentials);

  try {
    await newUser.save();
    res.json({ message: "Kayıt başarılı!" });
  } catch (error) {
    res.status(400).json({ message: "Kullanıcı zaten var!" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const credentials = parseCredentials(req.body);

  if (!credentials) {
    return res.status(400).json({ message: "Geçersiz giriş verileri!" });
  }

  const user = await User.findOne({
    username: credentials.username,
    password: credentials.password,
  });

  if (!user) {
    return res.status(401).json({ message: "Giriş başarısız!" });
  }

  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h", algorithm: JWT_ALGORITHM });
  res.json({ message: "Giriş başarılı!", token });
});

// Korunan Route
app.get("/protected", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token gerekli!" });
  }

  jwt.verify(token, SECRET_KEY, { algorithms: [JWT_ALGORITHM] }, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Yetkisiz erişim!" });
    }

    if (!decoded || typeof decoded.id !== "string" || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(400).json({ message: "Geçersiz kullanıcı kimliği!" });
    }

    try {
      const user = await User.findById(decoded.id).select("username");
      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
      }

      res.json({
        message: "Korunan Sayfaya Hoşgeldiniz!",
        username: user.username,
      });
    } catch (error) {
      if (error && error.name === "CastError") {
        return res.status(400).json({ message: "Geçersiz kullanıcı kimliği!" });
      }

      return res.status(500).json({ message: "Sunucu hatası!" });
    }
  });
});

// Sunucu Başlat
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
