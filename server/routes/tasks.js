const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} = require("../controllers/taskController");

// GET    /api/tasks         — list all (with optional ?status= and ?search=)
// POST   /api/tasks         — create new task
router.route("/").get(getTasks).post(createTask);

// GET    /api/tasks/:id     — get single task
// PUT    /api/tasks/:id     — update task fields
// DELETE /api/tasks/:id     — delete task
router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);

// PATCH  /api/tasks/:id/toggle — toggle completed
router.patch("/:id/toggle", toggleTask);

module.exports = router;
