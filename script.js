const myLibrary = [];
const bookStatus = ["to_read", "currently_reading", "read"];

const dialog = document.querySelector("dialog");
const showButton = document.querySelector("#showDialog");
const closeButton = document.querySelector("button[value='close']");
const form = document.querySelector("#book_form");
const library = document.querySelector("#library");

function Book(title, author, nb_pages, status)
{
    // the constructor...
    this.title = title;
    this.author = author;
    this.nb_pages = nb_pages;
    this.status = status;
}

Book.prototype.info = function ()
{
    if (this.read == bookStatus[2])
        return (this.title + " by " + this.author + ", " + this.nb_pages + " has been read");
    else if (this.read === bookStatus[0])
        return (this.title + " by " + this.author + ", " + this.nb_pages + " has not been read yet");
    else
        return (this.title + " by " + this.author + ", " + this.nb_pages + " currently reading");
}

Book.prototype.setStatus = function (newStatus)
{
    this.status = newStatus;
}

showButton.addEventListener("click", () =>
{
    dialog.showModal();
});

closeButton.addEventListener("click", (event) =>
{
    event.preventDefault();
    clearInputForm();
    dialog.close();
});

form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    let newBook = createBookFromForm(form);
    addBookToLibrary(myLibrary, newBook);
    clearInputForm();
    dialog.close();
});

// event delegation for dynamically created elements
document.addEventListener("click", (event) =>
{
    if (event.target.classList.contains("delete"))
    {
        let index = Number(event.target.classList[1]);
        myLibrary.splice(index, 1);
        event.target.parentElement.remove();
        replaceIndexes();
    }
})

document.addEventListener("submit", (event) =>
{
    if (event.target.classList.contains("update_status"))
    {
        event.preventDefault();
        updateStatus(event.target);
    }
})

function updateStatus(form)
{
    let formData = new FormData(form);
    let newStatus = "";

    for (let pair of formData.entries())
    {
        // console.log(pair[0] + ": " + pair[1]);
        newStatus = pair[1];
    }
    // update DOM
    let oldStatus = form.parentElement.querySelector("span.status");
    oldStatus.textContent = newStatus;

    // update myLibrary array
    let index = Number(form.parentElement.querySelector(".delete").classList[1]);
    myLibrary.at(index).setStatus(newStatus);
}

function replaceIndexes()
{
    let index = 0;
    let indexList = document.querySelectorAll(".delete");
    for (const key in indexList)
    {
        if (Object.prototype.hasOwnProperty.call(indexList, key))
        {
            const element = indexList[key];
            if (element.classList[1] != index)
                element.classList.replace(element.classList[1], index);
            index++;
        }
    }
}

function addBookToLibrary(library, book)
{
    if (!Array.isArray(library))
        return;
    library.push(book);
    addBookToDOM(book);
}

function addBookToDOM(book)
{
    const domEl = document.createElement("div");
    domEl.classList.add("book");

    let buffer = [];
    for (const property in book)
    {
        if (Object.prototype.hasOwnProperty.call(book, property)) 
        {
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

    if (domEl.textContent !== "")
        document.querySelector("#library").append(domEl);
    createDeleteBookButton(domEl);
    createChangeStatusButton(domEl, book.status);
}

let thehobbit = new Book("The Hobbit", "Tolkien", 430, bookStatus[0]);
let thelightshop = new Book("The Light Shop", "IDK", 230, bookStatus[1]);
let misaeng = new Book("Misaeng", "IDK", 21, bookStatus[1]);

addBookToLibrary(myLibrary, thehobbit);
addBookToLibrary(myLibrary, thelightshop);
addBookToLibrary(myLibrary, misaeng);

function clearInputForm()
{
    document.querySelector("#book_form").reset();
}

function createBookFromForm(form)
{
    let formData = new FormData(form);
    let buffer = [];

    for (let pair of formData.entries())
    {
        // console.log(pair[0] + ": " + pair[1]);
        buffer.push(pair[1]);
    }
    let newBook = new Book(buffer[0], buffer[1], Number(buffer[2]), buffer[3]);
    return (newBook);
}

function createDeleteBookButton(parent)
{
    const btn = document.createElement("button");
    btn.classList.add("delete");

    // add index number as a class
    if (myLibrary.length < 1)
        return;
    btn.classList.add(myLibrary.length - 1);

    btn.textContent = "delete";
    parent.append(btn);
}

function createChangeStatusButton(parent, status)
{
    const form = document.createElement("form");
    form.classList.add("update_status");
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = "Status:"

    const div1 = document.createElement("div");
    const readInput = document.createElement("input");
    readInput.setAttribute("type", "radio");
    readInput.setAttribute("name", "status");
    readInput.setAttribute("value", bookStatus[2]);
    if (status === bookStatus[2])
        readInput.checked = true;

    const readLabel = document.createElement("label");
    readLabel.setAttribute("for", "read");
    readLabel.textContent = "Read";

    const div2 = document.createElement("div");
    const currently_readingInput = document.createElement("input");
    currently_readingInput.setAttribute("type", "radio");
    currently_readingInput.setAttribute("name", "status");
    currently_readingInput.setAttribute("value", bookStatus[1]);
    if (status === bookStatus[1])
        currently_readingInput.checked = true;

    const currently_readingLabel = document.createElement("label");
    currently_readingLabel.setAttribute("for", "currently_reading");
    currently_readingLabel.textContent = "Currently reading";

    const div3 = document.createElement("div");
    const to_readInput = document.createElement("input");
    to_readInput.setAttribute("type", "radio");
    to_readInput.setAttribute("name", "status");
    to_readInput.setAttribute("value", bookStatus[0]);
    if (status === bookStatus[0])
        to_readInput.checked = true;

    const to_readLabel = document.createElement("label");
    to_readLabel.setAttribute("for", "to_read");
    to_readLabel.textContent = "To read";

    const update = document.createElement("button");
    update.setAttribute("type", "submit");
    update.classList.add("update");
    update.textContent = "update status";

    parent.append(form);
    form.append(fieldset, update);
    fieldset.append(legend, div3, div2, div1);
    div1.append(readInput, readLabel);
    div2.append(currently_readingInput, currently_readingLabel);
    div3.append(to_readInput, to_readLabel);
}