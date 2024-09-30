import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const urlSchema = mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortenedUrl: {
    type: String,
    required: true
  },
  shortUrlCode: {  
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});


const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImageName: {
    type: String
  },
  urls: [urlSchema]  
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
