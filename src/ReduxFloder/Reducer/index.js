import {combineReducers} from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import usernames from './usernames';
import Data from './Data';
import Id from './Id';
import Db from './Db';

const persistConfig = {
    key:'root',
    storage:AsyncStorage,
    whitelist:['usernames']
}
const allReducers = combineReducers({
    // ALL REDUCERS 
    usernames:usernames,
    Data:Data,
    Id:Id,
    Db,Db
})

export default persistReducer(persistConfig, allReducers);