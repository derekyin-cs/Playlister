import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { GlobalStoreContext } from '../store/index.js'
import { useContext } from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import CommentCard from './CommentCard.js';
import AuthContext from '../auth';
// import auth

export default function MediaWrapper() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);


    function handleSwitchPlayer() {
        // TODO
        store.switchToPlayer();
    }

    function handleSwitchComments() {
        store.switchToComments();
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let username = auth.user.firstName + " " + auth.user.lastName;
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
    let commentBar = "";
    let commentCard = "";

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
        commentBar = (
            <TextField 
                id="media-add-comment" 
                placeholder="Add comment" 
                variant="outlined" 
                onKeyPress={handleKeyPress} 
                />
        );
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
        <Box id="media-wrapper">

            <div id = "media-wrapper-tabs">
                <Button variant="contained" style ={{backgroundColor:playerButtonColor}} onClick={handleSwitchPlayer}>Player</Button>
                <Button variant="contained" style ={{backgroundColor:commentsButtonColor}} onClick = {handleSwitchComments}>Comments</Button>
            </div>



            {media}
            {commentBar}
            
            

        </Box>

    );
}