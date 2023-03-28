import React from 'react';
import ReactDOM from 'react-dom/client';

import { useSelector, useDispatch, Provider } from 'react-redux';   // Allow the component to use a selector, use dispatch, and use a <Provider/>
import { pushKanji, popKanji, printKanji } from './reducer';        // Include the actions that this file will dispatch
import store from './store';                                        // Get the global state (store) from its file

// Example of dispatching actions
function handleKeyDown(event, dispatch) {
  console.log("Handlekeydown fired!");
  dispatch(printKanji());
  dispatch(pushKanji());
  dispatch(printKanji());
  dispatch(popKanji());
  dispatch(printKanji());
}

// Example of creating a React component
function MainView(properties) {
  const kanjiList = useSelector((state) => { return state.kanjiList }); // Component hook variables are replaced by Redux Selectors
  const dispatch = useDispatch();                                       // Each component (that needs a dispatch) creates a dispatch hook

  // A return value to render the component like normal, but events trigger the dispatch of actions
  return(
    <div style={{height: '100%', width: '100%', border: '2px solid red'}} onMouseDown={(event) => { handleKeyDown(event, dispatch) }}>
      {kanjiList[0]}
    </div>
  );
}

// Create the root React component, but use Redux's provider to provide the global state to all sub-components
ReactDOM.createRoot(document.getElementById('MainViewController')).render(
  <React.StrictMode>
    <Provider store={store}>
      <MainView />
    </Provider>
  </React.StrictMode>,
);
