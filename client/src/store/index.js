import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    SWITCH_TO_PLAYER: "SWITCH_TO_PLAYER",
    SWITCH_TO_COMMENTS: "SWITCH_TO_COMMENTS",
    ADD_COMMENT: "ADD_COMMENT",
    SWITCH_TO_HOME: "SWITCH_TO_HOME",
    SWITCH_TO_COMMUNITY: "SWITCH_TO_COMMUNITY",
    SWITCH_TO_USERS: "SWITCH_TO_USERS",
    SORT_BY_NAME: "SORT_BY_NAME",
    SORT_BY_PUBLISH_DATE: "SORT_BY_PUBLISH_DATE",
    SORT_BY_LISTENS: "SORT_BY_LISTENS",
    SORT_BY_LIKES: "SORT_BY_LIKES",
    SORT_BY_DISLIKES: "SORT_BY_DISLIKES"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

const CurrentMedia = {
    PLAYER : "PLAYER",
    COMMENTS : "COMMENTS"
}

const CurrentView = {
    HOME : "HOME",
    COMMUNITY : "COMMUNITY",
    USERS : "USERS"
}

const CurrentSort = {
    NONE: "NONE",
    NAME: "NAME",
    PUBLISH_DATE: "PUBLISH_DATE",
    LISTENS: "LISTENS",
    LIKES: "LIKES",
    DISLIKES: "DISLIKES"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {

     // HANDLE KEY PRESSES. UNDO IF CTRL+Z, REDO IF CTRL+Y
     const handleKeyPress = useCallback((event) => {
        if (event.ctrlKey) {
            if (event.key === 'z') {
                store.undo()
            }
            if (event.key === 'y') {
                store.redo()
            }
        }
    }, []);

    useEffect(() => {
        // ATTACH THE EVENT LISTENER
        document.addEventListener('keydown', handleKeyPress);

        // REMOVE THE EVENT LISTENER
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);


    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        currentMedia: CurrentMedia.PLAYER,
        currentView: CurrentView.COMMUNITY,
        currentSort: CurrentSort.NONE,
        playingSongIndex: -1,
        playingSong: null,
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        console.log(type);
        console.log(payload);
        console.log(store.currentModal);
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: store.currentSort,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: store.currentSort,
                    playingSongIndex: -1,
                    playingSong: null,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: CurrentView.HOME,
                    currentSort: store.currentSort,
                    playingSongIndex: -1,
                    playingSong: null,
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: store.currentSort,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: store.currentSort,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: store.currentSort,
                    playingSongIndex: 0,
                    playingSong: payload.songs[0],
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: store.currentSort,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: store.currentSort,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: store.currentSort,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: store.currentSort,
                    playingSongIndex: 0,
                    playingSong: store.currentList.songs[0],
                });
            }
            case GlobalStoreActionType.SWITCH_TO_PLAYER: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: CurrentMedia.PLAYER,
                    currentView: store.currentView,
                    currentSort: store.currentSort,
                    playingSongIndex: store.playingSongIndex,
                    playingSong: store.playingSong,
                });
            }
            case GlobalStoreActionType.SWITCH_TO_COMMENTS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: CurrentMedia.COMMENTS,
                    currentView: store.currentView,
                    currentSort: store.currentSort,
                    playingSongIndex: store.playingSongIndex,
                    playingSong: store.playingSong,
                });
            }
            case GlobalStoreActionType.SWITCH_TO_HOME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: CurrentView.HOME,
                    currentSort: CurrentSort.NONE,
                    playingSongIndex: -1,
                    playingSong: null,
                    
                });
            }
            case GlobalStoreActionType.SWITCH_TO_COMMUNITY: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: CurrentView.COMMUNITY,
                    currentSort: CurrentSort.NONE,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }
            case GlobalStoreActionType.SWITCH_TO_USERS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: CurrentView.USERS,
                    currentSort: CurrentSort.NONE,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }
            case GlobalStoreActionType.SORT_BY_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: CurrentSort.NAME,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }
            case GlobalStoreActionType.SORT_BY_PUBLISH_DATE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: CurrentSort.PUBLISH_DATE,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }
            case GlobalStoreActionType.SORT_BY_LISTENS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: CurrentSort.LISTENS,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }
            case GlobalStoreActionType.SORT_BY_LIKES: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: CurrentSort.LIKES,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }
            case GlobalStoreActionType.SORT_BY_DISLIKES: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: CurrentSort.DISLIKES,
                    playingSongIndex: -1,
                    playingSong: null,
                });
            }

            case GlobalStoreActionType.SET_CURRENT_SONG: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentMedia: store.currentMedia,
                    currentView: store.currentView,
                    currentSort: store.currentSort,
                    playingSongIndex: payload,
                    playingSong: store.currentList.songs[payload],
                });
            }

            

            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        const response = await api.createPlaylist(newListName, [], auth.user.email, auth.user.username);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
            history.push("/");
            store.loadIdNamePairs();

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            //history.push("/playlist/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.duplicateList = async function () {
        let newListName = "Copy of " + store.currentList.name + " " + (store.newListCounter + 1);
        let newListSongs = store.currentList.songs; 
        const response = await api.createPlaylist(newListName, newListSongs, auth.user.email, auth.user.username);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
            history.push("/");
            store.loadIdNamePairs();

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            //history.push("/playlist/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                if (store.currentSort === CurrentSort.NAME) {
                    pairsArray.sort((a, b) => (a.name > b.name) ? 1 : -1);
                }
                else if (store.currentSort === CurrentSort.PUBLISH_DATE) {
                    pairsArray.sort((a, b) => (a.date > b.date) ? 1 : -1);
                }
                else if (store.currentSort === CurrentSort.LISTENS) {
                    pairsArray.sort((a, b) => (a.listens > b.listens) ? 1 : -1);
                }
                else if (store.currentSort === CurrentSort.LIKES) {
                    pairsArray.sort((a, b) => (a.likes > b.likes) ? 1 : -1);
                }
                else if (store.currentSort === CurrentSort.DISLIKES) {
                    pairsArray.sort((a, b) => (a.dislikes > b.dislikes) ? 1 : -1);
                }
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadIdNamePairs();
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        if (store.currentView === "HOME"){
            store.loadIdNamePairs();
        }
        else if (store.currentView === "COMMUNITY"){
            store.switchToCommunity();
        }
        else {
            store.switchToUsers();
        }
        
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    //history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "?");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        if (store.currentModal === CurrentModal.NONE)
            tps.undoTransaction();
    }
    store.redo = function () {
        if (store.currentModal === CurrentModal.NONE)
            tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return ((store.currentList !== null) && store.currentModal === CurrentModal.NONE);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo() && store.currentModal === CurrentModal.NONE);
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo() && store.currentModal === CurrentModal.NONE);
    }
    store.canClose = function() {
        return ((store.currentList !== null) && store.currentModal === CurrentModal.NONE);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.switchToPlayer = () => {
        storeReducer({
            type: GlobalStoreActionType.SWITCH_TO_PLAYER,
            payload: {}
        });    
    }

    store.switchToComments = () => {
        storeReducer({
            type: GlobalStoreActionType.SWITCH_TO_COMMENTS,
            payload: {}
        });    
    }

    store.addComment = (comment) => {
        let list = store.currentList;
        list.comments.push(comment);
        store.updateCurrentList();
    }

    store.publishCurrentList = () => {
        let list = store.currentList;
        list.published = true;
        let d = new Date();
        list.publishedDate = d;
        list.listens = 0;
        store.updateCurrentList();
    }

    store.switchToHome = () => {
        async function asyncLoadHomeIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.SWITCH_TO_HOME,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadHomeIdNamePairs();
    }

    store.switchToCommunity = () => {
        async function asyncLoadCommunityIdNamePairs() {
            const response = await api.getPublishedPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                // if (store.currentSort === CurrentSort.NAME) {
                //     pairsArray.sort((a, b) => (a.name > b.name) ? 1 : -1);
                // }
                // else if (store.currentSort === CurrentSort.PUBLISH_DATE) {
                //     pairsArray.sort((a, b) => (a.date > b.date) ? 1 : -1);
                // }
                // else if (store.currentSort === CurrentSort.LISTENS) {
                //     pairsArray.sort((a, b) => (a.listens > b.listens) ? 1 : -1);
                // }
                // else if (store.currentSort === CurrentSort.LIKES) {
                //     pairsArray.sort((a, b) => (a.likes > b.likes) ? 1 : -1);
                // }
                // else if (store.currentSort === CurrentSort.DISLIKES) {
                //     pairsArray.sort((a, b) => (a.dislikes > b.dislikes) ? 1 : -1);
                // }
                storeReducer({
                    type: GlobalStoreActionType.SWITCH_TO_COMMUNITY,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadCommunityIdNamePairs();
    }

    store.switchToUsers = () => {
        storeReducer({
            type: GlobalStoreActionType.SWITCH_TO_USERS,
            payload: []
        });
        // async function asyncLoadUsersIdNamePairs() {
        //     const response = await api.getPublishedPlaylistPairs();
        //     if (response.data.success) {
        //         let pairsArray = response.data.idNamePairs;
        //         storeReducer({
        //             type: GlobalStoreActionType.SWITCH_TO_USERS,
        //             payload: []
        //         });
        //     }
        //     else {
        //         console.log("API FAILED TO GET THE LIST PAIRS");
        //     }
        // }
        // asyncLoadUsersIdNamePairs();
    }

    store.likeList = function (id) {
        async function asyncLikeList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (playlist.dislikes.includes(auth.user.email)) {
                    playlist.dislikes.splice(playlist.dislikes.indexOf(auth.user.email), 1);
                    playlist.likes.push(auth.user.email);
                }
                else if (!playlist.likes.includes(auth.user.email)) {
                    playlist.likes.push(auth.user.email );
                }
                else if (playlist.likes.includes(auth.user.email)) {
                    playlist.likes.splice(playlist.likes.indexOf(auth.user.email), 1);
                }
                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    console.log("SUCCESSFULLY LIKED LIST");
                    //history.push("/playlist/" + playlist._id);
                    if (store.currentView === CurrentView.HOME) {
                        store.loadIdNamePairs();
                    }
                    else if (store.currentView === CurrentView.COMMUNITY) {
                        store.switchToCommunity();
                    }
                    else {
                        store.switchToUsers();
                    }


                }
                else {
                    console.log("FAILED TO LIKE LIST");
                }
            }
        }
        asyncLikeList(id);
        // handle USERS OR COMMUNITY IN A SWITCH STATEMENT
        history.push("/");
       
        
    }

    store.dislikeList = function (id) {
        async function asyncDislikeList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (playlist.likes.includes(auth.user.email)) {
                    playlist.likes.splice(playlist.likes.indexOf(auth.user.email), 1);
                    playlist.dislikes.push(auth.user.email);
                }
                else if (!playlist.dislikes.includes(auth.user.email)) {
                    playlist.dislikes.push(auth.user.email );
                }
                else if (playlist.dislikes.includes(auth.user.email)) {
                    playlist.dislikes.splice(playlist.dislikes.indexOf(auth.user.email), 1);
                }
                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    console.log("SUCCESSFULLY LIKED LIST");
                    //history.push("/playlist/" + playlist._id);
                    if (store.currentView === CurrentView.HOME) {
                        store.loadIdNamePairs();
                    }
                    else if (store.currentView === CurrentView.COMMUNITY) {
                        store.switchToCommunity();
                    }
                    else {
                        store.switchToUsers();
                    }
                }
                else {
                    console.log("FAILED TO LIKE LIST");
                }
            }
        }
        asyncDislikeList(id);
        // handle USERS OR COMMUNITY IN A SWITCH STATEMENT
        history.push("/");
       
        
    }

    store.sortByName = function () {
        let pairsArray = store.idNamePairs;
                pairsArray.sort((a, b) => (a.name > b.name) ? 1 : -1);
                storeReducer({
                    type: GlobalStoreActionType.SORT_BY_NAME,
                    payload: pairsArray
                });
    }

    store.sortByPublishDate = function () {
        let pairsArray = store.idNamePairs;
                pairsArray.sort((a, b) => (a.publishedDate < b.publishedDate) ? 1 : -1);
                storeReducer({
                    type: GlobalStoreActionType.SORT_BY_PUBLISH_DATE,
                    payload: pairsArray
                });
    }

    store.sortByListens = function () {
        let pairsArray = store.idNamePairs;
                pairsArray.sort((a, b) => (a.listens < b.listens) ? 1 : -1);
                storeReducer({
                    type: GlobalStoreActionType.SORT_BY_LISTENS,
                    payload: pairsArray
                });
    }

    store.sortByLikes = function () {
        let pairsArray = store.idNamePairs;
                pairsArray.sort((a, b) => (a.likes.length < b.likes.length) ? 1 : -1);
                storeReducer({
                    type: GlobalStoreActionType.SORT_BY_LIKES,
                    payload: pairsArray
                });
    }

    store.sortByDislikes = function () {
        let pairsArray = store.idNamePairs;
                pairsArray.sort((a, b) => (a.dislikes.length < b.dislikes.length) ? 1 : -1);
                storeReducer({
                    type: GlobalStoreActionType.SORT_BY_DISLIKES,
                    payload: pairsArray
                });
    }

    store.searchByPlaylist = (search) => {
        let pairsArray = store.idNamePairs;
        let searchArray = [];
        for (let i = 0; i < pairsArray.length; i++) {
            if (pairsArray[i].name.toLowerCase().includes(search.toLowerCase())) {
                searchArray.push(pairsArray[i]);
            }
        }
        storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: searchArray
        });
    }

    store.searchByUser = (search) => {
        async function asyncSearchByUser() {
            const response = await api.getPublishedPlaylistPairs();
            if (response.data.success && search !== "") {
                let pairsArray = response.data.idNamePairs;
                let searchArray = [];
                for (let i = 0; i < pairsArray.length; i++) {
                    if (pairsArray[i].username.toLowerCase().includes(search.toLowerCase())) {
                        searchArray.push(pairsArray[i]);
                    }
                }
                storeReducer({
                    type: GlobalStoreActionType.SWITCH_TO_USERS,
                    payload: searchArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncSearchByUser();
        // let pairsArray = store.idNamePairs;
        // let searchArray = [];
        // for (let i = 0; i < pairsArray.length; i++) {
        //     if (pairsArray[i].username.toLowerCase().includes(search.toLowerCase())) {
        //         searchArray.push(pairsArray[i]);
        //     }
        // }
        // storeReducer({
        //     type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
        //     payload: searchArray
        // });
    }

    store.setNextSong = function () {
        let index = store.playingSongIndex;
        if (index < store.currentList.songs.length - 1) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_SONG,
                payload: index + 1
            });
        }
        else {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_SONG,
                payload: 0
            });
        }
    }

    store.setPreviousSong = function () {
        let index = store.playingSongIndex;
        if (index > 0) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_SONG,
                payload: index - 1
            });
        }
        else {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_SONG,
                payload: store.currentList.songs.length - 1
            });
        }
    }

    store.incrementCurrentListens = function () {
        let list = store.currentList;
        list.listens++;
        store.updateCurrentList();
        history.push("/");
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };