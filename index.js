var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $editNoteBtn = $(".edit-note");
var $noteList = $(".list-container .list-group");


var activeNote = {};


var getNotes = function() {
    return $.ajax({
        url: "/api/notes",
        method: "GET"
    });
};


var saveNote = function(note) {
    return $.ajax({
        url: "/api/notes",
        data: note,
        method: "POST"
    });
};


var deleteNote = function(id) {
    return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE"
    });
};


var renderActiveNote = function() {
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

var handleNoteEdit = function() {
    $editNoteBtn.hide();
    $saveNoteBtn.show();
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
}


var handleNoteSave = function() {
    if (activeNote.id || activeNote.id === 0) {
        activeNote.title = $noteTitle.val();
        activeNote.text = $noteText.val();
        saveNote(activeNote).then(function(data) {
            activeNote = {};
            getAndRenderNotes();
            renderActiveNote();
        });
    } else {
        var newNote = {
            title: $noteTitle.val(),
            text: $noteText.val()
        };

        saveNote(newNote).then(function(data) {
            getAndRenderNotes();
            renderActiveNote();
        });
    }
};


var handleNoteDelete = function(event) {

    event.stopPropagation();

    var note = $(this)
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


var handleNoteView = function() {
    activeNote = $(this).data();
    renderActiveNote();
};


var handleNewNoteView = function() {
    $editNoteBtn.hide();
    activeNote = {};
    renderActiveNote();
};


var handleRenderSaveBtn = function() {
    if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
        $saveNoteBtn.hide();
    } else {
        $saveNoteBtn.show();
    }
};


var renderNoteList = function(notes) {
    $noteList.empty();

    var noteListItems = [];

    for (var i = 0; i < notes.length; i++) {
        var note = notes[i];
        note.id = i;
        var $li = $("<li class='list-group-item'>").data(note);
        var $span = $("<span>").text(note.title);
        var $delBtn = $(
            "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
        );

        $li.append($span, $delBtn);
        noteListItems.push($li);
    }

    $noteList.append(noteListItems);
};


var getAndRenderNotes = function() {
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