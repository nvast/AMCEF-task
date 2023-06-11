import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import { ToDoItem } from "../Main";
import Search from "../searchbar/Search";
import axios from 'axios';
import 'animate.css';

interface ListProps {
  data: ToDoItem[];
  tab: number;
}

export default function List({ data, tab }: ListProps) {
  const [newData, setNewData] = useState<ToDoItem[]>([]);
  const [filtered, setFiltered] = useState<ToDoItem[]>([]);
  const [animationClass, setAnimationClass] = useState<string>('animate__fadeIn');
  const [animationKey, setAnimationKey] = useState<string>(Date.now().toString());


  useEffect(() => {
    sortData();
  }, [data]);

  useEffect(() => {
    setFiltered(filteredData);
    setAnimationClass('animate__fadeIn');
    setAnimationKey(Date.now().toString());
  }, [newData, tab]);


  const filteredData = (() => {
    if (tab === 0) {
      return newData;
    } else if (tab === 1) {
      return newData.filter((element) => element.active);
    } else {
      return newData.filter((element) => !element.active);
    }
  })();

  const sortData = () => {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();

    const sortedData = data.map((element) => {
      const deadlineDate = new Date(element.deadline);
      return { ...element, deadline: deadlineDate };
    });

    sortedData.sort((a, b) => {
      const aTimeDifference = Math.abs(a.deadline.getTime() - currentTime);
      const bTimeDifference = Math.abs(b.deadline.getTime() - currentTime);

      if (a.deadline < b.deadline) return -1;
      if (a.deadline > b.deadline) return 1;

      if (aTimeDifference < bTimeDifference) return -1;
      if (aTimeDifference > bTimeDifference) return 1;

      return 0;
    });

    setNewData(sortedData);
  };

  const handleSwitchChange = async (itemId: string) => {
    try {
      const updatedData = newData.map((item) => {
        if (item._id === itemId) {
          const updatedItem = { ...item, active: !item.active };
          return updatedItem;
        }
        return item;
      });

      setNewData(updatedData);

      const updatedActive = !newData.find((item) => item._id === itemId)?.active;

      await axios.put(`http://127.0.0.1:8000/api/data?id=${itemId}`, { active: updatedActive });
    } catch (error) {
      console.error('Error updating active attribute:', error);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/data?id=${itemId}`)

      let updatedData = newData.filter((element) => element._id !== itemId);

      setNewData(updatedData)
    } catch (error) {
      console.error('Deleting Error: ', error);
    }
  }

  return (
    <>
       <div key={animationKey} className={`container animate__animated ${animationClass}`}>
      {filtered.map((element, index) => (
        <ListItem
          key={index}
          _id={element._id}
          title={element.title}
          content={element.content}
          deadline={element.deadline}
          active={element.active}
          listName={element.listName}
          handleSwitchChange={handleSwitchChange}
          handleDelete={handleDelete}
        />
      ))}
      </div>
      <Search data={filteredData} setFiltered={setFiltered}/>
    </>
  );
}





