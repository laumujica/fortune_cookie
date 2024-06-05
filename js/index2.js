<<<<<<< HEAD
//Random phrase generator

// Steps to solve my problem
/*
- Create a list of words
- Able to randomly pick a word from list
- Create a phrase consisting of random words
- Display my phrase on the page
- Be able to connect the button to the creation of the phrase
*/

// Create a list of words


const nouns = [
    "dog",
    "cat",
    "person",
    "ninja",
    "pony",
    "Ed",
    "programming language",
    "football",
    "comfy chair",
    "fake flower",
    "giant red panda",
    "big piñata",
    "expired cake"
  ];
  
 const actions = [
    "bought",
    "played with",
    "had a coffee with",
    "is",
    "jumped over",
    "entered the room with",
    "read a book about",
    "talked to",
    "jumped on",
    "is running with",
    "is having dinner with",
    "ran a marathon with"
  ];
  
 const articles = ["the", "a", "some"];

function pickRandomWord(listOfWords) {
    const randomNum = Math.floor(Math.random() * listOfWords.length);
    return listOfWords[randomNum];
}

function generateRandomPhrase() { 
    return `${pickRandomWord(articles)} ${pickRandomWord(nouns)} ${pickRandomWord(actions)} ${pickRandomWord(articles)} ${pickRandomWord(nouns)}`; 
}

function displayPhrase() {
    const phrase = generateRandomPhrase();

    const headerElem = document.querySelector(".phrase")

    headerElem.innerText = phrase;
}



function listenToClicks() {
    const button = document.querySelector(".generate-phrase");

    button.addEventListener("click", displayPhrase);
}

listenToClicks();



// console.log(generateRandomPhrase());



// console.log(pickRandomWord(nouns));
// console.log(pickRandomWord(actions));
=======
//Random phrase generator

// Steps to solve my problem
/*
- Create a list of words
- Able to randomly pick a word from list
- Create a phrase consisting of random words
- Display my phrase on the page
- Be able to connect the button to the creation of the phrase
*/

// Create a list of words


const nouns = [
    "dog",
    "cat",
    "person",
    "ninja",
    "pony",
    "Ed",
    "programming language",
    "football",
    "comfy chair",
    "fake flower",
    "giant red panda",
    "big piñata",
    "expired cake"
  ];
  
 const actions = [
    "bought",
    "played with",
    "had a coffee with",
    "is",
    "jumped over",
    "entered the room with",
    "read a book about",
    "talked to",
    "jumped on",
    "is running with",
    "is having dinner with",
    "ran a marathon with"
  ];
  
 const articles = ["the", "a", "some"];

function pickRandomWord(listOfWords) {
    const randomNum = Math.floor(Math.random() * listOfWords.length);
    return listOfWords[randomNum];
}

function generateRandomPhrase() { 
    return `${pickRandomWord(articles)} ${pickRandomWord(nouns)} ${pickRandomWord(actions)} ${pickRandomWord(articles)} ${pickRandomWord(nouns)}`; 
}

function displayPhrase() {
    const phrase = generateRandomPhrase();

    const headerElem = document.querySelector(".phrase")

    headerElem.innerText = phrase;
}



function listenToClicks() {
    const button = document.querySelector(".generate-phrase");

    button.addEventListener("click", displayPhrase);
}

listenToClicks();



// console.log(generateRandomPhrase());



// console.log(pickRandomWord(nouns));
// console.log(pickRandomWord(actions));
>>>>>>> 6f3f1c6a005b4848ec4583f9353019a812c37372
// console.log(pickRandomWord(articles));