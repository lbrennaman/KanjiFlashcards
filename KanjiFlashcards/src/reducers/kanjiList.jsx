import { createSlice } from '@reduxjs/toolkit';

export const kanjiSlice = createSlice({
    name: 'kanji',
    initialState: { 
        size: 1,
        kanjiList: ["我", "A", "B"],
        matchList: ["がのわとわれとわが", "A", "B"],
        romanjiList: ["ga の wa と ware と waga"],
        definitionList: ["I, me"],
        drag: null
    },
    reducers: {
        randomize: (state) => {
            // Depending on state.size, read in a number of random kanji, their kana, their romanji, and their definitions
            for (let i = 0; i < state.size; i++) {
                console.log("TODO: push random kanji/kana/romanji/definition to respective array[" + i + "].");
            }

            console.log("TODO: set each list to these new lists.");
        },
        setSize: (state, action) => {
            console.log("Setting size of list to: ", action.payload);
            state.size = action.payload;
        },
        setDrag: (state, action) => {
            console.log("Setting drag: ", action.payload);
            state.drag = action.payload;
        }
    }
});

export const { randomize, setSize, setDrag } = kanjiSlice.actions;
export default kanjiSlice.reducer;