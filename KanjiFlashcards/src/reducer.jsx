import { createSlice } from '@reduxjs/toolkit';

export const kanjiSlice = createSlice({
    name: 'kanji',
    initialState: { kanjiList: ["我"] },
    reducers: {
        pushKanji: (state) => { 
            console.log("\nPUSHING KANJI!\n-----------------");

            let copy = [...state.kanjiList]; 
            copy.push('kanji');
            for (let element of copy) {
                console.log("KanjiList element: ", element);
            }
            state.kanjiList = copy;
        },
        popKanji: (state) => { 
            console.log("\nPOPPING KANJI!\n-----------------");

            let copy = [...state.kanjiList]; 
            copy.pop();
            for (let element of copy) {
                console.log("KanjiList element: ", element);
            }
            state.kanjiList = copy;
        },
        printKanji: (state) => { 
            console.log("\nPRINTING KANJI!\n-----------------");

            let i = 0;
            for (let element of state.kanjiList) {
                console.log("KanjiList[" + i + "] element: ", element);
            }
        }
    }
});

export const { pushKanji, popKanji, printKanji } = kanjiSlice.actions;
export default kanjiSlice.reducer;