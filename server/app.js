const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const ToDoListItems = require("./models").ToDoListItems;
const ToDoList = require("./models").ToDoList;

const app = express();

app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});


mongoose.connect("mongodb://127.0.0.1:27017/ToDoList", { useNewUrlParser: true });

app.route("/api/data")
  .get(async (req, res) => {
    try {
      const { listName } = req.query;
      let list = await ToDoList.find();
      if (!list) {
        list = new ToDoList({ name: listName });
        await list.save();
      }

      res.json(list);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving data" });
    }
  })

  .post(async (req, res) => {
    try {
      const { listName, title, content, deadline, active } = req.body;

      let list = await ToDoList.findOne({ name: listName });

      if (!list) {
        list = new ToDoList({ name: listName });
      }

      const newItem = new ToDoListItems({ title, content, deadline, active });
      await newItem.save();

      list.items.push(newItem);
      await list.save();

      res.status(201).json({ message: "Data created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating data" });
    }
  })

  .put(async (req, res) => {
    // handle active switch
    const isActive = req.body.active;
    const itemId = req.query.id;

    try {
      const item = await ToDoListItems.findById(itemId);

      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      item.active = isActive;
      await item.save();

      const todoList = await ToDoList.findOne({ "items._id": itemId });

      if (!todoList) {
        return res.status(404).json({ message: 'Item not found' });
      }

      const itemIndex = todoList.items.findIndex(item => item._id.toString() === itemId);
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found' });
      }

      // handle listItem.tsx
      todoList.items[itemIndex].active = isActive;
      await todoList.save();

      const { title, content } = req.body;

      if (title && content) {
        item.title = title;
        item.content = content;
        await item.save();

        todoList.items[itemIndex].title = title;
        todoList.items[itemIndex].content = content;
        await todoList.save();
      }

      res.sendStatus(200);
    } catch (error) {
      console.error('Error updating active attribute:', error);
      res.sendStatus(500);
    }
  })

  .delete(async (req, res) => {
    try {
      const itemId = req.query.id;
      const itemName = req.query.name;
  
      if (itemId) {
        const item = await ToDoListItems.findOneAndDelete({ _id: itemId });
        const todoList = await ToDoList.findOneAndUpdate(
          { "items._id": itemId },
          { $pull: { items: { _id: itemId } } },
          { new: true }
        );
  
        if (!item || !todoList) {
          return res.status(404).json({ message: 'Item not found' });
        }
      } else if (itemName) {
        const todoList = await ToDoList.findOneAndDelete({ name: itemName });
  
        if (!todoList) {
          return res.status(404).json({ message: 'Item not found' });
        }
      } else {
        return res.status(400).json({ message: 'Missing ID or name parameter' });
      }
  
      res.sendStatus(200);
    } catch (error) {
      console.error('Error deleting item/list:', error);
      res.sendStatus(500);
    }
  })
  





app.route("*")
  .get((req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  })




app.listen(process.env.PORT || 8000, function () {
  console.log("Server running");
});
