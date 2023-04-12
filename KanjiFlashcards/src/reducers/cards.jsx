import { createSlice } from '@reduxjs/toolkit';

export const cardSlice = createSlice({
    name: 'cards',
    initialState: { 
        inplay: []
    },
    reducers: {
        handleCardsInPlay: (state, action) => {
            // Flush inplay if needed and push all kanji and their match to the list of cards in play
            if (state.inplay.length > 0) {
                state.inplay = [];
            }
            for (let i = 0; i < action.payload.kanji.length; i++) {
                state.inplay.push(action.payload.kanji[i]);
                state.inplay.push(action.payload.match[i]);
            }
        },
        removeIndeces: (state, action) => {
            // Remove indeces i0 and i1 from the list of in play cards
            state.inplay.splice(action.payload.i0, 1);
            state.inplay.splice(action.payload.i1 - 1, 1);
        },
    }
});

export const { handleCardsInPlay, removeIndeces } = cardSlice.actions;
export default cardSlice.reducer;