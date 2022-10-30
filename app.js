// ==================
// ===== Global =====
// ==================


// ===== Elements =====
const exitSectionBtns = document.querySelectorAll('.exit-section-btn');
const cube = document.getElementById('cube');
const popup = document.getElementById("popup");

// ===== Functions ======
const showPopup = () => popup.classList.add('show');
const hidePopup = () => popup.classList.remove('show');

const createExitPopup = () => {
	popup.innerHTML = 
	`
		<p>Are you sure to exit to main menu? The current process will not be stored</p>
		<div class="buttons">
			<button id="button-cancel" class="button-cancel">Cancel</button>
			<button id="button-confirm" class="button-confirm">Confirm</button>
		</div>
	`;
};

const getDecksFromLS = () => {
	return localStorage.getItem('decks') === null
		? []
		: JSON.parse(localStorage.getItem('decks'));
}

const returnToMainMenu = () => cube.style.transform = 'rotate(0)';

const exitSection = (e) => {
	createExitPopup();
	showPopup();
	const sectionBtn = e.target.parentElement;

	popup.addEventListener('click', (e) => {
		if (e.target.classList.contains('button-cancel')) {
			hidePopup();
		} else if (e.target.classList.contains('button-confirm')) {
			hidePopup();
			returnToMainMenu();
			if (sectionBtn.id === 'exit-create-deck-section-btn') {
				resetCreateSectionInput();
			} else  if (sectionBtn.id === 'exit-edit-deck-section-btn') {
				resetEditDeckSection();
			} else  if (sectionBtn.id === 'exit-practice-deck-section-btn') {
				resetPracticeDeckSection();
			}
		};
	});
};

const capitalize = (string) => string[0].toUpperCase().concat(string.slice(1).toLowerCase());

// ===== Event Listeners =====
exitSectionBtns.forEach(btn => btn.addEventListener('click', exitSection));





// =====================
// ===== Main Menu =====
// =====================

const decks = getDecksFromLS();

// ===== Elements =====
const sectionMainMenus = document.querySelectorAll('.section-main select');
const selectPracticeMenu = document.getElementById("select-practice__menu");
const selectPracticeBtn = document.getElementById("select-practice__btn");
const selectEditMenu = document.getElementById("select-edit__menu");
const selectEditBtn = document.getElementById("select-edit__btn");
const inputCreateText = document.getElementById("input-create__text");
const inputCreateBtn = document.getElementById("input-create__btn");


// ===== Functions ======
const validateSelectMenu = (e) => {
	const siblingEl = e.target.parentElement.firstElementChild;
	if (siblingEl.value === "") {
		popup.textContent = siblingEl.firstElementChild.textContent;
		showPopup();
		siblingEl.style.color = "red";
		setTimeout(() => {
			hidePopup();
			siblingEl.style.color = "#fff";
		}, 4000);
		return false;
	} else {
		return true;
	}
};
const validateTextInput = (e) => {
	const siblingEl = e.target.parentElement.firstElementChild;
	if (siblingEl.value === "") {
		popup.textContent = "Enter a name for your new deck";
		showPopup;
		siblingEl.classList.add("mark-placeholder");
		setTimeout(() => {
			siblingEl.style.color = "#fff";
			siblingEl.classList.remove("mark-placeholder");
			removePopup;
		}, 4000);
		return false;
	} else {
		return true;
	}
};


const setCreateDeckTitle = () => sectionCreateDeckTitle.textContent = capitalize(inputCreateText.value);

const clearMainMenuInputFields = () => {
	selectPracticeMenu.selectedIndex = 0;
  selectEditMenu.selectedIndex = 0;
  inputCreateText.value = '';
};

const openCreateDeckSection = (e) => {
	e.preventDefault();
	if (!validateTextInput(e)) return;
	clearCreateDeckInputFields();
	storeNewDeckTitle();
	setCreateDeckTitle();
	cube.style.transform = 'rotateY(-90deg)';
	clearMainMenuInputFields();
};

const openEditDeckSection = (e) => {
	e.preventDefault();
	if (!validateSelectMenu(e)) return;
	cube.style.transform = 'rotateY(90deg)';
	setEditDeckTitle();
	editDeckTitle();
	populateEditDeckCardList();
	clearMainMenuInputFields();
};

const openPracticeDeckSection = (e) => {
	e.preventDefault();
	if (!validateSelectMenu(e)) return;
	cube.style.transform = 'rotateX(-90deg)';
	setPracticeDeckTitle();
	setPracticeDeck();
	createCards();
	setCardProgressText();
	clearMainMenuInputFields();
};

const populateSectionMainMenus = () => {	
	sectionMainMenus.forEach(menu => {
		
		Array.from(menu.children).forEach((option, index) => {
			index >= 1 && menu.removeChild(option);
		});

		if (localStorage.getItem('decks') === null) return;
			JSON.parse(localStorage.getItem('decks')).forEach(deck => {
			const option = document.createElement('option');
			const topic = capitalize(deck.topic);
			option.value = topic;
			option.textContent = topic;
			menu.appendChild(option);
		});
	});
};

// ===== Event Listeners =====
selectPracticeMenu.addEventListener("focus", clearMainMenuInputFields);
selectEditMenu.addEventListener("focus", clearMainMenuInputFields);
inputCreateText.addEventListener("focus", clearMainMenuInputFields);
selectPracticeBtn.addEventListener("click", openPracticeDeckSection);
selectEditBtn.addEventListener("click", openEditDeckSection);
inputCreateBtn.addEventListener("click", openCreateDeckSection);





// ============================
// ===== Create Deck Menu =====
// ============================

let newDeckTitle;
let newCards = [];


// ====== Elements ======
const addCardBtn = document.getElementById('add-card-btn');
const createDeckBtn = document.getElementById('create-deck-btn');
const addCardList = document.getElementById('add-card-list');
const questionInputText = document.getElementById('input-question__text');
const answerInputText = document.getElementById('input-answer__text');
const sectionCreateDeckTitle = document.getElementById('section-create__deck-title');
const addCardHeader = document.querySelector('.add-card-header');


// ===== Functions =====
const clearCreateDeckInputFields = () => {
	questionInputText.value = '';
	answerInputText.value = '';
};

const clearCreateDeckCardList = () => addCardList.innerHTML = '';

const storeNewDeckTitle = () => newDeckTitle = capitalize(inputCreateText.value);

const showCreateDeckCardListHeader = () => {
	newCards.length > 0 && addCardHeader.classList.add('show');
};

const hideCreateDeckCardListHeader = () => {
	newCards.length === 0 && addCardHeader.classList.remove('show');
};

const addNewDeckToLS = (newDeck) => {
	let tempDecks;
	localStorage.getItem('decks') === null
		? tempDecks = []
		: tempDecks = JSON.parse(localStorage.getItem('decks'));

	tempDecks.push(newDeck);
	localStorage.setItem('decks', JSON.stringify(tempDecks));
};

const addCard = () => {
	const index = newCards.length;
	const question = questionInputText.value;
	const answer = answerInputText.value;
	const cardLi = document.createElement('li');
	cardLi.innerHTML = 
	`
		<span>${index + 1}</span>
		<span>${question}</span>
		<span>${answer}<span>
	`;
	
	const newCard = { question, answer };
	newCards.push(newCard);
	addCardList.appendChild(cardLi);
	showCreateDeckCardListHeader();
	clearCreateDeckInputFields();
};

const createDeck = () => {
	const newDeck = {
		topic: newDeckTitle,
		cards: newCards,
	};

	decks.push(newDeck);
	addNewDeckToLS(newDeck);
	populateSectionMainMenus();
	returnToMainMenu();
	resetCreateSectionInput();
};

const resetCreateSectionInput = () => {
	newCards = [];
	newDeckTitle = '';
	sectionCreateDeckTitle.textContent = '';
	clearCreateDeckInputFields();
	clearCreateDeckCardList();
	hideCreateDeckCardListHeader();
}


// ===== Event Listeners =====
addCardBtn.addEventListener('click', addCard);
createDeckBtn.addEventListener('click', createDeck);





// ============================
// ===== Edit Deck Menu =======
// ============================

// ===== Elements =====
const sectionEditDeckTitle = document.getElementById('section-edit__deck-title');
const editDeckTitleInput = document.getElementById('edit-deck-title-input');
const editCardIndexInput = document.getElementById('edit-card-index-input');
const editCardQuestionInput = document.getElementById('edit-card-question-input');
const editCardAnswerInput = document.getElementById('edit-card-answer-input');
const editCardList = document.getElementById('edit-card-list');


// ===== Functions =====

const setEditDeckTitle = () => sectionEditDeckTitle.textContent = selectEditMenu.value;

const editDeckTitle = () => editDeckTitleInput.value = selectEditMenu.value;

const editCardIndex = () => {

}

const editCardQuestion = () => {

}

const editCardAnswer = () => {

}

const populateEditDeckCardList = () => {
	editCardList.innerHTML = '';
	const selectedDeck = decks.find(deck => deck.topic === selectEditMenu.value);

	selectedDeck.cards.forEach((card, index) => {
		const cardLi = document.createElement('li');
		cardLi.innerHTML = 
		`
			<span>${index + 1}</span>
			<span>${card.question}</span>
			<span>${card.answer}</span>
			<span id="edit-deck-delete-card-btn" class="edit-deck-delete-card-btn">
				<i class="fa-solid fa-xmark"></i>
			</span>
		`
		editCardList.appendChild(cardLi);
	});
};

const editDeckDeleteCard = (e) => {
	const selectedDeck = decks.find(deck => deck.topic === sectionEditDeckTitle.textContent);
	console.log(selectedDeck);
	if (e.target.parentElement.classList.contains('edit-deck-delete-card-btn')) {
		const cardLi = e.target.parentElement.parentElement;
		const targetCardIndex = cardLi.firstElementChild.textContent;
		cardLi.remove();
		// selectedDeck.cards.splice(targetCardIndex - 1, 1);
		console.log(selectedDeck);
	};

	if (e.target.parentElement.classList.contains('edit-deck__save-btn')) {
		e.target.addEventListener('click', (e) => {
			// updateDecks(selectEditMenu.value, selectedDeck);
			// updateLS();
			resetEditDeckSection();
		})
	};
};

const editDeckEditCard = () => {
	
}

// const updateDecks = (topic, newDeck) => {
// 	decks.forEach(deck => {
// 		if (deck.topic === topic) {
// 			deck = newDeck
// 			console.log(deck);
// 		};
// 	});
// };


const updateLS = () => {
	localStorage.setItem('decks', JSON.stringify(decks));

};


const resetEditDeckSection = () => {
	sectionEditDeckTitle.textContent = '';
	editDeckTitleInput.value = '';
	editCardIndexInput.value = '';
	editCardQuestionInput.value = '';
	editCardAnswerInput.value = '';
	editCardList.innerHTML = '';
}

// ===== Event Listeners =====
editCardList.addEventListener('click', editDeckDeleteCard);



// ==========================
// ===== Practice Deck  =====
// ==========================
let currentDeckData = [];
let currentDeckHtml = [];
let currentCardNumber = 0;


// ===== Elements =====
const sectionPracticeDeckTitle = document.getElementById('section-practice__deck-title');
const cardsContainer = document.getElementById('cards-container');
const prevCardBtn = document.getElementById('prev-card-btn');
const nextCardBtn = document.getElementById('next-card-btn');
const cardProgressText = document.getElementById('card-progress-text');


// ===== Functions =====
const setPracticeDeck = () => {
	currentDeckData = decks.find(deck => deck.topic === (selectPracticeMenu.value));
}

const setPracticeDeckTitle = () => sectionPracticeDeckTitle.textContent = selectPracticeMenu.value;

const createCards = () => {
	cardsContainer.innerHTML = '';
	currentDeckData.cards.forEach((data, index) => createCard(data, index));
} 

const createCard = (data, index) => {
	const card = document.createElement('div');
	card.id = "card-outer";
	card.className = "card-outer right";
	index === 0 && card.classList.add('current-card');

	card.innerHTML = 
	`
		<div class="card-inner">
			<div class="card-inner--front">
				<p>${data.question}</p>
			</div>
			<div class="card-inner--back">
				<p>${data.answer}</p>
			</div>
		</div>
	`;

	currentDeckHtml.push(card);
	cardsContainer.appendChild(card);
	card.addEventListener('click', () => card.classList.toggle('flip'));
};

const showPreviousCard = () => {
	currentDeckHtml[currentCardNumber].className = 'card-outer right';
	currentCardNumber -= 1;
	if (currentCardNumber < 0) {
		currentCardNumber = 0;
	}
	currentDeckHtml[currentCardNumber].className = 'card-outer current-card';
	setCardProgressText();
};

const showNextCard = () => {
	currentDeckHtml[currentCardNumber].className = 'card-outer left';
	currentCardNumber += 1;
	if (currentCardNumber < currentDeckHtml.length -1) {
		currentDeckHtml[currentCardNumber + 1].className = 'card-outer right';
	}
	if (currentCardNumber > currentDeckHtml.length - 1) {
		currentCardNumber = currentDeckHtml.length - 1;
	}
	currentDeckHtml[currentCardNumber].className = 'card-outer current-card';
	setCardProgressText();
};

const setCardProgressText = () => {
	cardProgressText.textContent = `${currentCardNumber + 1} / ${currentDeckHtml.length}`;
}

const resetPracticeDeckSection = () => {
	sectionPracticeDeckTitle.textContent = '';
	currentDeckData = [];
	currentDeckHtml = [];
	currentCardNumber = 0;
	cardsContainer.innerHTML = '';
}

const exitPracticeDeckSection = () => {
}

// ===== Event Listeners =====
prevCardBtn.addEventListener('click', showPreviousCard);
nextCardBtn.addEventListener('click', showNextCard);





// ======================
// ===== Initialize =====
// ======================

const initialize = () => {
	// populateSelectPracticeMenu();
	// populateSelectEditMenu();

	populateSectionMainMenus();
}

window.addEventListener('DOMContentLoaded', initialize);