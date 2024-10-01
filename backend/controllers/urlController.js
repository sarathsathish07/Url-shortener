import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const generateUniqueShortCode = async () => {
  let isUnique = false;
  let shortUrlCode = "";

  while (!isUnique) {
    shortUrlCode = Math.random().toString(36).substr(2, 5); 

    const existingUser = await User.findOne({
      "urls.shortUrlCode": shortUrlCode,
    });

    if (!existingUser) {
      isUnique = true;
    }
  }

  return shortUrlCode;
};

const shortenUrl = expressAsyncHandler(async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({
      success: false,
      message: "URL is required",
      error: {
        code: 400,
        description: "No long URL provided in the request",
      },
    });
  }

  const shortUrlCode = await generateUniqueShortCode();
  const shortUrl = `https://url-shortener-oytx.onrender.com/${shortUrlCode}`;

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
    success: true,
    message: "URL shortened successfully",
    data: {
      shortUrlCode,
      shortenedUrl: shortUrl,
    },
  });
});

const redirect = expressAsyncHandler(async (req, res) => {
  const { code } = req.params;

  const user = await User.findOne({
    "urls.shortenedUrl": `https://url-shortener-oytx.onrender.com/${code}`,
  });

  if (user) {
    const urlData = user.urls.find(
      (url) => url.shortenedUrl === `https://url-shortener-oytx.onrender.com/${code}`
    );
    if (urlData) {
      return res.redirect(urlData.originalUrl);
    }
  }

  res.status(404).json({
    success: false,
    message: "Shortened URL not found",
    error: {
      code: 404,
      description: "No matching shortened URL found for the given code",
    },
  });
});

export { shortenUrl, redirect };
