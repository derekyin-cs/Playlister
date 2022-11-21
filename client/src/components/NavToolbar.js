import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Button from '@mui/material/Button';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
export default function NavToolbar() {
    const {store} = useContext(GlobalStoreContext);

    return (
        <div id="nav-toolbar">
            <Button>
                <HomeOutlinedIcon />
            </Button>

            <Button>
                <GroupsOutlinedIcon />
            </Button>

            <Button>
                <PersonOutlineOutlinedIcon />
            </Button>

            <div id = "nav-toolbar-search">
                <input type="text" placeholder="Search" />
            </div>

            <Button>
                <SortOutlinedIcon />
                Sort By
            </Button>



        </div>
    );

}