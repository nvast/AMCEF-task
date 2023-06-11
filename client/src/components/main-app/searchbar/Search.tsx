import React, { useState, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import "./search.css"

export default function Search({ data, setFiltered }: any) {

    const [isOver, setIsOver] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputChange, setInputChange] = useState("")


    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        setInputChange(e.target.value)
    }

    useEffect(() => {
        const filteredData = data.filter((element: {
            content: any; title: string
        }) => {
            return element.title.toLowerCase().includes(inputChange.toLowerCase()) || element.content.toLowerCase().includes(inputChange.toLowerCase());
        });
        setFiltered(filteredData);
    }, [inputChange]);

    return (
        <div
            className="searchbar"
            onMouseEnter={() => setIsOver(true)}
            onMouseLeave={() => setIsOver(false)}
        >
            <input
                placeholder="Search.."
                // className="mx-3"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => handleInput(e)}
                value={inputChange}
                style={{ width: isFocused || isOver ? "10rem" : "0", transition: "width 0.3s ease" }}
            />
            <SearchIcon className="search-icon" />
        </div>
    )
}