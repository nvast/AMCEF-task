import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function GetStarted() {

    const [listName, setListName] = useState("")
    const navigate = useNavigate();

    return (
        <div className="welcome">
            <h1 className="mt-5">Welcome to the ToDo List app</h1>
            <h3 className="m-3">Choose name for your first List</h3>
            <form className="d-flex flex-column align-items-center">
                <input className="mt-5" type="text" onChange={(e) => setListName(e.target.value)} value={listName} placeholder="List name" ></input>
                <button className="btn btn-primary m-4 w-50" onClick={() => navigate(`/list/${listName}`)} >Create!</button>
            </form>
        </div>
    );
}

export default GetStarted;
