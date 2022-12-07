import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import { GlobalStoreContext } from '../store/index.js'
import AuthContext from '../auth/index.js';
import Typography from '@mui/material/Typography';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    store.history = useHistory();
    
    function handleCloseModal(event) {
        auth.logoutUser();
    }

    let errorMessage = "";
    let modalJSX = "";
    if (auth.user === null) {
        errorMessage = "User not found, log in again";
    }
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    let songListColor = "black";


    let songList = "";
    if (store.currentList) {
        if (!store.currentList.published){
            songList = <List 
            id="playlist-cards" 
            sx={{ width: '100%', bgcolor: 'background.paper'}}
        >
            {
                store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))  
                
            }
         </List>;
        }
        else {
            songList = <List 
            id="playlist-cards" 
            sx={{ width: '100%', bgcolor: 'background.paper'}}
            >
            {
                store.currentList.songs.map((song, index) => (
                    <Typography sx={store.currentSongIndex === index ? {color: 'blue', fontWeight: 'bold'} : {color: 'black'}}>{index+1 + ". " + song.title + " by " + song.artist}</Typography>
                ))  
                
            }
            </List>;
            // display songs as a list
            
        }
        // if (auth.user)  {
        // if (auth.user.email !== store.currentList.ownerEmail) {
        //     errorMessage = "User does not own this playlist";
        // }   
        // }          
    }
    let errorModal = "";
    if (errorMessage !== "") {
        errorModal = <Modal
            open={errorMessage !== ""}
        >
            <Stack sx={{ width: '40%', marginLeft: '30%', marginTop: '20%' }} spacing={2}>
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                    <Button color="primary" size="small" onClick={handleCloseModal}>
                            Close
                    </Button>
                </Alert>
            </Stack>
        </Modal>
    }



    return (
        <Box style={{maxHeight: '83%', overflow: 'auto'}}>
         { songList }
         { modalJSX }
         { errorModal }
         </Box>
    )
}

export default WorkspaceScreen;