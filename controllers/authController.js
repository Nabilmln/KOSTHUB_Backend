const Auth = require("../models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password, fullname, nomor, tanggal_lahir, alamat } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!username || !email || !password || !fullname || !nomor) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await Auth.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const newUser = new Auth({
      username,
      email,
      password: hashedPassword,
      fullname,
      nomor,
      tanggal_lahir: tanggal_lahir || null,
      alamat: alamat || null,
      token: null,
    });

    await newUser.save();
    res.status(201).json({ data:newUser, message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Auth.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
}