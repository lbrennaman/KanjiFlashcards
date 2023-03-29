import React from 'react';
import ReactDOM from 'react-dom/client';

import { useSelector, useDispatch, Provider } from 'react-redux';
import { randomize, setSize } from './reducer';
import store from './store';

function ToolBar(properties) {
  return(
    <div id={"ToolBar Container"} className={"container-fluid p-0 m-0"} 
         style={{height: '100%', width: '100%', border: '1px solid black', borderRight: 'none', borderLeft: 'none', borderTop: 'none'}}>
      <span id={"ToolBar Nav1"} className={"dropdown-center"} data-bs-theme={"dark"}>
        <button type={"button"} className={"btn btn-primary dropdown-toggle"} data-bs-toggle={"dropdown"} aria-expanded={"false"} data-bs-auto-close={"outside"}>
          {"Navigation"}
        </button>
        <ul className={"dropdown-menu"}>
          <div className={"btn-group dropend"}>
            <button type={"button"} className={"btn btn-secondary dropdown-toggle"} data-bs-toggle={"dropdown"} aria-expanded={"false"}>
              {"Kanji Select"}
            </button>
            <ul className={"dropdown-menu"}>
              {"TODO"}
            </ul>
          </div>
        </ul>
      </span>
      <span id={"ToolBar Nav2"} className={"p-0 m-0"}> 
        {"TODO: Buttons to select Kana/Romanji/Definitions"}
      </span>
      <span id={"ToolBar Nav3"} className={"p-0 m-0"}> 
        {"TODO: Input form to change the number of cards to randomly scatter across the board"}
      </span>
    </div>
  );
}

function MainView(properties) {
  const kanjiList = useSelector((state) => { return state.cards.kanjiList });
  const matchList = useSelector((state) => { return state.cards.kanaList });
  const dispatch = useDispatch();

  // View:
  // Create a top toolbar that contains: top left dropdown menu for page navigation
  //  - Page navigation should include a way to choose SHIFT-JIS rows to use as well as their individual kanji
  // Buttons to select the type of matchlist (kana, romanji, or definitions)
  // Input form to change the number of cards to randomly scatter across the board
  return (
    <div id={"MainViewContainer"} className={"container-fluid p-0 m-0"} style={{height: '100%', width: '100%'}}>
      <div id={"MainViewTopRow"} className={"row p-0 m-0"} style={{height: '5%', width: '100%'}}>
        <div id={"MainViewToolBar Container"} className={"container-fluid p-0 m-0"} style={{height: '100%', width: '100%'}}>
          <ToolBar/>
        </div>
      </div>
      <div id={"MainViewBottomRow"} className={"row p-0 m-0"} style={{height: '95%', width: '100%'}}>
        <div id={"MainViewScatterZone Container"} className={"container-fluid p-0 m-0"} style={{height: '100%', width: '100%'}}>
          {"TODO: Implement scatter board to scatter cards to match."}
        </div>
      </div>
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
