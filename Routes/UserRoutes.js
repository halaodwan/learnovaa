const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser
} = require('../controllers/UserController');

const auth = require('../middleware/auth.js');


// 🔓 Public routes
router.post('/login', loginUser);
router.post('/', createUser);


// 🔐 Protected routes (JWT required)
router.get('/', auth, getAllUsers);
router.get('/:id', auth, getUserById);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;