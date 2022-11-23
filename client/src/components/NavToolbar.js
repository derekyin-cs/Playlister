import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Button from '@mui/material/Button';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';
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

            <Grid container spacing = {2}>
                <Grid item xs={3}>
                    <Button>
                        <HomeOutlinedIcon />
                    </Button>
                    <Button>
                        <GroupsOutlinedIcon />
                    </Button>
                    <Button>
                        <PersonOutlineOutlinedIcon />
                    </Button>
                </Grid>

                <Grid item xs={1.5}>
                    
                </Grid>

                <Grid item xs={2.5}>
                    <div id = "nav-toolbar-search">
                        <input type="text" placeholder="Search" />
                    </div>
                </Grid>

                <Grid item xs={3} />

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