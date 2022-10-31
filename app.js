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

const updateDecksFromLS = () => decks = getDecksFromLS();


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
				updateDecksFromLS();
			} else  if (sectionBtn.id === 'exit-practice-deck-section-btn') {
				resetPracticeDeckSection();
			}
		};
	});
};

const capitalize = (string) => string[0].toUpperCase().concat(string.slice(1).toLowerCase());

const truncateString = (string) => string.length > 20 ? string.substring(0, 20) + '...' : string;

// ===== Event Listeners =====
exitSectionBtns.forEach(btn => btn.addEventListener('click', exitSection));





// =====================
// ===== Main Menu =====
// =====================

let decks = getDecksFromLS();

// ===== Elements =====
const sectionMainMenus = document.querySelectorAll('.section-main select');
const selectPracticeMenu = document.getElementById("select-practice__menu");
const selectEditMenu = document.getElementById("select-edit__menu");
const selectDeleteMenu = document.getElementById('select-delete__menu');
const selectEditBtn = document.getElementById("select-edit__btn");
const selectPracticeBtn = document.getElementById("select-practice__btn");
const inputCreateText = document.getElementById("input-create__text");
const inputCreateBtn = document.getElementById("input-create__btn");
const selectDeleteBtn = document.getElementById('select-delete__btn');


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
	selectDeleteMenu.selectedIndex = 0;
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
	setSelectedEditDeckTopic();
	setEditDeckTitle();
	setEditDeckTitleInput();
	disableCardEditInputFields();
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

const deleteDeck = (e) => {
	e.preventDefault();
	const selectedDeck = decks.find(deck => deck.topic === selectDeleteMenu.value)
	const removeDeckIndex = decks.indexOf(selectedDeck);
	decks.splice(removeDeckIndex, 1);
	updateLS();
	populateSectionMainMenus();
	clearMainMenuInputFields();
}

const populateSectionMainMenus = () => {	
	sectionMainMenus.forEach(menu => {
		Array.from(menu.children).forEach((option, index) => {
			index >= 1 && menu.removeChild(option);
		});

		if (localStorage.getItem('decks') === null) return;
			JSON.parse(localStorage.getItem('decks')).forEach(deck => {
			const option = document.createElement('option');
			const topic = deck.topic;
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
selectDeleteBtn.addEventListener('click', deleteDeck);




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

const storeNewDeckTitle = () => newDeckTitle = inputCreateText.value;

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
		<span title="${capitalize(question)}">${truncateString(capitalize(question))}</span>
		<span title="${capitalize(answer)}">${truncateString(capitalize(answer))}<span>
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

let selectedEditDeckTopic;
let selectedEditCardIndex;
let previousEditCardQuestionInput;
let previousEditCardAnswerInput;

// ===== Elements =====
const sectionEditDeckTitle = document.getElementById('section-edit__deck-title');
const editDeckTitleInput = document.getElementById('edit-deck-title-input');
const editCardIndexInput = document.getElementById('edit-card-index-input');
const editCardQuestionInput = document.getElementById('edit-card-question-input');
const editCardAnswerInput = document.getElementById('edit-card-answer-input');
const editCardList = document.getElementById('edit-card-list');
const editDeckSaveBtn = document.getElementById('edit-deck__save-btn');


// ===== Functions =====

const setSelectedEditDeckTopic = () => selectedEditDeckTopic = selectEditMenu.value;
const setEditDeckTitle = () => sectionEditDeckTitle.textContent = capitalize(selectedEditDeckTopic);
const setEditDeckTitleInput = () => editDeckTitleInput.value = selectedEditDeckTopic
const getSelectedDeck = () => decks.find(deck => deck.topic === selectedEditDeckTopic);

const editDeckEditCard = (e) => {
	if (e.target.parentElement.classList.contains('edit-deck-edit-card-btn')) {
		Array.from(editCardList.children).forEach(li => li.classList.remove('editing-card'));
		const cardLi = e.target.parentElement.parentElement;
		cardLi.classList.add('editing-card');
		const cardLiChildren = Array.from(cardLi.children);
		selectedEditCardIndex = cardLiChildren[0].textContent - 1;

		const selectedEditCard = getSelectedDeck().cards[selectedEditCardIndex];

		editCardQuestionInput.value = selectedEditCard.question;
		editCardAnswerInput.value = selectedEditCard.answer;

		previousEditCardQuestionInput = editCardQuestionInput.value;
		previousEditCardAnswerInput = editCardAnswerInput.value;
		enableCardEditInputFields();
	};
};

const disableCardEditInputFields = () => {
	editCardQuestionInput.disabled = true;
	editCardAnswerInput.disabled = true;
};

const enableCardEditInputFields = () => {
	editCardQuestionInput.disabled = false;
	editCardAnswerInput.disabled = false;
};

const editDeckTitle = (e) => {
	sectionEditDeckTitle.textContent = capitalize(editDeckTitleInput.value);

	e.target.addEventListener('focusout', (e) => {
		if (e.target.value === '') {
			sectionEditDeckTitle.textContent = selectedEditDeckTopic;
			editDeckTitleInput.value = selectedEditDeckTopic;
		};
	});
};

const editCardQuestion = (e) => {
	e.target.addEventListener('focusout', (e) => {
		e.target.value === '' && (editCardQuestionInput.value = previousEditCardQuestionInput);
	});

	e.target.value !== '' && (previousEditCardQuestionInput = editCardQuestionInput.value);

	Array.from(editCardList.children).forEach(li => {
		if (li.classList.contains('editing-card')) {
			Array.from(li.children)[1].textContent = truncateString(capitalize(previousEditCardQuestionInput));
		};
	});

};


const editCardAnswer = (e) => {
	
	e.target.addEventListener('focusout', (e) => {
		e.target.value === '' && (editCardAnswerInput.value = capitalize(previousEditCardAnswerInput));
	});

	e.target.value !== '' && (previousEditCardAnswerInput = capitalize(editCardAnswerInput.value));
	
	Array.from(editCardList.children).forEach(li => {
		if (li.classList.contains('editing-card')) {
			Array.from(li.children)[2].textContent = truncateString(previousEditCardAnswerInput);
		};
	});

};

const saveEditDeckTitle = () => getSelectedDeck().topic = editDeckTitleInput.value;


const saveEditDeckCard = () => {
	if (!selectedEditCardIndex) return;
	const editingCardData = getSelectedDeck().cards[selectedEditCardIndex];
	console.log(getSelectedDeck().cards);
	console.log(selectedEditCardIndex);
	editingCardData.question = editCardQuestionInput.value;
	editingCardData.answer = editCardAnswerInput.value;
};

const populateEditDeckCardList = () => {
	editCardList.innerHTML = '';
	getSelectedDeck().cards.forEach((card, index) => {
		const cardLi = document.createElement('li');
		cardLi.className = 'card';
		cardLi.innerHTML = 
		`
			<span>${index + 1}</span>
			<span title="${capitalize(card.question)}">${truncateString(capitalize(card.question))}</span>
			<span title="${capitalize(card.answer)}">${truncateString(capitalize(card.answer))}</span>
			<span id="edit-deck-edit-card-btn" class="edit-deck-edit-card-btn">
				<i class="fa-solid fa-pen-to-square"></i>
			</span>
			<span id="edit-deck-delete-card-btn" class="edit-deck-delete-card-btn">
				<i class="fa-solid fa-xmark"></i>
			</span>
		`
		editCardList.appendChild(cardLi);
	});
};


const updateCardIndex = () => {
	Array.from(editCardList.children).forEach((card, index) => {
		card.firstElementChild.textContent = index + 1;
	});
};

const editDeckDeleteCard = (e) => {
	if (e.target.parentElement.classList.contains('edit-deck-delete-card-btn')) {
		const cardLi = e.target.parentElement.parentElement;
		const targetCardIndex = cardLi.firstElementChild.textContent;
		cardLi.remove();
		getSelectedDeck().cards.splice(targetCardIndex - 1, 1);
		updateCardIndex();
	};
};

const updateLS = () => {
	localStorage.setItem('decks', JSON.stringify(decks));
};

const resetEditDeckSection = () => {
	sectionEditDeckTitle.textContent = '';
	editDeckTitleInput.value = '';
	editCardQuestionInput.value = '';
	editCardAnswerInput.value = '';
	editCardList.innerHTML = '';
}

const editDeckSaveChanges = () => {
	saveEditDeckTitle();
	saveEditDeckCard();
	updateLS();
	returnToMainMenu();
	resetEditDeckSection();
	populateSectionMainMenus();
};

// ===== Event Listeners =====
editCardList.addEventListener('click', (e) => {
	editDeckDeleteCard(e);
	editDeckEditCard(e);
});
editDeckSaveBtn.addEventListener('click', editDeckSaveChanges);
editDeckTitleInput.addEventListener('input', editDeckTitle);
editCardQuestionInput.addEventListener('input', editCardQuestion);
editCardAnswerInput.addEventListener('input', editCardAnswer);




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