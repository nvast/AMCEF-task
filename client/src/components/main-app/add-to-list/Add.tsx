import React, { useState, FormEvent, ChangeEvent } from "react";
import AddIcon from '@mui/icons-material/Add';
import "./add.css";
import { ToDoItem } from "../Main";

interface AddComponentProps {
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleInput: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  createData: ToDoItem;
}

export default function Add({ handleSubmit, handleInput, createData }: AddComponentProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isOver, setIsOver] = useState(false);

  return (
    <div className="container container-add">
        
      <form 
        onSubmit={handleSubmit}
        className="add-item"
        onMouseEnter={() => setIsOver(true)}
        onMouseLeave={() => setIsOver(false)}
        style={{ height: isFocused || isOver ? "13rem" : "5rem", transition: "height 0.3s ease" }}
      >
        <input
          name="title"
          placeholder="Title"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => handleInput(e)}
          value={createData.title}
          required 
        />
        <textarea
          name="content"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => handleInput(e)}
          rows={3}
          placeholder="Content"
          value={createData.content}
          required 
        />
        <input
          name="deadline"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => handleInput(e)}
          type="datetime-local"
          value={createData.deadline.toString()}
          required 
        />
        <button type="submit">
          <AddIcon />
        </button>
      
      </form>
      
    </div>
  );
}
