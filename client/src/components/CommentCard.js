function CommentCard(props) {
    const { username, comment, selected } = props;
    let commentCard = "";
    
    return (
        <div className="comment-card">
            <div className="comment-card-username">
                {username}
            </div>
            <div className="comment-card-comment">
                {comment}
            </div>
        </div>
    );
}
export default CommentCard;