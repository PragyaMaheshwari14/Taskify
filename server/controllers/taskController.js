const Task = require("../models/Task");

// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const filter = {};

    // Status filter
    if (status === "active") filter.completed = false;
    if (status === "completed") filter.completed = true;

    // Search filter (case-insensitive title match)
    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    // Count totals (always against unfiltered dataset)
    const totalActive = await Task.countDocuments({ completed: false });
    const totalCompleted = await Task.countDocuments({ completed: true });

    res.json({
      success: true,
      count: tasks.length,
      meta: { totalActive, totalCompleted },
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, error: "Task not found" });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      dueDate: dueDate || null,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id  — full update (title, description, dueDate)
const updateTask = async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;

    if (title !== undefined && !title.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Title cannot be empty" });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined)
      updateFields.description = description.trim();
    if (dueDate !== undefined) updateFields.dueDate = dueDate || null;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res
        .status(404)
        .json({ success: false, error: "Task not found" });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id/toggle  — toggle completed status
const toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, error: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, error: "Task not found" });
    }
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
};
