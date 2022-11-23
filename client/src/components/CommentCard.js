import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function CommentCard(props) {
    const { username, comment, selected } = props;
    
    let commentCard = "";


    return (
        <ListItem
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%', fontSize: '20pt', backgroundColor: '#f5f5f5', borderRadius: '10px', border: '3px solid #e0e0e0'}}
        >
            <Typography display="block">{username}</Typography>
            <Typography display = "block">{comment}</Typography>
        </ListItem>
    );
}
export default CommentCard;