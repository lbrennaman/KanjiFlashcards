import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { useSelector, useDispatch, Provider } from 'react-redux';
import { randomize, setSize, setDrag, setX, setY } from './reducers/kanjiList';
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

// Should probably have a better name
// This global variable holds the list of current flashcard values (both kanji cards and match cards)
// Order of values: [kanji, match, kanji, match, ... kanji, match]. Alternates between a kanji and its match
var values = {array: [], reset: true};
var answer = false;

function FlashCard(properties) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  // Get random number on range [min, max]
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Save coordinates to this FlashCard's state locally using useState()
  // Subtract pixel font size from max width and height to ensure flashcard appears in window
  const [fromLeft, updateLeft] = useState(getRandomInt(0, window.innerWidth - properties.fontSize)); 
  const [fromTop, updateTop] = useState(getRandomInt((0.05 * window.innerHeight), window.innerHeight - properties.fontSize));

  const x = useSelector((state) => { return state.kanji.x});
  const y = useSelector((state) => { return state.kanji.y});

  // Drag variable from global state
  const dragValue = useSelector((state) => { return state.kanji.drag });
  const dispatch = useDispatch();

  function handleMouseDown(event) {
    console.log("MOUSE DOWN AT X: ", event.clientX, " Y: ", event.clientY);
    dispatch(setX(event.clientX));
    dispatch(setY(event.clientY));
  }

  function handleDragStart(event) {
    // console.log("This flashcard was dragged!");

    // Set the value of the drag global variable to reflect the current character being dragged
    dispatch(setDrag(properties.value));
  }

  function handleDragEnd(event) {
    let rect = event.target.getBoundingClientRect();
    console.log("From left: ", fromLeft, " and from top: ", fromTop);
    console.log("InitialRect Top: ", rect.top, " Left: ", rect.left, " Right: ", rect.right, " Bottom: ", rect.bottom);
    console.log("Mouse moving: ", event.clientX - x, event.clientY - y);
    let translate_x = event.clientX - x;
    let translate_y = event.clientY - y;

    // Tranlsation in the x direction: event.clientX - x
    // Translation in the y direction: event.clientY - y

    // If right bound is still in window in x direction && left bound is still in window in -x direction
    // If rect.right + translate_x < window.innerWidth && rect.left + translate_x >= 0, 
    //    updateLeft(fromLeft + translate_x)
    // Else if rect.right + translate_x >= window.innerWidth, 
    //    updateLeft(window.innerWidth - (rect.right - rect.left)) // Set the card so that the right edge is on the bound of the window
    // Else
    //    updateLeft(0) // Set the card so that the left edge is on the bound of the window

    // If the top bound is still in window in y direction and bottom bound is still in window in -y direction 
    // If rect.top + translate_y < window.innerHeight && rect.bottom + translate_y >= 0
    //    updateTop(fromTop + translate_y)
    // Else if rect.top + translate_y >= window.innerHeight
    //    updateTop(window.innerHeight - (rect.top - rect.bottom))  // Set the card so that the bottom edge is on the bottom bound of the window
    // Else
    //    updateTop((0.05 * window.innerHeight))  // Set the card so that the top edge is at the minimum starting position

    if (rect.right + translate_x < window.innerWidth && rect.left + translate_x >= 0) {
      updateLeft(fromLeft + translate_x);
    } else if (rect.right + translate_x >= window.innerWidth) {
      updateLeft(window.innerWidth - (rect.right - rect.left));
    } else {
      updateLeft(0);
    }

    if (rect.top + translate_y < window.innerHeight && rect.bottom + translate_y >= 0) {
      updateTop(fromTop + translate_y);
    } else if (rect.top + translate_y >= window.innerHeight) {
      updateTop(window.innerHeight - (rect.top - rect.bottom));
    } else {
      updateTop((0.05 * window.innerHeight));
    }

  }

  function handleDragOver(event) {
    event.preventDefault();
    // console.log("This flashcard was dragged over! Card: ", properties.value);
  }

  function handleDrop(event) {
    event.preventDefault();
    // console.log("This flashcard was dropped on! Card: ", properties.value);

    // If this card is a match for the card being dragged, use updateIndeces to show that the indeces of the kanji and the match should be removed
    // properties.update();
    if (dragValue == properties.match) {
      console.log("Match! These two cards should be deleted!");

      // Set indeces to the indeces of this flashcard and the matching flashcard
      let index0;
      let index1;
      for (let i = 0; i < values.array.length; i++) {
        // If the current value is the value of this card, check for whether the match is back an index or forward an index: set the indeces accordingly
        if (values.array[i] == properties.value) {
          if (i - 1 >= 0) {
            if (values.array[i - 1] == properties.match) {
              index0 = i - 1;
              index1 = i;
              properties.update([index0, index1]);
            }
          } else if (i + 1 < values.array.length) {
            if (values.array[i + 1] == properties.match) {
              index0 = i;
              index1 = i + 1;
              properties.update([index0, index1]);
            }
          }
        }
      }

      // Remove indeces from values list
      values.array.splice(index0, 1);
      values.array.splice(index1 - 1, 1);

      console.log("Updated values: ", values);
    }
    
    // A card is no longer being dragged, so reset the value
    dispatch(setDrag(null));
  }

  return(
    <span className={"border border-2 rounded-2 p-1 m-0"} 
      style={{
        position: 'absolute', 
        left: fromLeft + 'px', 
        top: fromTop + 'px', 
        border: '1px solid black', 
        fontSize: properties.fontSize + 'px'
      }} 
      draggable
      onMouseDown={(event) => handleMouseDown(event)}
      onDragStart={(event) => handleDragStart(event)}
      onDragEnd={(event) => handleDragEnd(event)}
      onDragOver={(event) => handleDragOver(event)}
      onDrop={(event) => handleDrop(event)}>
      {properties.value}
    </span>
  );
}

function ScatterBoard(properties) {
  // Get the list of active kanji and their matches from the global state
  const kanjiList = useSelector((state) => { return state.kanji.kanjiList });
  const matchList = useSelector((state) => { return state.kanji.matchList });
  const dispatch = useDispatch();

  // Keep track of whether or not this component is initialized or not
  const [initialized, setInitialized] = useState(false);

  // Upon initialization, create a list to keep track of the values of the current flashcards in play
  if (initialized) {
    if (values.reset === true) {
      for (let i = 0; i < kanjiList.length; i++) {
        values.array.push(kanjiList[i]);
        values.array.push(matchList[i]);
      }
      values.reset = false;
      answer = true;
    } else {
      // Debug
      // Activates everytime component re-renders due to values.reset being set to false on initial render
      // So re-renders every render after initial render
      console.log("SHOW ME THE VALUES: ", values.array);
      if (values.array.length == 0 && answer === true) {
        answer = confirm("Set completed! Reset flashcards?");
      }
    }
  }

  // Keep track of two indeces: the kanji and its match. If these two are not null, remove them from the list of flashcards
  const [indeces, updateIndeces] = useState([null, null]);

  // Assemble the list of flashcards based on the kanjiList and matchList
  const [cards, updateCards] = useState(() => {
    let cardList = [];
    for (let i = 0; i < kanjiList.length; i++) {
      cardList.push(
        <FlashCard 
          key={"KANJI CARD: " + i} 
          value={kanjiList[i]} 
          match={matchList[i]} 
          update={(value) => {updateIndeces(value)}}
          fontSize={48}
        />
      );
      cardList.push(
        <FlashCard 
          key={"MATCH CARD: " + i} 
          value={matchList[i]} 
          match={kanjiList[i]} 
          update={(value) => {updateIndeces(value)}}
          fontSize={24}
        />
      );
    }
    return cardList;
  });

  // Use an effect after re-rendering indeces to check whether or not flashcards should be removed or not
  useEffect(() => {
    if (initialized) {
      if (indeces[0] !== null && indeces[1] !== null) {
        // Debug
        console.log("Indeces are not null! Removing flashcards!");
        console.log("Index[0]: ", indeces[0], " and Index[1]: ", indeces[1]);

        // Remove the flashcards from the list of flashcards and return the array
        updateCards((previousCards) => {
          let copy = [];

          // Copy cards until the first index is hit
          for (let i = 0; i < indeces[0]; i++) {
            copy.push(previousCards[i]);
          }

          // Due to how the indeces are set, indeces[0] is always 1 before indeces[1], so increment indeces[0] by 2 to pass both indeces
          for (let i = indeces[0] + 2; i < previousCards.length; i++) {
            copy.push(previousCards[i]);
          }

          // Return the new array of flashcards to display
          return copy;
        });
      } else {
        console.log("Indeces are null!"); // Debug
      }
    } else {
      setInitialized(true);
    }
  }, [indeces]);

  return(
    <span>
      {cards}
    </span>
  );
}

function KanjiSelect(properties){
  return(
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
  );
}

function MatchSelect(properties) {
  return(
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
  );
}

function ScatterButton(properties) {
  return(
    <span className={"btn-group p-0 m-0"} role={"group"} style={{height: '100%'}}> 
      <button className={"btn btn-primary"}>
        {"Scatter"}
      </button>        
    </span>
  );
}

function NumberSelect(properties) {
  return(
    <span className={"d-flex p-0 m-0"} style={{height: '100%'}}>
      <TextArea/>
      <button className={"btn btn-outline-success"}>{"/Limit"}</button>
    </span>
  );
}

function ToolBar(properties) {
  return (
    <nav className={"navbar navbar-dark bg-dark p-0 m-0"}
      style={{height: '100%', width: '100%', border: '1px solid black', borderRight: 'none', borderLeft: 'none', borderTop: 'none'}}>
      <div className={"container-fluid p-0 m-0"} style={{height: '100%', width: '100%'}}>
        <KanjiSelect/>
        <MatchSelect/>
        <ScatterButton/>
        <NumberSelect/>
      </div>
    </nav>
  );
}

function MainView(properties) {
  // View:
  // Create a top toolbar that contains: top left dropdown menu for page navigation
  //  - Page navigation should include a way to choose SHIFT-JIS rows to use as well as their individual kanji
  // Buttons to select the type of matchlist (kana, romanji, or definitions)
  // A button to scatter cards across the ScatterBoard using the currently selected kanji row, individually selected kanji, and their selected matchList
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
