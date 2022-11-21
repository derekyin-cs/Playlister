import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Button from '@mui/material/Button';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Link } from 'react-router-dom'

export default function NavToolbar() {
    const {store} = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    let menuId = "nav-toolbar-sort-by";
    let menu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            >
            <MenuItem onClick={handleMenuClose}>Name (A - Z)</MenuItem>
            <MenuItem onClick={handleMenuClose}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={handleMenuClose}>Listens (High - Low)</MenuItem>
            <MenuItem onClick={handleMenuClose}>Likes (High - Low)</MenuItem>
            <MenuItem onClick={handleMenuClose}>Dislikes (High - Low)</MenuItem>
            </Menu>
    )
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

            <Button
                onClick = {handleMenuOpen}
                aria-controls={menuId}
                aria-haspopup="true"
            >
                <SortOutlinedIcon />
                Sort By
            </Button>

            {menu}



        </div>
    );

}