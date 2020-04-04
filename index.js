const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $editNoteBtn = $(".edit-note");
const $noteList = $(".list-container .list-group");


const activeNote = {};


const getNotes = function() {
    return $.ajax({
        url: "/api/notes",
        method: "GET"
    });
};

// A function for saving a note to the db
const saveNote = function(note) {
    return $.ajax({
        url: "/api/notes",
        data: note,
        method: "POST"
    });
};


const deleteNote = function(id) {
    return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE"
    });
};


const renderActiveNote = function() {
    $saveNoteBtn.hide();
    if (activeNote.id || activeNote.id === 0) {
        $editNoteBtn.show();
        $noteTitle.attr("readonly", true);
        $noteText.attr("readonly", true);
        $noteTitle.val(activeNote.title);
        $noteText.val(activeNote.text);
    } else {
        $noteTitle.attr("readonly", false);
        $noteText.attr("readonly", false);
        $noteTitle.val("");
        $noteText.val("");
    }
};

const handleNoteEdit = function() {
    $editNoteBtn.hide();
    $saveNoteBtn.show();
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
}


const handleNoteSave = function() {
    if (activeNote.id || activeNote.id === 0) {
        activeNote.title = $noteTitle.val();
        activeNote.text = $noteText.val();
        saveNote(activeNote).then(function(data) {
            activeNote = {};
            getAndRenderNotes();
            renderActiveNote();
        });
    } else {
        const newNote = {
            title: $noteTitle.val(),
            text: $noteText.val()
        };

        saveNote(newNote).then(function(data) {
            getAndRenderNotes();
            renderActiveNote();
        });
    }
};


const handleNoteDelete = function(event) {

    event.stopPropagation();

    const note = $(this)
        .parent(".list-group-item")
        .data();

    if (activeNote.id === note.id) {
        activeNote = {};
    }

    deleteNote(note.id).then(function() {
        getAndRenderNotes();
        renderActiveNote();
    });
};


const handleNoteView = function() {
    activeNote = $(this).data();
    renderActiveNote();
};


const handleNewNoteView = function() {
    $editNoteBtn.hide();
    activeNote = {};
    renderActiveNote();
};


const handleRenderSaveBtn = function() {
    if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
        $saveNoteBtn.hide();
    } else {
        $saveNoteBtn.show();
    }
};


const renderNoteList = function(notes) {
    $noteList.empty();

    const noteListItems = [];

    for (const i = 0; i < notes.length; i++) {
        const note = notes[i];
        note.id = i;
        const $li = $("<li class='list-group-item'>").data(note);
        const $span = $("<span>").text(note.title);
        const $delBtn = $(
            "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
        );

        $li.append($span, $delBtn);
        noteListItems.push($li);
    }

    $noteList.append(noteListItems);
};


const getAndRenderNotes = function() {
    return getNotes().then(function(data) {
        renderNoteList(data);
    });
};

$saveNoteBtn.on("click", handleNoteSave);
$editNoteBtn.on("click", handleNoteEdit);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);


getAndRenderNotes();