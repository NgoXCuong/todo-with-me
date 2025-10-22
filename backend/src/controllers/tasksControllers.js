import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;

  const now = new Date();
  let startDate;

  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "week": {
      const mondayDate = now.getDay() - 1 - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
    default: {
      startDate = null;
    }
  }

  const query = startDate ? { createdAt: { $gte: startDate } } : {};

  try {
    const result = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;

    // ✅ Gộp tất cả dữ liệu vào 1 object JSON
    res.status(200).json({
      tasks,
      activeCount,
      completeCount,
    });
  } catch (error) {
    console.error("Lỗi khi gọi GET:", error);
    res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });
    const newTask = await task.save();
    res.status(200).json(newTask);
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
      { title, status, completedAt },
      { new: true }
    );

    if (!updateTask) {
      return res.status(400).json({ message: "Nhiệm vụ không tồn tại" });
    }
    res.status(200).json(updateTask);
  } catch (error) {
    console.log("Lỗi khi gọi updateTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id);
    if (!deleteTask) {
      return res.status(400).json({ message: "Nhiệm vụ không tồn tại" });
    }
    res.status(200).json(deleteTask);
  } catch (error) {
    console.log("Lỗi khi gọi deleteTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
