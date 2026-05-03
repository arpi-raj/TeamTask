const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.route("/").post(authMiddleware, projectController.createProject);
router.route("/").get(authMiddleware, projectController.getProjects);
router.route("/:id").get(authMiddleware, projectController.getProjectById);
router.route("/:id/members").post(authMiddleware, projectController.addMember);
router.route("/:id").delete(authMiddleware, projectController.deleteProject);
router.route("/:id/members/:userId").delete(authMiddleware, projectController.removeMember);

module.exports = router;
