import Typography from '@mui/material/Typography';
export default function MediaWrapper() {

    return (
        // two side by side buttons, one named player and one named comments


        // player button
        <div id="media-wrapper">
            <div id="media-wrapper-player">
                <div id="media-wrapper-player-heading">
                    <Typography variant="h2">Player</Typography>
                </div>
                <div id="media-wrapper-player-body">
                    placeholder
                </div>
            </div>
                <div id="media-wrapper-comments-heading">
                    <Typography variant="h2">Comments</Typography>
                </div>

            <div id="media-wrapper-comments">
                <div id="media-wrapper-comments-body">
                    placeholder
                </div>
            </div>

        </div>

    );
}