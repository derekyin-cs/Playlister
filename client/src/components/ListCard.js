/** 
 * TO DO 
 * USE MUI GRID TO FORMAT LIST CARD
 * CSS TO ROUND CORNERS
 * CHANGE BACKGROUND COLOR
 * LIKE, DISLIKE ICONS
 * AUTHOR TEXT
 */

import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import WorkspaceScreen from './WorkspaceScreen';
import EditToolbar from './EditToolbar';
import AuthContext from '../auth'
/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    const { auth } = useContext(AuthContext);

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleToggleEdit(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!idNamePair.published){
            toggleEdit();
        }
        
        
        
    }

    function handleLikeList(event, id){
        store.likeList(id);
    }

    function handleDislikeList(event, id){
        store.dislikeList(id);
    }

    function handlePublishList(event) {
        event.stopPropagation();
        store.publishCurrentList();
    }
        

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleDropDown (event) {
        event.stopPropagation();
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    const handleCloseList = (event) => {
        event.stopPropagation();
        store.closeCurrentList();
    }

    function handleDuplicateList(event) {
        event.stopPropagation();
        store.duplicateList();
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let dropDownButton = (
        <Button 
            onClick = {(event) => {
            handleLoadList(event, idNamePair._id)
            }} 
        >
            <KeyboardDoubleArrowDownOutlinedIcon   />
        </Button>
        );

    let workspace = "";
    let workspaceToolbar = "";
    if (store.currentList && store.currentList._id === idNamePair._id) {
        workspace = (
            <WorkspaceScreen />
            );
        workspaceToolbar = (
            <Grid container spacing={2}>
                <Grid item>
                    <EditToolbar />
                </Grid>
                <Grid item>
                    <Button 
                        variant="contained"
                        onClick = {handlePublishList}
                        disabled = {store.currentList.published}
                    >
                        Publish
                    </Button>
                    <Button variant="contained"
                        onClick={(event) => {
                            handleDeleteList(event, idNamePair._id)
                        }}
                        disabled = {idNamePair.username !== auth.user.username }
                    >
                        Delete
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleDuplicateList}
                        disabled = {auth.user.email === "GUESTUSER"}
                    >
                        Duplicate
                    </Button>
                </Grid>
                <Grid item xs={10} />
                <Grid item xs={2}>
                    <Button onClick = {handleCloseList}>
                        <KeyboardDoubleArrowUpOutlinedIcon  />
                    </Button>
                </Grid>
            </Grid>
        );
        dropDownButton = "";
    }


    let published = "";
    let listens = "";
    let likeButton = "";
    let dislikeButton = "";
    let likeIcon = <ThumbUpAltOutlinedIcon />;
    let dislikeIcon = <ThumbDownAltOutlinedIcon />;

    if (idNamePair.likes.includes(auth.user.email)){
        likeIcon = <ThumbUpAltIcon />;
    }

    if (idNamePair.dislikes.includes(auth.user.email)){
        dislikeIcon = <ThumbDownAltIcon />;
    }

    let likes = "";
    let dislikes = "";
    if (idNamePair.published) {
        let date = new Date(idNamePair.publishedDate).toLocaleDateString('en-us', {year:"numeric", month:"short", day:"numeric"});
        published = "Published: " + date;
        listens = "Listens: " + idNamePair.listens;
        likeButton = (
        <Button 
            onClick = {(event) => {
            handleLikeList(event, idNamePair._id)
            }}
            disabled = {auth.user.email === "GUESTUSER"}
            >
                {likeIcon}
                {idNamePair.likes.length}
                </Button>
                );
        dislikeButton = (<Button 
            onClick = {(event) => {
            handleDislikeList(event, idNamePair._id)
            }}
            disabled = {auth.user.email === "GUESTUSER"}
            >
                {dislikeIcon}
                {idNamePair.dislikes.length}
                </Button>);
        // TODO: ADD LIKE, DISLIKE STATS 
    }

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%', fontSize: '20pt', backgroundColor: '#f5f5f5', borderRadius: '10px', border: '3px solid #e0e0e0' }}
            
        >
            <Box sx={{ p: 1, flexGrow: 1, overflowX: 'auto' }}>
                <Grid container spacing = {.3} >
                    <Grid item xs={8} fontWeight="bold" onDoubleClick={handleToggleEdit}>
                        {idNamePair.name}
                    </Grid>
                    <Grid item xs={4}>
                        {likeButton}
                        {dislikeButton}
                        
                    </Grid>
                    <Grid item xs={12} fontSize = {14}>
                        By: {idNamePair.username}
                    </Grid>
                    <Grid item xs={2} fontSize={14}>
                        {published}
                    </Grid>
                    <Grid item xs={6} />
                    <Grid item xs={2} fontSize={14} >
                        {listens}
                    </Grid>
                    <Grid item xs={2} >
                        {dropDownButton}
                    </Grid>
                </Grid>

                {workspace}
                {workspaceToolbar}
                
            </Box>



           
            
            
            
            
        </ListItem>
/**
<Box sx={{ p: 1 }}>
                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                    <EditIcon style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>
 */
    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;