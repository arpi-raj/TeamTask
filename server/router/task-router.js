const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.route("/").post(authMiddleware, taskController.createTask);
router.route("/my-tasks").get(authMiddleware, taskController.getMyTasks);
router.route("/project/:projectId").get(authMiddleware, taskController.getTasksByProject);
router.route("/:id/status").patch(authMiddleware, taskController.updateTaskStatus);
router.route("/:id").delete(authMiddleware, taskController.deleteTask);

module.exports = router;
