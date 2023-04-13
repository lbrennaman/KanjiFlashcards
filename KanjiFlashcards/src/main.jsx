import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import RowObject from './kanji/rows';

import { useSelector, useDispatch, Provider } from 'react-redux';
import { setLists, setSize, setType, setDrag } from './reducers/kanjiList';
import { handleCardsInPlay, removeIndeces } from './reducers/cards';
import { setCoordinates } from './reducers/coordinates';
import store from './store';

// A React component for a standard textarea
function TextArea(properties) {
  function handleKeyDown(event, value, update) {
    if (event.key >= 0 && event.key <= 9) {
      // TODO: if value.length < limit.length, then update value
      update(value + event.key);
    } else if (event.key === 'Backspace') {
      update((previous) => {
        let string = "";
        for (let i = 0; i < previous.length - 1; i++) {
          string += previous[i];
        }
        return string;
      });
    } else {}
  }

  return(
    <form id={"UserInputForm"} className={"p-0 m-0"} style={{height: '100%', width:'100%'}}>
      <textarea id={"UserInputTextArea"} className={"p-0 m-0"}
          value={properties.value}
          onInput={(event) => { return null }}
          onKeyDown={(event) => handleKeyDown(event, properties.value, properties.update)}
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
  // React pure hook variables
  const [fromLeft, updateLeft] = useState(getRandomInt(0, window.innerWidth - (2 * properties.fontSize)));                          // Set random distance from top
  const [fromTop, updateTop] = useState(getRandomInt((0.05 * window.innerHeight), window.innerHeight - (2 * properties.fontSize))); // Set random distance from left

  // Redux global variables
  const cardsInPlay = useSelector((state) => { return state.cards.inplay });  // cardsInPlay: keep track of the value of each FlashCard in play
  const x = useSelector((state) => { return state.coordinate.x});             // x: keep track of the latest mouse click's x coordinate
  const y = useSelector((state) => { return state.coordinate.y});             // y: keep track of the latest mouse click's y coordinate
  const dragValue = useSelector((state) => { return state.kanji.drag });      // dragValue: keep track of the value of the FlashCard being dragged
  const dispatch = useDispatch();

  // Get random integer on range [min, max]
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Set the (x,y) coordinates of the cursor when the left mouse button is pressed down to select this card
  function handleMouseDown(event) {
    dispatch(setCoordinates({x: event.clientX, y: event.clientY}));
  }

  // Set the value of the drag global variable to reflect the current character being dragged (only fires once: when drag event starts)
  function handleDragStart(event) {
    dispatch(setDrag(properties.value));
  }

  // When the drag event ends, use the final (x, y) coordinates of the mouse cursor to translate the position of the flashcard
  function handleDragEnd(event) {
    // Get initial bounding rectangle coordinates of flashcard
    let rect = event.target.getBoundingClientRect();

    // Calculate how far the card should be translated in the x and y directions
    let translate_x = event.clientX - x;
    let translate_y = event.clientY - y;

    // Ensure translation in the x direction does not push the flashcard off the screen
    if (rect.right + translate_x < window.innerWidth && rect.left + translate_x >= 0) {
      updateLeft(fromLeft + translate_x);
    } else if (rect.right + translate_x >= window.innerWidth) {
      updateLeft(window.innerWidth - (rect.right - rect.left));
    } else {
      updateLeft(0);
    }

    // Ensure translation in the y direction does not push the flashcard off the screen
    if (rect.bottom + translate_y < window.innerHeight && rect.top + translate_y >= (0.05 * window.innerHeight)) {
      updateTop(fromTop + translate_y);
    } else if (rect.bottom + translate_y >= window.innerHeight) {
      updateTop(window.innerHeight + (rect.top - rect.bottom));
    } else {
      updateTop((0.05 * window.innerHeight));
    }

  }

  // Disable default behavior when dragging over a flashcard
  function handleDragOver(event) {
    event.preventDefault();
  }

  // If this card is a match for the card being dragged, use updateIndeces to show that the indeces of the kanji and the match should be removed
  function handleDrop(event) {
    event.preventDefault();

    // Remove the two cards from cardsInPlay
    if (dragValue == properties.match) {
      let index0;
      let index1;
      for (let i = 0; i < cardsInPlay.length; i++) {
        // If the current value is the value of this card, check for whether the match is back an index or forward an index: set the indeces accordingly
        if (cardsInPlay[i] == properties.value) {
          if (properties.type === "kanji") {
            if (i + 1 < cardsInPlay.length) {
              if (cardsInPlay[i + 1] == properties.match) { // Check if its match is one index forward
                index0 = i;
                index1 = i + 1;
              }
            }
          } else {
            if (i - 1 >= 0) {
              if (cardsInPlay[i - 1] == properties.match) {  // Check if its match is one index back
                index0 = i - 1;
                index1 = i;
              }
            }
          }
        }
      }

      if (index0 !== undefined && index1 !== undefined) {
        properties.update([index0, index1]);
        dispatch(removeIndeces({i0: index0, i1: index1}));
      }
    }

    // A card is no longer being dragged, so reset the value
    dispatch(setDrag(null));
  }

  return(
    <span className={"border border-2 rounded-2 p-1 m-0 bg-dark text-white"} 
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
  // Redux global variables
  const kanjiList = useSelector((state) => { return state.kanji.kanjiList }); // kanjiList: current list of kanji
  const matchList = useSelector((state) => { return state.kanji.matchList }); // matchList: current list of string that matches a respective kanji in kanjiList
  const cardsInPlay = useSelector((state) => { return state.cards.inplay });  // cardsInPlay: tracks the "value" of all FlashCards in play
  const dispatch = useDispatch();

  // React pure hooks
  const [initialized, setInitialized] = useState(false);  // initialized: Boolean that describes whether this component is initialized or not 
  const [indeces, setIndeces] = useState([null, null]);   // indeces: a pair denoting the indeces at which to remove a kanji and its match from the list of cards
  const [cards, updateCards] = useState([]);              // cards: the actual list of FlashCard components

  // Upon initialization of component, set initialized to true
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
    }
  }, []);

  // When "initialized" changes to reflect that this component is initialized, handleCardsInPlay (which sets cardsInPlay)
  useEffect(() => {
    if (initialized) {
      dispatch(handleCardsInPlay({kanji: kanjiList, match: matchList}));
    }
  }, [initialized]);

  // When cardsInPlay is changed, update the list of cards to match the cardsInPlay
  useEffect(() => {
    if (initialized) {

      // If two cards were removed from cardsInPlay, update cards to match the cardsInPlay
      if (cards.length - 2 == cardsInPlay.length) {
        updateCards((previousCards) => {
          let array = [];
          for (let i = 0; i < indeces[0]; i++) {
            array.push(previousCards[i]);
          }
          for (let i = indeces[0] + 2; i < cards.length; i++) {
            array.push(previousCards[i]);
          }
          return array;
        });
        
        // If this removal removes all cards in "cards", then handleCardsInPlay to ask about resetting
        if (cards.length - 2 == 0) {
          let response = confirm("Completed set! Reset flashcards by pressing OK, or press CANCEL, select new kanji from the nav menu, and press scatter.");
          if (response) {
            dispatch(handleCardsInPlay({kanji: kanjiList, match: matchList}));
          }
        }
      } else { // Otherwise there are no cards, so initialize cards
        // In this case, cards must not be initialized
        let array = [];
        for (let i = 0; i < cardsInPlay.length; i++) {
          if (i % 2 == 0) {
            array.push(
              <FlashCard 
                key={"KANJI " + cardsInPlay[i] + " #" + i} 
                value={cardsInPlay[i]} 
                match={cardsInPlay[i+1]}
                type={"kanji"} 
                fontSize={48} 
                update={(array) => setIndeces(array)}
              />
            );
          } else {
            array.push(
              <FlashCard
                key={"MATCH " + cardsInPlay[i] + " #" + i}  
                value={cardsInPlay[i]} 
                match={cardsInPlay[i-1]}
                type={"match"} 
                fontSize={24} 
                update={(array) => setIndeces(array)}
              />
            );
          }
        }
        updateCards(array);
      }
    }
  }, [cardsInPlay]);

  // Handle the change of cardsInPlay due to a change in kanjiList and/or matchList
  useEffect(() => {
    // Reset the cards that are visible
    if (initialized) {
      dispatch(handleCardsInPlay({kanji: kanjiList, match: matchList}));
    }
  }, [kanjiList, matchList]);

  return(
    <span>
      {cards}
    </span>
  );
}

function KanjiSelect(properties){
  /*
  TODO: The vertical dropdown should show all possible rows of kanji to choose from (currently only row 16)
        Hovering over a row should have a side dropdown showing all kanji in that row. All of those kanji should have select checkmarks.
        All kanji that are selected, regardless of row, should be put into a global "selected" variable and have the possibility
        of appearing as a FlashCard on the ScatterBoard.

        Rows themselves should also have a select checkmark. Selecting a row should select all kanji in the row and deselecting a row should deselect
        all kanji in that row.
  */
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
  // Redux global variables
  const dispatch = useDispatch();

  // Handle a button press by setting the global match "type" to that of the button that was pressed
  function handleButton(event, type) {
    // Change the type to that of the button that triggered this event
    dispatch(setType(type));

    // Reset the lists to adjust for the updated type
    dispatch(setLists({
      row: RowObject.row16.array
    }));
  }

  // Return the component: a span with multiple buttons
  return(
    <span className={"btn-group p-0 m-0"} role={"group"} style={{height: '100%'}}> 
      <button className={"btn btn-primary"} onClick={(event) => handleButton(event, "音読み")}>
        {"音読み"}
      </button>
      <button className={"btn btn-primary"} onClick={(event) => handleButton(event, "訓読み")}>
        {"訓読み"}
      </button>
      <button className={"btn btn-primary"} onClick={(event) => handleButton(event, "kana")}>
        {"Kana"}
      </button>    
      <button className={"btn btn-primary"} onClick={(event) => handleButton(event, "romanji")}>
        {"Romanji"}
      </button> 
      <button className={"btn btn-primary"} onClick={(event) => handleButton(event, "definition")}>
        {"Definition"}
      </button>       
    </span>
  );
}

function ScatterButton(properties) {
  // Redux global variables
  const kanjiList = useSelector((state) => { return state.kanji.kanjiList }); // kanjiList: current list of kanji
  const matchList = useSelector((state) => { return state.kanji.matchList }); // matchList: current list of string that matches a respective kanji in kanjiList
  const dispatch = useDispatch();

  // handleButton function: upon pressing the ScatterButton, forceReset() and handleCardsInPlay() to refresh cardsInPlay using the current kanjiList and matchList
  function handleButton(event) {
    dispatch(handleCardsInPlay({kanji: kanjiList, match: matchList}));

    // Possibly: compare cardsInPlay after supposedly resetting. If no change, randomize positions of cards. How can that be done from here?
  }

  return(
    <span className={"btn-group p-0 m-0"} role={"group"} style={{height: '100%'}}> 
      <button className={"btn btn-primary"} onClick={(event) => {handleButton(event)}}>
        {"Scatter"}
      </button>        
    </span>
  );
}

function NumberSelect(properties) {
  // Redux global state variables
  const size = useSelector((state) => { return state.kanji.size });

  // React pure hook variable and update function to store the current value of the TextArea
  // Possible TODO: change this to a Redux global state variable so that value and updateValue don't have to be passed as properties
  const [value, updateValue] = useState(size);

  // Dispatch
  const dispatch = useDispatch();

  function handleButton(event) {
    // Reset the size of the list of FlashCards
    dispatch(setSize(Number(value)));

    // Reset the lists to adjust for the updated size
    dispatch(setLists({
      row: RowObject.row16.array
    }));
  }

  return(
    <span className={"d-flex p-0 m-0"} style={{height: '100%'}}>
      <TextArea value={value} update={updateValue}/>
      <button className={"btn btn-outline-success"} onClick={(event) => handleButton(event)}>{"/" + "TODO"}</button>
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
  // React pure hooks and Redux dispatch
  const [initialized, setInitialized] = useState(false);  // initialized: keep track of whether this component is initialized or not
  const [scatterBoard, setScatterBoard] = useState(null); // scatterBoard: manually render the ScatterBoard to control when it renders initially
  const dispatch = useDispatch();

  // Upon initialization of component, set initialized to true
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
    }
  }, []);

  // When initialized changes to reflect that this component is initialized, dispatch setLists and initialize ScatterBoard
  useEffect(() => {
    if (initialized) {
      // Initialize kanjiList and matchList with row16 kanji as the default row and kana as the default match type
      dispatch(setLists({
        type: "kana", 
        row: RowObject.row16.array
      }));

      // Initialize the ScatterBoard now so that kanjiList and matchList are initialized before the ScatterBoard
      setScatterBoard(<ScatterBoard/>);
    }
  }, [initialized]);

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
          {scatterBoard}
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