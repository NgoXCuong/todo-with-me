import mongoose from "mongoose";

const taskScheme = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "complete"],
      default: "active",
    },
    conpleteAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // CraeteAt and Update auto add
  }
);

const Task = mongoose.model("Task", taskScheme);
export default Task;
