import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import { useSelector, useDispatch, Provider } from 'react-redux';
import { randomize, setSize } from './reducers/kanjiList';
import store from './store';

function TextArea(properties) {
  return(
    <form id={"UserInputForm"} className={"p-0 m-0"} style={{height: '100%', width:'100%'}}>
      <textarea id={"UserInputTextArea"} className={"p-0 m-0"}
          value={properties.value}
          style={{
            height: '100%', 
            width:'100%', 
            overflow: 'hidden', 
            resize: 'none', 
            border: 'none', 
            outline: 'none', 
            boxShadow: 'none',
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            overflowX: 'hidden',
            overflowY: 'hidden',
            backgroundColor: '#343a40',
            color: 'white'
          }}>
      </textarea>
    </form>
  );
}

function FlashCard(properties) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  // Get random number on range [min, max]
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Save coordinates to this FlashCard's state locally using useState()
  const [fromLeft, updateLeft] = useState(getRandomInt(0, window.innerWidth));
  const [fromBottom, updateBottom] = useState(getRandomInt(0, window.innerHeight));

  function handleDrag(event) {
    console.log("This flashcard was dragged!");
  }

  function handleDragover(event) {
    event.preventDefault();
    console.log("This flashcard was dragged over! Card: ", properties.value);
  }

  function handleDrop(event) {
    event.preventDefault();
    console.log("This flashcard was dropped on! Card: ", properties.value);
  }

  return(
    <span className={"p-1 m-0"} style={{position: 'absolute', left: fromLeft + 'px', bottom: fromBottom + 'px', border: '1px solid black'}} 
      draggable
      onDrag={(event) => handleDrag(event)}
      onDragOver={(event) => handleDrag(event)}
      onDrop={(event) => handleDrag(event)}>
      {properties.value}
    </span>
  );
}

class Pair {
  constructor(first = null, second = null) {
      this.first = first;
      this.second = second;
  }

  getFirst() {
    return this.first;
  }

  getSecond() {
    return this.second;
  }

  toString() {
    return("First: " + this.first + " Second: " + this.second);
  }
}

function ScatterBoard(properties) {
  const kanjiList = useSelector((state) => { return state.kanji.kanjiList });
  const matchList = useSelector((state) => { return state.kanji.matchList });

  // Pair approach, but this is probably useless since this doesnt provide them with any functionality
  // to detect if a FlashCard is a match to the other card in the Pair
  /*
  let objects = [];
  for (let i = 0; i < kanjiList.length; i++) {
    objects.push(
      new Pair(
        <FlashCard key={"KANJI CARD: " + i} value={kanjiList[i]} match={matchList[i]}/>, 
        <FlashCard key={"MATCH CARD: " + i} value={matchList[i]} match={kanjiList[i]}/>
      )
    );
  }

  let cards = [];
  for (let card of objects) {
    console.log("Cards: ", card.toString());
    cards.push(card.getFirst());
    cards.push(card.getSecond());
  }
  */

  let cards = [];
  for (let i = 0; i < kanjiList.length; i++) {
    cards.push(<FlashCard key={"KANJI CARD: " + i} value={kanjiList[i]} match={matchList[i]}/>);
    cards.push(<FlashCard key={"MATCH CARD: " + i} value={matchList[i]} match={kanjiList[i]}/>);
  }

  return(
    <span>
      {cards}
    </span>
  );
}

function ToolBar(properties) {
  return (
    <nav className={"navbar navbar-dark bg-dark p-0 m-0"}
      style={{height: '100%', width: '100%', border: '1px solid black', borderRight: 'none', borderLeft: 'none', borderTop: 'none'}}>
      <div className={"container-fluid p-0 m-0"} style={{height: '100%', width: '100%'}}>
        <span id={"ToolBar Nav"} className={"dropdown-center"} data-bs-theme={"dark"} style={{height: '100%'}}>
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
        <span className={"btn-group p-0 m-0"} role={"group"} style={{height: '100%'}}> 
          <button className={"btn btn-primary"}>
            {"Kana"}
          </button>    
          <button className={"btn btn-primary"}>
            {"Romanji"}
          </button> 
          <button className={"btn btn-primary"}>
            {"Definition"}
          </button>       
        </span>
        <span className={"d-flex p-0 m-0"} style={{height: '100%'}}>
          <TextArea/>
          <button className={"btn btn-outline-success"}>{"/Limit"}</button>
        </span>
      </div>
    </nav>
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
          <ScatterBoard/>
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
