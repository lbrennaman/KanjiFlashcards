import { configureStore } from '@reduxjs/toolkit';
import kanjiReducer from './reducers/kanjiList';
import cardReducer from './reducers/cards';
import coordinatesReducer from './reducers/coordinates';

const store = configureStore({
    reducer: {
        kanji: kanjiReducer,
        cards: cardReducer,
        coordinate: coordinatesReducer
    }
});

export default store;