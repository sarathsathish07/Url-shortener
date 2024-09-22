import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
const logoutUser = expressAsyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
});

const shortenUrl = expressAsyncHandler(async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    res.status(400);
    throw new Error("URL is required");
  }

  const shortUrlCode = Math.random().toString(36).substr(2, 5); 
  const shortUrl = `http://localhost:5000/${shortUrlCode}`; 

  const user = await User.findById(req.user._id);

  const urlData = {
    originalUrl: longUrl,
    shortenedUrl: shortUrl, 
    shortUrlCode, 
    dateCreated: new Date(),
  };

  user.urls.push(urlData);
  await user.save();

  res.status(201).json({
    message: "URL shortened successfully",
    shortUrlCode,
    shortenedUrl: shortUrl,
  });
});

const redirect = expressAsyncHandler(async (req, res) => {
  const { code } = req.params;

  const user = await User.findOne({
    "urls.shortenedUrl": `http://localhost:5000/${code}`,
  });

  if (user) {
    const urlData = user.urls.find(
      (url) => url.shortenedUrl === `http://localhost:5000/${code}`
    );
    if (urlData) {
      return res.redirect(urlData.originalUrl);
    }
  }

  res.status(404).json({ message: "Shortened URL not found" });
});

export { authUser, registerUser, logoutUser, shortenUrl, redirect };
