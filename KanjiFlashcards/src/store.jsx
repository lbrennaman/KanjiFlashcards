import { configureStore } from '@reduxjs/toolkit';
import kanjiReducer from './reducers/kanjiList';
import cardReducer from './reducers/cards';

const store = configureStore({
    reducer: {
        kanji: kanjiReducer,
        cards: cardReducer
    }
});

export default store;