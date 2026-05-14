const { Task } = require('../models');

// GET all tasks

const getAllTasks = async (req, res) => {

  try {

    const tasks = await Task.findAll();

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// GET task by id

const getTaskById = async (req, res) => {

  try {

    const task = await Task.findByPk(req.params.id);

    if (!task) {

      return res.status(404).json({ message: 'Task not found' });

    }

    res.status(200).json(task);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// POST create task

const createTask = async (req, res) => {

  try {

    const newTask = await Task.create(req.body);

    res.status(201).json(newTask);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// PUT update task

const updateTask = async (req, res) => {

  try {

    const task = await Task.findByPk(req.params.id);

    if (!task) {

      return res.status(404).json({ message: 'Task not found' });

    }

    await task.update(req.body);

    res.status(200).json({ message: 'Task updated successfully', task });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// DELETE task

const deleteTask = async (req, res) => {

  try {

    const task = await Task.findByPk(req.params.id);

    if (!task) {

      return res.status(404).json({ message: 'Task not found' });

    }

    await task.destroy();

    res.status(200).json({ message: 'Task deleted successfully' });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

module.exports = {

  getAllTasks,

  getTaskById,

  createTask,

  updateTask,

  deleteTask,

};