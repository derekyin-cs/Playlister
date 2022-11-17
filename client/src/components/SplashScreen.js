import Button from '@mui/material/Button';
export default function SplashScreen() {
    return (
        <div id="splash-screen">
            Playlister
            
            <div id="splash-screen-description">
                Create, share, and explore music playlists.
                </div>

            <div id = "splash-screen-buttons">
                <Button variant="contained" color="primary" href="/register">Sign Up</Button>
                <Button variant="contained" color="primary" href="/login">Log In</Button>
                <Button variant="contained" color="primary" href="/">Continue as Guest</Button>

                </div>
        </div>
    )
}