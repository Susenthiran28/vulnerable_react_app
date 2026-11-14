
const uri = "";
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

// Register Route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Geçersiz giriş verileri!" });
  }

  const newUser = new User({ username, password });

  try {
    await newUser.save();
    res.json({ message: "Kayıt başarılı!" });
  } catch (error) {
    res.status(400).json({ message: "Kullanıcı zaten var!" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

 /*  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Geçersiz giriş verileri!" });
  } */

  if (!SECRET_KEY) {
    return res.status(500).json({ message: "Sunucu yapılandırma hatası!" });
  }

  const user = await User.findOne({ username, password });

  if (!user) {
    return res.status(401).json({ message: "Giriş başarısız!" });
  }

  // HS256 requires the same shared secret for signing and verification.
  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h", algorithm: "HS256" });
  res.json({ message: "Giriş başarılı!", token });
});

// Korunan Route
app.get("/protected", (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "Token gerekli!" });
  }

  if (!SECRET_KEY) {
    return res.status(500).json({ message: "Sunucu yapılandırma hatası!" });
  }

  let token = authHeader;
  if (authHeader.startsWith("Bearer ")) {
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || !parts[1]) {
      return res.status(401).json({ message: "Yetkisiz erişim!" });
    }
    token = parts[1];
  }

  // Keep HS256 allowlist strict to prevent algorithm confusion.
  jwt.verify(token, SECRET_KEY, { algorithms: ["HS256"] }, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Yetkisiz erişim!" });
    }

    const user = await User.findById(decoded.id).select("username");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
    }

    res.json({
      message: "Korunan Sayfaya Hoşgeldiniz!",
      username: user.username,
    });
  });
});

if (require.main === module) {
  if (!SECRET_KEY) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  // Sunucu Başlat
  app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
}

module.exports = app;
