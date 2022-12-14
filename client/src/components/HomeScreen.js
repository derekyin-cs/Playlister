import React, { useContext, useEffect} from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import NavToolbar from './NavToolbar.js'
import MediaWrapper from './MediaWrapper.js'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid';

/*
    This React component lists all the top5 lists in the UI.
    
    @author Derek Yin
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    


    useEffect(() => {
        //store.loadIdNamePairs();
        store.switchToCommunity();
    }, []);

    

    // YOUTUBE API HERE
   
    // END YOUTUBE API HERE


    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: '#e6e6e6' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    return (
        <div id="playlist-selector">
            
            <NavToolbar />

            <Grid container spacing ={2}>
                <Grid item xs={7}>
                <div id="list-selector-list">
                    {
                        listCard
                 }
                    <MUIDeleteModal />
                </div>
                </Grid>

                <Grid item xs={5}>
                    <MediaWrapper />
                </Grid>

            </Grid>
            


        </div>)
}

export default HomeScreen;