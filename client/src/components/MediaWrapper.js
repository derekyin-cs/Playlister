import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { GlobalStoreContext } from '../store/index.js'
import { useContext } from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import CommentCard from './CommentCard.js';
import AuthContext from '../auth';
import Grid from '@mui/material/Grid';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import YouTube from 'react-youtube';
import { useState } from 'react';
// import auth

export default function MediaWrapper() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [player, setPlayer] = useState(null);


    function handleSwitchPlayer() {
        // TODO
        store.switchToPlayer();
    }

    function handleSwitchComments() {
        store.switchToComments();
    }

    function handleFastRewind() {
        store.setPreviousSong();
    }

    function handlePlay() {
        player.playVideo();
        store.playSong();
    }

    function handlePause() {
        player.pauseVideo();
        store.pauseSong();
    }

    function handleFastForward() {
        store.setNextSong();
    }

    function videoOnReady(event) {
        setPlayer(event.target);
    }



    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let username = auth.user.username;
            let comment = {username: username, comment: event.target.value};
            console.log(comment);
            event.target.value = "";
            store.addComment(comment);
        }
    }
    // conditionally render player or comments based on which tab is pressed
    // state variable for which tab is pressed

    // box for comment section
    // box for player
    let media = "";
    let mediaBar = "";
    let commentCard = "";
    let currentListTitle = "";
    let songNumber = "";
    let songTitle = "";
    let songArtist = "";

    let currentSongId = "";

    
    if (store.currentList){
        currentListTitle = store.currentList.name;
    }

    if (store.currentSong){
        currentSongId = store.currentSong.youTubeId;
    }


    // if (store.currentList){
    //     if (store.currentList.currentSong){
    //         if (store.currentList.currentSong.youTubeId){
    //             media = (
    //                 <Box sx={{ width: '100%' }}>
    //                     <iframe
    //                         width="560"
    //                         height="315"
    //                         src={`https://www.youtube.com/embed/${store.currentList.currentSong.youTubeId}`}
    //                         title="YouTube video player"
    //                         frameBorder="0"
    //                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    //                         allowFullScreen
    //                     />
    //                 </Box>
    //             )
    //         }
    //     }
    // }

    if (store.currentList && store.currentMedia == "COMMENTS" && store.currentList.comments.length > 0) {
        commentCard = 
        <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
        {
            store.currentList.comments.map((comments) => (
                <CommentCard
                    username={comments.username}
                    comment={comments.comment}
                    selected={false}
                />
            ))
        }
        </List>;
    }
    if (store.currentMedia == "COMMENTS") {
        media = (
            <Box sx={{ bgcolor: 'lightgray', p: 2, flexGrow: 1, borderRadius: '20px', border: '2px solid black', overflowY: "scroll", flexDirection: "column-reverse" }}>
                {commentCard}
            </Box>
            
        );
        mediaBar = (
            <TextField 
                id="media-add-comment" 
                placeholder="Add comment" 
                variant="outlined" 
                onKeyPress={handleKeyPress} 
                />
        );
    }

    else if (store.currentMedia == "PLAYER") {
        media = 
        <Box sx={{ bgcolor: 'lightgray', p: 2, flexGrow: 1, borderRadius: '20px', border: '2px solid black'}}>
        <YouTube id = "player" videoId = {currentSongId} opts={{height: '230', width: '520'}} onReady={videoOnReady}/>
        </Box>
        //TODO: IMPLEMENT YOUTUBE API

        mediaBar = <Box sx={{ bgcolor: 'primary', p: 2, borderRadius: '20px', border: '2px solid black', height: '23%'}}>
            <Grid container spacing={.1}>
                <Grid item xs={12}>
                Playlist: {currentListTitle}
                </Grid>
                <Grid item xs={12}>
                Song #: {songNumber}
                </Grid>
                <Grid item xs={12}>
                Title: {songTitle}
                </Grid>
                <Grid item xs={12}>
                Artist: {songArtist}
                </Grid>
                
                <Grid item xs = {3}/>
                <Grid item xs={6}>
                <div id="player-toolbar" >
                <Button 
                    id='rewind-button'
                    onClick={handleFastRewind}
                    variant="contained">
                        <FastRewindIcon />
                </Button>
                <Button 
                    id='stop-button'
                    onClick={handlePause}
                    variant="contained">
                        <StopIcon />
                </Button>
                <Button
                    id='play-button'
                    onClick={handlePlay}
                    variant="contained">
                    <PlayArrowIcon />
                </Button>
                <Button
                    id='forward-button'
                    onClick={handleFastForward}
                    variant="contained">
                    <FastForwardIcon />
                </Button>
                </div>
                </Grid>
                <Grid item xs = {3}/>
            </Grid>

            


        </Box>
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
        <Box id="media-wrapper">

            <div id = "media-wrapper-tabs">
                <Button variant="contained" style ={{backgroundColor:playerButtonColor}} onClick={handleSwitchPlayer}>Player</Button>
                <Button variant="contained" style ={{backgroundColor:commentsButtonColor}} onClick = {handleSwitchComments}>Comments</Button>
            </div>



            {media}
            {mediaBar}
            
            

        </Box>

    );
}