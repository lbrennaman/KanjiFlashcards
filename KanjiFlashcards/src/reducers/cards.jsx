import { createSlice } from '@reduxjs/toolkit';

export const cardSlice = createSlice({
    name: 'cards',
    initialState: { 
        inplay: [],
        reset: true,
        response: false
    },
    reducers: {
        handleCardsInPlay: (state, action) => {
            console.log("Handling cards in play!");
            if (state.reset === true) {
                if (state.inplay.length > 0) {
                    state.inplay = [];
                }
                for (let i = 0; i < action.payload.kanji.length; i++) {
                    state.inplay.push(action.payload.kanji[i]);
                    state.inplay.push(action.payload.match[i]);
                }
                state.reset = false;
                state.response = true;
            } else {
                if (state.inplay.length == 0 && state.response === true) {
                    state.response = confirm("Set completed! Reset flashcards?");
                }
            }
            console.log("Logging elements: \n-------------------");
            for (let element of state.inplay) {
                console.log("Element: ", element);
            }
            console.log();
        },
        removeIndeces: (state, action) => {
            state.inplay.splice(action.payload.i0, 1);
            state.inplay.splice(action.payload.i1 - 1, 1);
        },
        forceReset: (state) => {
            state.reset = true;
        }
    }
});

export const { handleCardsInPlay, removeIndeces, forceReset } = cardSlice.actions;
export default cardSlice.reducer;