const Project = require("../models/project-model");
const User = require("../models/user-model");
const Task = require("../models/task-model");

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const newProject = await Project.create({
      name,
      description,
      members: [
        {
          user: req.userID,
          role: "Admin",
        },
      ],
    });

    res.status(201).json({ msg: "Project created successfully", project: newProject });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ "members.user": req.userID }).populate("members.user", "-password");
    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findOne({ _id: projectId, "members.user": req.userID }).populate("members.user", "-password");

    if (!project) {
      return res.status(404).json({ msg: "Project not found or access denied" });
    }

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const { email, role } = req.body;

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ msg: "User with this email not found" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const currentMember = project.members.find(
      (member) => member.user.toString() === req.userID.toString()
    );

    if (!currentMember || currentMember.role !== "Admin") {
      return res.status(403).json({ msg: "Only project admins can add members" });
    }

    const existingMember = project.members.find(
      (member) => member.user.toString() === userToAdd._id.toString()
    );

    if (existingMember) {
      return res.status(400).json({ msg: "User is already a member of this project" });
    }

    project.members.push({ user: userToAdd._id, role: role || "Member" });
    await project.save();

    res.status(200).json({ msg: "Member added successfully", project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) return res.status(404).json({ msg: "Project not found" });

    const currentMember = project.members.find(
      (member) => member.user.toString() === req.userID.toString()
    );

    if (!currentMember || currentMember.role !== "Admin") {
      return res.status(403).json({ msg: "Only project admins can delete a project" });
    }

    await Task.deleteMany({ project: projectId });
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ msg: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { id: projectId, userId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    const currentMember = project.members.find(
      (member) => member.user.toString() === req.userID.toString()
    );

    if (!currentMember || currentMember.role !== "Admin") {
      return res.status(403).json({ msg: "Only project admins can remove members" });
    }

    if (req.userID.toString() === userId.toString()) {
       return res.status(400).json({ msg: "Admins cannot remove themselves" });
    }

    project.members = project.members.filter(m => m.user.toString() !== userId.toString());
    await project.save();

    res.status(200).json({ msg: "Member removed successfully", project });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProject, getProjects, getProjectById, addMember, deleteProject, removeMember };
