import { createSlice } from '@reduxjs/toolkit';

export const cardSlice = createSlice({
    name: 'cards',
    initialState: { 
        kanjiCards: [],
        matchCards: []
    },
    reducers: {
        addKanjiCard: (state, action) => {
            console.log("Action akc: ", action);
            console.log("Adding kanji card: ", action.payload);
            state.kanjiCards.push(action.payload);
        },
        addMatchCard: (state, action) => {
            console.log("Action amc: ", action);
            console.log("Adding match card: ", action.payload);
            state.matchCards.push(action.payload);
        },
        resetKanjiCards: (state, action) => {
            console.log("Resetting kanji cards");
            state.kanjiCards = [];
        },
        resetMatchCards: (state, action) => {
            console.log("Resetting match cards");
            state.matchCards = [];
        },
        removeKanjiCard: (state, action) => {
            let array = [];
            for (let card of state.kanjiCards) {
                if (card != action.payload) {
                    array.push(card);
                }
            }
            state.kanjiCards = array;
        },
        removeMatchCard: (state, action) => {
            let array = [];
            for (let card of state.matchCards) {
                if (card != action.payload) {
                    array.push(card);
                }
            }
            state.matchCards = array;
        }
    }
});

export const { addKanjiCard, addMatchCard, resetKanjiCards, resetMatchCards, removeKanjiCard, removeMatchCard } = cardSlice.actions;
export default cardSlice.reducer;