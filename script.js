const myLibrary = [];
const bookStatus = ["to_read", "currently_reading", "read"];

const dialog = document.querySelector("dialog");
const showButton = document.querySelector("#showDialog");
const closeButton = document.querySelector("button[value='close']");
const form = document.querySelector("#book_form");
const library = document.querySelector("#library");

function Book(title, author, nb_pages, read)
{
    // the constructor...
    this.title = title;
    this.author = author;
    this.nb_pages = nb_pages;
    this.read = read;
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
    let newBook = createBook(form);
    addBookToLibrary(myLibrary, newBook);
    clearInputForm();
    dialog.close();
});

document.addEventListener("click", (event) =>
{
    if (event.target.classList.contains("delete"))
    {
        // console.log(event.target.parentElement);
        let index = Number(event.target.classList[1]);
        myLibrary.splice(index, 1);
        event.target.parentElement.remove();
        replaceIndexes();
        console.table(myLibrary);
    }
})

function replaceIndexes()
{
    let index = 0;
    let deleteBtnList = document.querySelectorAll(".delete");
    for (const key in deleteBtnList)
    {
        if (Object.prototype.hasOwnProperty.call(deleteBtnList, key))
        {
            const element = deleteBtnList[key];
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
    for (const property in book)
    {
        if (Object.prototype.hasOwnProperty.call(book, property)) 
        {
            const element = book[property];
            domEl.textContent += element + " ";
        }
    }
    if (domEl.textContent !== "")
        document.querySelector("#library").append(domEl);
    createDeleteBookButton(domEl);
    createChangeStatusButton(domEl);
}

let thehobbit = new Book("The Hobbit", "Tolkien", 430, bookStatus[0]);
let thelightshop = new Book("The Light Shop", "IDK", 230, bookStatus[1]);
let misaeng = new Book("Misaeng", "IDK", 21, bookStatus[1]);

addBookToLibrary(myLibrary, thehobbit);
addBookToLibrary(myLibrary, thelightshop);
addBookToLibrary(myLibrary, misaeng);

// function displayLibrary()
// {
//     for (const book in myLibrary)
//     {
//         if (Object.prototype.hasOwnProperty.call(myLibrary, book))
//         {
//             const aBook = myLibrary[book];
//             console.log(book);
//             displayBook(aBook);
//         }
//     }
// }

function clearInputForm()
{
    document.querySelector("#book_form").reset();
}

function createBook(form)
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
    if (myLibrary.length < 1)
        return;
    btn.classList.add(myLibrary.length - 1);
    btn.textContent = "delete";
    parent.append(btn);
}

function createChangeStatusButton(parent)
{
    const form = document.createElement("form");
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = "Status:"

    const div1 = document.createElement("div");
    const readInput = document.createElement("input");
    readInput.setAttribute("type", "radio");
    readInput.setAttribute("name", "status");
    readInput.setAttribute("value", bookStatus[2]);

    const readLabel = document.createElement("label");
    readLabel.setAttribute("for", "read");
    readLabel.textContent = "Read";

    const div2 = document.createElement("div");
    const currently_readingInput = document.createElement("input");
    currently_readingInput.setAttribute("type", "radio");
    currently_readingInput.setAttribute("name", "status");
    currently_readingInput.setAttribute("value", bookStatus[1]);

    const currently_readingLabel = document.createElement("label");
    currently_readingLabel.setAttribute("for", "currently_reading");
    currently_readingLabel.textContent = "currently reading";

    const div3 = document.createElement("div");
    const to_readInput = document.createElement("input");
    to_readInput.setAttribute("type", "radio");
    to_readInput.setAttribute("name", "status");
    to_readInput.setAttribute("value", bookStatus[0]);

    const to_readLabel = document.createElement("label");
    to_readLabel.setAttribute("for", "to_read");
    to_readLabel.textContent = "to read";

    const update = document.createElement("button");
    update.setAttribute("type", "button");
    update.textContent = "update status";

    parent.append(form);
    form.append(fieldset, update);
    fieldset.append(legend, div1, div2, div3);
    div1.append(readLabel, readInput);
    div2.append(currently_readingLabel, currently_readingInput);
    div3.append(to_readLabel, to_readInput);
}