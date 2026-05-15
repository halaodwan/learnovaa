const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/UserController");

router.post("/", createUser);

router.post("/login", loginUser);

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;