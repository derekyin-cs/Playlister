import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
export default function MediaWrapper() {


    // conditionally render player or comments based on which tab is pressed
    // state variable for which tab is pressed

    // box for comment section
    // box for player
    let comments = "";

    if (true) {
        comments = (
            <Box sx={{ bgcolor: 'background.paper', p: 2, flexGrow: 1 }}>
                <Typography variant="h5" component="div" gutterBottom>
                    Comments
                </Typography>
                <Typography variant="body1">
                    Comments go here
                </Typography>
            </Box>
        )
    } 


    return (
        // two side by side buttons, one named player and one named comments


        // player button
        <div id="media-wrapper">

            <div id = "media-wrapper-tabs">
                <Button variant="contained" color="primary">Player</Button>
                <Button variant="contained" color="primary">Comments</Button>
            </div>

            {comments}
            

        </div>

    );
}