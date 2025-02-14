const myLibrary = [];
const bookStatus = ["read", "currently_reading", "to_read"];

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
    if (this.read)
        return (this.title + " by " + this.author + ", " + this.nb_pages + " has been read");
    return (this.title + " by " + this.author + ", " + this.nb_pages + " has not been read yet");
}

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () =>
{
    dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () =>
{
    clearInputForm();
    dialog.close();
});

form.addEventListener("submit", event =>
{
    event.preventDefault();
    let newBook = getData(form);
    addBookToLibrary(myLibrary, newBook);
    clearInputForm();
    dialog.close();
});

function addBookToLibrary(library, book)
{
    // take params, create a book then store it in the array
    if (!Array.isArray(library))
        return ;
    library.push(book);
    addBookToDOM(book);
}

function addBookToDOM(book)
{
    const domEl = document.createElement("div");
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
}

let thehobbit = new Book("The Hobbit", "Tolkien", 430, bookStatus[0]);
let thelightshop = new Book("The Light Shop", "IDK", 230, bookStatus[1]);

addBookToLibrary(myLibrary, thehobbit);
addBookToLibrary(myLibrary, thelightshop);

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

function clearInputForm(){
    document.querySelector("#book_form").reset();
}

function getData(form)
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