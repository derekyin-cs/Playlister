import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { GlobalStoreContext } from '../store/index.js'
import { useContext } from 'react';
export default function MediaWrapper() {
    const { store } = useContext(GlobalStoreContext);


    function handleSwitchPlayer() {
        // TODO
        store.switchToPlayer();
    }

    function handleSwitchComments() {
        store.switchToComments();
    }
    // conditionally render player or comments based on which tab is pressed
    // state variable for which tab is pressed

    // box for comment section
    // box for player
    let media = "";

    if (store.currentMedia == "COMMENTS") {
        media = (
            <Box sx={{ bgcolor: 'lightgray', p: 2, flexGrow: 1, borderRadius: '20px', border: '2px solid black'}}>
                <div id = "media-comments-list">

                </div>
            </Box>
        )
    }

    else if (store.currentMedia == "PLAYER") {
        media = "";
        //TODO: IMPLEMENT YOUTUBE API
    }
    
    let playerButtonColor = "blue";
    let commentsButtonColor = "blue";
    if (store.currentMedia === "PLAYER") {
        playerButtonColor = "darkblue";
    }
    else {
        commentsButtonColor = "darkblue";
    }


    return (
        // two side by side buttons, one named player and one named comments


        // player button
        <div id="media-wrapper">

            <div id = "media-wrapper-tabs">
                <Button variant="contained" style ={{backgroundColor:playerButtonColor}} onClick={handleSwitchPlayer}>Player</Button>
                <Button variant="contained" style ={{backgroundColor:commentsButtonColor}} onClick = {handleSwitchComments}>Comments</Button>
            </div>



            {media}
            

        </div>

    );
}