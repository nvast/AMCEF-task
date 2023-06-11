import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TextField from '@mui/material/TextField';
import MenuIcon from '@mui/icons-material/Menu';
import "./drawer.css"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

type Anchor = 'left';
type DrawerProps = {
  listNames: string[];
  setListNames: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TemporaryDrawer({ listNames, setListNames }: DrawerProps) {
  const [state, setState] = React.useState({
    left: false,
  });
  const [getInput, setGetInput] = React.useState(false)
  const [listOfLists, setListOfLists] = React.useState<string[]>([]);
  const [item, setItem] = React.useState("")
  const [isOver, setIsOver] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setListOfLists([...listNames]);
  }, [listNames]);

  function handleButton(e: any) {
    e.preventDefault()
    setGetInput((prev) => !prev)
  }

  function handleNewList(e: any) {

    if (e.key === "Enter") {
      e.preventDefault();
      const inputElement = e.target as HTMLInputElement;
      const newValue = inputElement.value;
      setListOfLists((prevList) => [...prevList, newValue]);
      setGetInput(false)
    }

  }

  async function deleteList(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    event.stopPropagation();
    try {
      console.log(item)
      await axios.delete(`/api/data?name=${item}`);
      setListOfLists((prev) => prev.filter((listName) => listName !== item));
      setItem("");
    } catch (error) {
      console.error('Error deleting List:', error);
    }
  }
  
  

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


  const list = (anchor: Anchor) => (
    <Box
      role="presentation"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <List>
        <div className='d-flex justify-content-center align-items-center m-3'>
          <Button variant="contained" onClick={(e) => handleButton(e)}>New List</Button>
        </div>
        <div className='d-flex justify-content-center align-items-center m-3'>
          {getInput &&
            <TextField
              id="standard-basic"
              label="New list name"
              variant="standard"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(e) => handleNewList(e)}
            />}
        </div>
        {listOfLists.map((text, index) => (
          <React.Fragment key={text}>
          <div
            className='d-flex list-item'
            onMouseEnter={() => { setIsOver(true); setItem(text) }}
            onMouseLeave={() => { setIsOver(false); setItem("") }}
          >
            <div className='list-icon inline-block'>
              {isOver && item === text ? (
                
                <DeleteForeverIcon onClick={(e) => { e.stopPropagation(); deleteList(e); }} />
              ) : (
                <ListAltIcon />
              )}
            </div>
            <div className="list-text" onClick={() => (navigate(`/list/${text}`), window.location.reload())}>
              <a> <div>{text}</div> </a>
            </div>
          </div>
        </React.Fragment>
        
        ))}

      </List>
      <Divider />
    </Box>
  );


  return (
    <div className='toogle-drawer'>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}><span className='icon-drawer'><MenuIcon /></span></Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}