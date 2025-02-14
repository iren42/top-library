const myLibrary = [];

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

function addBookToLibrary(library, book)
{
    // take params, create a book then store it in the array
    if (Array.isArray(library))
        library.push(book);
}

let thehobbit = new Book("The Hobbit", "Tolkien", 430, true);
let thelightshop = new Book("The Light Shop", "IDK", 230, false);

addBookToLibrary(myLibrary, thehobbit);
addBookToLibrary(myLibrary, thelightshop);

function displayLibrary()
{
    for (const key in myLibrary)
    {
        if (Object.prototype.hasOwnProperty.call(myLibrary, key))
        {
            const element = myLibrary[key];
            console.log(element);
        }
    }
}

const dialog = document.querySelector("dialog");
const showButton = document.querySelector("#showDialog");
const closeButton = document.querySelector("button[value='cancel']");
const form = document.querySelector("#book_form");
const addButton = document.querySelector("button[type='submit']");

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () =>
{
    dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () =>
{
    dialog.close();
});

form.addEventListener("submit", event =>
{
    event.preventDefault();
    getData(form);
});

function getData(form)
{
    var formData = new FormData(form);

    for (var pair of formData.entries())
    {
        console.log(pair[0] + ": " + pair[1]);
    }

    console.log(Object.fromEntries(formData));
}