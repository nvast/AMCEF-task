const mongoose = require("mongoose");

const ToDoListItemsSchema = new mongoose.Schema({
  title: String,
  content: String,
  deadline: String,
  active: Boolean,
});

const ToDoListItems = mongoose.model("ToDoListItem", ToDoListItemsSchema);

const ToDoListSchema = new mongoose.Schema({
  name: String,
  items: [ToDoListItemsSchema]
});

const ToDoList = mongoose.model("ToDoList", ToDoListSchema);

module.exports = {
  ToDoListItems,
  ToDoList
};