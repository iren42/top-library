class Book {
	// the constructor...
	constructor(title, author, nb_pages, status) {
		this._title = title;
		this._author = author;
		this._nb_pages = nb_pages;
		this._status = status;
	}

	get status() {
		return (this._status);
	}

	set status(newStatus) {
		if (BOOKSTATUS.indexOf(newStatus) !== -1)
			this._status = newStatus;
	}

	info() {
		if (this._status == BOOKSTATUS[2])
			return (this._title + " by " + this._author + ", " + this._nb_pages + " has been read");
		else if (this._status === BOOKSTATUS[0])
			return (this._title + " by " + this._author + ", " + this._nb_pages + " has not been read yet");
		else
			return (this._title + " by " + this._author + ", " + this._nb_pages + " currently reading");
	}
}

const BOOKSTATUS = ["to_read", "currently_reading", "read"];
const myLibrary = [];

function addBookToLibrary(book) {
	myLibrary.push(book);
}

function removeBookToLibrary(index) {
	myLibrary.splice(index, 1);
}

function updateBookStatus(form) {
	let formData = new FormData(form);
	let newStatus = "";

	for (let pair of formData.entries()) {
		// console.log(pair[0] + ": " + pair[1]);
		newStatus = pair[1];
	}

	// update myLibrary array
	let index = Number(form.parentElement.querySelector(".delete").classList[1]);
	const bookToModify = myLibrary.at(index);
	bookToModify.status = newStatus;
}

const DOMController = (function() {

	function createBookDiv(book, index) {
		const domEl = document.createElement("div");
		domEl.classList.add("book");

		let buffer = [];
		for (const property in book) {
			if (Object.prototype.hasOwnProperty.call(book, property)) {
				buffer.push(book[property]);
			}
		}
		const p = document.createElement("p");

		const span = document.createElement("span");
		span.classList.add("title");
		span.textContent = buffer.shift();

		const span1 = document.createElement("span");
		span1.classList.add("author");
		span1.textContent = buffer.shift();

		const span2 = document.createElement("span")
		span2.classList.add("nb_pages");
		span2.textContent = buffer.shift();

		const span3 = document.createElement("span")
		span3.classList.add("status");
		span3.textContent = buffer.shift();

		p.append(span, " ", span1, " ", span2, " ", span3);
		domEl.append(p);

		domEl.append(createDeleteBookButton(index));
		domEl.append(createChangeStatusButton(book.status));

		return (domEl);
	}

	function updateScreen() {

		const div = document.querySelector("#library");
		div.innerHTML = "";

		for (const [i, book] of myLibrary.entries()) {
			div.append(createBookDiv(book, i));
		}
	}

	function createDeleteBookButton(index) {
		const btn = document.createElement("button");
		btn.classList.add("delete");

		// add book index number in the library as a class
		btn.classList.add(index);

		btn.textContent = "delete";
		return (btn);
	}

	function createChangeStatusButton(status) {
		const form = document.createElement("form");
		form.classList.add("update_status");
		const fieldset = document.createElement("fieldset");
		const legend = document.createElement("legend");
		legend.textContent = "Status:"

		const div1 = document.createElement("div");
		const readInput = document.createElement("input");
		readInput.setAttribute("type", "radio");
		readInput.setAttribute("name", "status");
		readInput.setAttribute("value", BOOKSTATUS[2]);
		if (status === BOOKSTATUS[2])
			readInput.checked = true;

		const readLabel = document.createElement("label");
		readLabel.setAttribute("for", "read");
		readLabel.textContent = "Read";

		const div2 = document.createElement("div");
		const currently_readingInput = document.createElement("input");
		currently_readingInput.setAttribute("type", "radio");
		currently_readingInput.setAttribute("name", "status");
		currently_readingInput.setAttribute("value", BOOKSTATUS[1]);
		if (status === BOOKSTATUS[1])
			currently_readingInput.checked = true;

		const currently_readingLabel = document.createElement("label");
		currently_readingLabel.setAttribute("for", "currently_reading");
		currently_readingLabel.textContent = "Currently reading";

		const div3 = document.createElement("div");
		const to_readInput = document.createElement("input");
		to_readInput.setAttribute("type", "radio");
		to_readInput.setAttribute("name", "status");
		to_readInput.setAttribute("value", BOOKSTATUS[0]);
		if (status === BOOKSTATUS[0])
			to_readInput.checked = true;

		const to_readLabel = document.createElement("label");
		to_readLabel.setAttribute("for", "to_read");
		to_readLabel.textContent = "To read";

		const update = document.createElement("button");
		update.setAttribute("type", "submit");
		update.classList.add("update");
		update.textContent = "update status";

		form.append(fieldset, update);
		fieldset.append(legend, div3, div2, div1);
		div1.append(readInput, readLabel);
		div2.append(currently_readingInput, currently_readingLabel);
		div3.append(to_readInput, to_readLabel);

		return (form);
	}

	function clearInputForm() {
		const form = document.querySelector("#book_form");
		if (form)
			form.reset();
	}

	function createBookFromForm(form) {
		let formData = new FormData(form);
		let buffer = [];

		for (let pair of formData.entries()) {
			// console.log(pair[0] + ": " + pair[1]);
			buffer.push(pair[1]);
		}
		let newBook = new Book(buffer[0], buffer[1], Number(buffer[2]), buffer[3]);
		return (newBook);
	}

	const showButton = document.querySelector("#showDialog");
	if (!showButton)
		throw new Error("No show dialog button");
	showButton.addEventListener("click", () => {
		const dialog = document.querySelector("dialog");
		if (dialog)
			dialog.showModal();
	});

	const closeButton = document.querySelector("button[value='close']");
	if (!closeButton)
		throw new Error("No show dialog button");
	closeButton.addEventListener("click", (event) => {
		event.preventDefault();
		clearInputForm();
		const dialog = document.querySelector("dialog");
		if (dialog)
			dialog.close();
	});

	const form = document.querySelector("#book_form");
	if (!form)
		throw new Error("No book form");
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		let newBook = createBookFromForm(form);
		if (newBook)
			addBookToLibrary(newBook);
		clearInputForm();
		const dialog = document.querySelector("dialog");
		if (dialog)
			dialog.close();
		updateScreen();
	});

	// event delegation for dynamically created elements
	document.addEventListener("click", (event) => {
		if (event.target.classList.contains("delete")) {
			let index = Number(event.target.classList[1]);
			removeBookToLibrary(index);
			updateScreen();
		}
	})

	document.addEventListener("submit", (event) => {
		if (event.target.classList.contains("update_status")) {
			event.preventDefault();
			updateBookStatus(event.target);
			updateScreen();
		}
	})


	return ({
		updateScreen,
	});
})();

const thehobbit = new Book("The Hobbit", "Tolkien", 430, BOOKSTATUS[0]);
const thelightshop = new Book("The Light Shop", "IDK", 230, BOOKSTATUS[1]);
const misaeng = new Book("Misaeng", "IDK", 21, BOOKSTATUS[1]);

addBookToLibrary(thehobbit);
addBookToLibrary(thelightshop);
addBookToLibrary(misaeng);

DOMController.updateScreen();
