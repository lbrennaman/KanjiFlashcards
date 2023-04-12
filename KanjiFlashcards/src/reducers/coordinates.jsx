import { createSlice } from '@reduxjs/toolkit';

// Store the coordinates of the latest mouse click (used as offset values for properly dragging objects)
export const coordinateSlice = createSlice({
    name: 'coordinates',
    initialState: { 
        x: 0,
        y: 0
    },
    reducers: {
        setCoordinates: (state, action) => {
            state.x = action.payload.x;
            state.y = action.payload.y;
        }
    }
});

export const { setCoordinates } = coordinateSlice.actions;
export default coordinateSlice.reducer;