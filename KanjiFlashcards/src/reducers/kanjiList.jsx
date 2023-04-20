import { createSlice } from '@reduxjs/toolkit';

export const kanjiSlice = createSlice({
    name: 'kanji',
    initialState: { 
        size: 5,
        type: "kana",
        kanjiList: [],
        matchList: [],
        drag: null
    },
    reducers: {
        setLists: (state, action) => {
            // Clear lists first
            state.kanjiList = [];
            state.matchList = [];

            // Fill kanjiList with TODO: random kanji
            for (let i = 0; i < state.size; i++) {
                state.kanjiList.push(action.payload.row[i].kanji);
            }

            // Fill matchList depending on the type of card to match (TODO: as kanji is randomized, must match indeces used for random kanji)
            if (state.type === "音読み") {
                for (let i = 0; i < state.size; i++) {
                    state.matchList.push(action.payload.row[i].音読み);
                }
            } else if (state.type === "訓読み") {
                for (let i = 0; i < state.size; i++) {
                    state.matchList.push(action.payload.row[i].訓読み);
                }
            } else if (state.type === "kana") {
                for (let i = 0; i < state.size; i++) {
                    state.matchList.push(action.payload.row[i].kana);
                }
            } else if (state.type === "romanji") {
                for (let i = 0; i < state.size; i++) {
                    state.matchList.push(action.payload.row[i].romanji);
                }
            } else {
                for (let i = 0; i < state.size; i++) {
                    state.matchList.push(action.payload.row[i].definition);
                }
            }
        },
        setSize: (state, action) => {
            state.size = action.payload;
        },
        setType: (state, action) => {
            state.type = action.payload;
        },
        setDrag: (state, action) => {
            state.drag = action.payload;
        }
    }
});

export const { setLists, setSize, setType, setDrag } = kanjiSlice.actions;
export default kanjiSlice.reducer;