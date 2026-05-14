const { User } = require('../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET user by id
const getUserById = async (req, res) => {
  try {
    const oneUser = await User.findByPk(req.params.id);
    res.json(oneUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE user (Register + hash password)
const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// LOGIN (NEW - JWT)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.scope(null).findOne({
      where: { email }
    });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: foundUser.id,
        email: foundUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: foundUser
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE user
const updateUser = async (req, res) => {
  try {
    await User.update(req.body, {
      where: { id: req.params.id }
    });

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser
};