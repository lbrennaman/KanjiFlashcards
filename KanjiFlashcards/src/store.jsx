import { configureStore } from '@reduxjs/toolkit';
import kanjiReducer from './reducer';

const store = configureStore({
    reducer: {
        cards: kanjiReducer
    }
});

export default store;