import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = (await Task.find()).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.log("Lỗi khi gọi GET: ", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });

    const newTask = await task.save();
    res.status(200).send(newTask);
  } catch (error) {
    console.log("Lỗi khi gọi POST: ", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const updateTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        status,
        completedAt,
      },
      { new: true }
    );

    if (!updateTask) {
      return res.status(400).json({ message: "Nhiệm vụ không tồn tại" });
    }
    res.status(200).json(updateTask);
  } catch (error) {
    console.log("Lỗi khi gọi updateTask", error);
    res.status(500).json("Lỗi hệ thống");
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deleteTask = await Task.findOneAndDelete(req.params.id);
    if (!deleteTask) {
      return res.status(400).json({ message: "Nhiệm vụ không tồn tại" });
    }
    res.status(200).json(deleteTask);
  } catch (error) {
    console.log("Lỗi khi gọi deleteTask", error);
    res.status(500).json("Lỗi hệ thống");
  }
};
