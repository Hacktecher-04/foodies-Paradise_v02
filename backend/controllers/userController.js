const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUSer = await User.findOne({ email });
    if (checkUSer) {
      return res.json({
        success: false,
        message: "User Already exists ",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
      
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registration successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    
    

    const token = await jwt.sign(
      {
        id: user._id,
        name: user.userName,
        email: user.email,
        role: user.role,
      },
      process.env.SECRETE_KEY,
      { expiresIn: "24hr" }
    );

    res.cookie("token", token).json({
      success: true,
      message: "Login successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const logOut = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "logout Successfully!",
  });
};

module.exports = { registerUser, loginUser, logOut };
