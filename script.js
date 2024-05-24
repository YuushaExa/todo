document.addEventListener('DOMContentLoaded', () => {
    const addNoteButtons = document.querySelectorAll('.add-note');
    const columns = document.querySelectorAll('.column');

    // Load notes from local storage
    loadNotes();

    addNoteButtons.forEach(button => {
        button.addEventListener('click', addNote);
    });

    columns.forEach(column => {
        column.addEventListener('dragover', allowDrop);
        column.addEventListener('drop', drop);
    });
});

function loadNotes() {
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        const columnName = column.getAttribute('data-column');
        const notes = JSON.parse(localStorage.getItem(columnName) || '[]');
        notes.forEach(noteContent => {
            const note = createNoteElement(noteContent);
            column.insertBefore(note, column.querySelector('.add-note'));
        });
    });
}

function saveNotes() {
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        const columnName = column.getAttribute('data-column');
        const notes = Array.from(column.querySelectorAll('.note')).map(note => note.textContent.replace('Delete', '').trim());
        localStorage.setItem(columnName, JSON.stringify(notes));
    });
}

function createNoteElement(content) {
    const note = document.createElement('div');
    note.classList.add('note');
    note.setAttribute('draggable', 'true');
    note.addEventListener('dragstart', drag);

    const noteText = document.createElement('span');
    noteText.textContent = content;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-note');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', deleteNote);

    note.appendChild(noteText);
    note.appendChild(deleteButton);
    return note;
}

function addNote() {
    const column = this.parentElement;
    const newNote = createNoteElement('New Note');
    column.insertBefore(newNote, this);
    saveNotes();
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData('text/plain', event.target.innerHTML);
    event.target.classList.add('dragging');
}

function drop(event) {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    if (draggingElement) {
        draggingElement.classList.remove('dragging');
        event.target.closest('.column').insertBefore(draggingElement, event.target.closest('.column').querySelector('.add-note'));
        saveNotes();
    }
}

function deleteNote() {
    const note = this.parentElement;
    note.parentElement.removeChild(note);
    saveNotes();
}