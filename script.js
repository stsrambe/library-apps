document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const books = [];
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-app';
const STORAGE_KEY = 'APP_BOOKS'; 

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === 'undefined') {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function addBook() {
  const title = document.getElementById('BookTitle').value;
  const author = document.getElementById('BookAuthor').value;
  const year = document.getElementById('BookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return Date.now();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  for (const book of books) {
    const bookElement = makeBook(book);
    if (book.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement);
    }
  }
});

document.addEventListener(RENDER_EVENT, function () {
  console.clear();

  console.log('Belum selesai dibaca:');
  for (const book of books.filter((book) => !book.isComplete)) {
    console.log(`${book.title} - ${book.author} (${book.year})`);
  }

  console.log('\nSelesai dibaca:');
  for (const book of books.filter((book) => book.isComplete)) {
    console.log(`${book.title} - ${book.author} (${book.year})`);
  }
});

function makeBook(bookObject) {
  const titleElement = document.createElement('h3');
  titleElement.innerText = bookObject.title;

  const authorElement = document.createElement('p');
  authorElement.innerText = 'Author: ' + bookObject.author;

  const yearElement = document.createElement('p');
  yearElement.innerText = 'Tahun: ' + bookObject.year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(titleElement, authorElement, yearElement);

  const container = document.createElement('article');
  container.classList.add('book_item', 'shadow');
  container.append(textContainer);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus buku';
  deleteButton.classList.add('red');
  deleteButton.addEventListener('click', function () {
    removeBook(bookObject.id);
  });

  actionContainer.append(deleteButton);

  if (bookObject.isComplete) {
    const undoButton = document.createElement('button');
    undoButton.innerText = 'Belum selesai di Baca';
    undoButton.classList.add('green');
    undoButton.addEventListener('click', function () {
      markAsIncomplete(bookObject.id);
    });

    actionContainer.append(undoButton);
  } else {
    const completeButton = document.createElement('button');
    completeButton.innerText = 'Selesai dibaca';
    completeButton.classList.add('green');
    completeButton.addEventListener('click', function () {
      markAsComplete(bookObject.id);
    });

    actionContainer.append(completeButton);
  }

  container.append(actionContainer);

  return container;
}

function removeBook(bookId) {
  books.splice(
    books.findIndex((book) => book.id === bookId),
    1
  );
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function markAsComplete(bookId) {
  const book = books.find((book) => book.id === bookId);
  book.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function markAsIncomplete(bookId) {
  const book = books.find((book) => book.id === bookId);
  book.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
