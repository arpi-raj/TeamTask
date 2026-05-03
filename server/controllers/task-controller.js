const Task = require("../models/task-model");
const Project = require("../models/project-model");

const checkProjectRole = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  const member = project.members.find((m) => m.user.toString() === userId.toString());
  return member ? { role: member.role, project } : null;
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;

    const access = await checkProjectRole(project, req.userID);
    if (!access) {
      return res.status(404).json({ msg: "Project not found or access denied" });
    }

    if (access.role !== "Admin") {
      return res.status(403).json({ msg: "Only project admins can create tasks" });
    }

    if (assignedTo) {
      const isMember = access.project.members.find((m) => m.user.toString() === assignedTo.toString());
      if (!isMember) {
        return res.status(400).json({ msg: "Assigned user must be a member of the project" });
      }
    }

    const newTask = await Task.create({
      title,
      description,
      project,
      assignedTo,
      dueDate,
    });

    res.status(201).json({ msg: "Task created successfully", task: newTask });
  } catch (error) {
    next(error);
  }
};

const getTasksByProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    const access = await checkProjectRole(projectId, req.userID);
    if (!access) {
      return res.status(404).json({ msg: "Project not found or access denied" });
    }

    const tasks = await Task.find({ project: projectId }).populate("assignedTo", "-password").populate("project", "name");
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.userID }).populate("project", "name");
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    const access = await checkProjectRole(task.project, req.userID);
    if (!access) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const isAssignedUser = task.assignedTo && task.assignedTo.toString() === req.userID.toString();
    const isAdmin = access.role === "Admin";

    if (!isAssignedUser && !isAdmin) {
      return res.status(403).json({ msg: "Only the assigned user or project admin can update the task" });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ msg: "Task updated successfully", task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    const access = await checkProjectRole(task.project, req.userID);
    if (!access) return res.status(403).json({ msg: "Access denied" });
    
    if (access.role !== "Admin") {
      return res.status(403).json({ msg: "Only project admins can delete tasks" });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ msg: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasksByProject, getMyTasks, updateTaskStatus, deleteTask };
