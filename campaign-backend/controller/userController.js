const { models } = require("../sequelize");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userAddValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(20),
  cryptoWallet: Joi.string().required(),
});

const loginValidation = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
});

exports.postAddUser = async (req, res) => {
  try {
    const validUser = userAddValidation.validate(req.body);
    if (validUser.error) {
      return res
        .status(400)
        .json({ status: "fail", message: validUser.error.message });
    }
    const User = await models.user.findOne({
      where: { email: req.body.email },
    });
    if (User === null) {
      const user = await models.user.create(req.body);
      res.status(200).json({ user });
    } else {
      return res.status(401).json({ message: "Email is registered" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.postLogin = async (req, res) => {
  try {
    
    const validUser = loginValidation.validate(req.body);
    if (validUser.error) {
      return res
        .status(400)
        .json({ status: "fail", message: validUser.error.message });
    }
    const user = await models.user.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (bcrypt.compareSync(req.body.password, user.dataValues.password)) {
      const token = jwt.sign(user.dataValues, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
      return res.status(200).json({ token });
    } else {
      res.status(401).json({ messgae: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
