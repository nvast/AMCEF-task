import React, { useState, useRef } from "react";
import { ToDoItem } from "../Main";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import "./listItem.css"
import axios from "axios";
import { useParams } from "react-router-dom";

type ToDoItemWithSwitchChange = ToDoItem & {
  handleSwitchChange: (itemId: string) => Promise<void>;
  handleDelete: (itemId: string) => Promise<void>;
};

export default function ListItem({ _id, title, content, deadline, active, handleSwitchChange, handleDelete }: ToDoItemWithSwitchChange) {
  const [isOver, setIsOver] = useState(false);
  const [isEditable, setIsEditable] = useState(false)
  const editedTitle = useRef<HTMLParagraphElement | null>(null);
  const editedContent = useRef<HTMLParagraphElement | null>(null);
  const { listName } = useParams();

  const deadLine = Array.from(deadline.toString().split("T"))[0].replace("GM", "")
  const splitDate: string[] = deadLine.split(" ")
  const date: string = splitDate.slice(0, 4).join(" ");
  const time: string = splitDate[4] ? splitDate[4].slice(0, 5) : "00:00";


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    handleSwitchChange(_id);
  };

  const deleteItem = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    handleDelete(_id);
  };

  const saveChanges = async () => {
    try {
      let pContent = editedContent.current?.textContent;
      let tContent = editedTitle.current?.textContent;

      let dataToUpdate = {
        _id: _id,
        title: tContent,
        content: pContent,
        deadline: deadline,
        active: active,
        listName: listName
      }

      await axios.put(`/api/data?id=${_id}`, dataToUpdate);

      console.log(pContent, tContent);
      setIsEditable(false);
    } catch (error) {
      console.error("Error occurred while saving changes:", error);
    }
  }


  return (
    <div
      className={`item ${isEditable ? "editable" : ""}`}
      onMouseEnter={() => setIsOver(true)}
      onMouseLeave={() => setIsOver(false)}
    >
      <h3
        contentEditable={isEditable ? "true" : "false"}
        suppressContentEditableWarning={true}
        style={{ borderBottom: isEditable ? "2px solid black" : "none" }}
        className="text-center"
        ref={editedTitle}
      >
        {title}
      </h3>
      <p
        contentEditable={isEditable ? "true" : "false"}
        suppressContentEditableWarning={true}
        style={{ borderBottom: isEditable ? "2px solid black" : "none" }}
        className="mt-5 mb-5"
        ref={editedContent}
      >
        {content}
      </p>
      <p
        className="text-center"><b>{time}</b>
      </p>
      <p
        className="text-center">{date}
      </p>
      <div
        className="item-handle text-center"
        // style={{ display: isOver ? "block" : "none" }}
        style={{ height: isOver ? "4rem" : "0", transition: "height 0.3s ease" }}
      >
        <IconButton aria-label="delete" size="large">
          {isEditable ? (
            <EditIcon onClick={saveChanges} />
          ) : (
            <EditIcon onClick={() => setIsEditable(true)} />
          )}
        </IconButton>
        <Switch checked={active} onChange={handleChange} />
        <IconButton aria-label="delete" size="large">
          <DeleteForeverIcon onClick={deleteItem} />
        </IconButton>

      </div>
    </div>
  );
}