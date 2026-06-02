const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);


taskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate || this.completed) return false;
  return new Date(this.dueDate) < new Date();
});


taskSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Task", taskSchema);
