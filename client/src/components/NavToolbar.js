import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
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

    function handleSwitchToHome() {
        store.switchToHome();
    }

    function handleSwitchToCommunity() {
        store.switchToCommunity();
    }

    function handleSwitchToUsers() {
        store.switchToUsers();
    }

    function handleSortByName() {
        store.sortByName();
        handleMenuClose();
    }

    function handleSortByPublishDate() {
        store.sortByPublishDate();
        handleMenuClose();
    }

    function handleSortByListens() {
        store.sortByListens();
        handleMenuClose();
    }

    function handleSortByLikes() {
        store.sortByLikes();
        handleMenuClose();
    }

    function handleSortByDislikes() {
        store.sortByDislikes();
        handleMenuClose();
    }

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
            <MenuItem onClick={handleSortByName}>Name (A - Z)</MenuItem>
            <MenuItem onClick={handleSortByPublishDate}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={handleSortByListens}>Listens (High - Low)</MenuItem>
            <MenuItem onClick={handleSortByLikes}>Likes (High - Low)</MenuItem>
            <MenuItem onClick={handleSortByDislikes}>Dislikes (High - Low)</MenuItem>
            </Menu>
    )

    let homeIcon = <HomeOutlinedIcon />;
    let communityIcon = <GroupsOutlinedIcon />;
    let usersIcon = <PersonOutlineOutlinedIcon />;
    if (store.currentView === "HOME") {
        homeIcon = <HomeIcon />;
    } else if (store.currentView === "COMMUNITY") {
        communityIcon = <GroupsIcon />;
    } else if (store.currentView === "USERS") {
        usersIcon = <PersonIcon />;
    }
    return (
        <div id="nav-toolbar">

            <Grid container spacing = {2}>
                <Grid item xs={2.5}>
                    <Button onClick = {handleSwitchToHome}>
                        {homeIcon}
                    </Button>
                    <Button onClick = {handleSwitchToCommunity}>
                        {communityIcon}
                    </Button>
                    <Button onClick = {handleSwitchToUsers}>
                        {usersIcon}
                    </Button>
                </Grid>

                <Grid item xs={2}>
                    
                </Grid>

                <Grid item xs={3}>
                    <TextField id="nav-toolbar-search" fullWidth placeholder="Search..."  size = "small" variant="outlined" style={{backgroundColor:"white"}} />
                </Grid>

                <Grid item xs={2} />

                <Grid item xs={2}>
                    <Button
                    onClick = {handleMenuOpen}
                    aria-controls={menuId}
                    aria-haspopup="true"
                    >
                        Sort By 
                        <SortOutlinedIcon />
                        
                    </Button>
                </Grid>

            </Grid>
            

            

            

            

            

            {menu}



        </div>
    );

}