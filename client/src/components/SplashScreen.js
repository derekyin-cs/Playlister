import Button from '@mui/material/Button';
import AuthContext from '../auth'
import { useContext } from 'react';
export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    function handleGuestLogin() {
        auth.loginUser("GUESTUSER", "GUESTUSER");
    }
    return (
        <div id="splash-screen">
            Playlister
            
            <div id="splash-screen-description">
                Create, share, and explore music playlists.
                </div>

            <div id = "splash-screen-buttons">
                <Button variant="contained" color="primary" href="/register">Sign Up</Button>
                <Button variant="contained" color="primary" href="/login">Log In</Button>
                <Button variant="contained" color="primary" onClick ={handleGuestLogin}>Continue as Guest</Button>

                </div>
        </div>
    )
}