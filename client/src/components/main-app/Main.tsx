import React, { useState, useEffect, FormEvent, ChangeEvent, SyntheticEvent } from "react";
import { useParams } from "react-router-dom";
import Add from "./add-to-list/Add";
import List from "./display-list/List";
import Choice from "./Choice";
import axios from "axios";
import * as Yup from 'yup';

export interface ToDoItem {
  _id: string;
  title: string;
  content: string;
  deadline: string | Date;
  active: boolean;
  listName: string;
}


type ToDoListResponse = {
  _id: string;
  name: string;
  items: ToDoItem[];
  __v: number;
};

type MainProps = {
  setListNames: React.Dispatch<React.SetStateAction<string[]>>;
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
  deadline: Yup.string().required('Deadline is required'),
});


export default function Main({  setListNames }: MainProps) {
  const { name } = useParams();
  const [data, setData] = useState<ToDoItem[]>([]);
  const [tab, setTab] = useState(0);
  const [createData, setCreateData] = useState<ToDoItem>({
    _id: "",
    title: "",
    content: "",
    deadline: "",
    active: true,
    listName: name as string
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
  try {
    const response = await axios.get<ToDoListResponse[]>(`http://127.0.0.1:8000/api/data`);
    const listsNames = response.data.map((list) => list.name);
    const todoList = response.data.find((list) => list.name === name);

    todoList && setData(todoList.items);
    setListNames(listsNames)    
    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await validationSchema.validate(createData, { abortEarly: false });
      await axios.post("http://127.0.0.1:8000/api/data", createData);
      await fetchData()
      setCreateData({
        _id: "",
        title: "",
        content: "",
        deadline: "",
        active: true,
        listName: name as string
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTab = (event: SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };


  return (
    <div className="container">
      <Choice tab={tab} handleTab={handleTab} />
      <Add
        handleSubmit={handleSubmit}
        handleInput={handleInput}
        createData={createData}
      />
      <List data={data} tab={tab} />
    </div>
  );
}
