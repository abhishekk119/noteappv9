import { notewrapper, nonotetext, addButton } from "./config.js";
import { handleColorSelection } from "./note-colors-pinning.js";
import { handleNotePinning } from "./note-colors-pinning.js";
import { handleCheckboxAdding } from "./note-utilities.js";
import { handleDeleteNote } from "./note-creation-helpers.js";
import { openNote } from "./note-creation-helpers.js";
import { sortNotesByDate } from "./note-creation-helpers.js";
import { handleImageBackground } from "./note-utilities.js";
import { saveNotesToStorage } from "./storage.js";
import { loadNotesFromStorage } from "./storage.js";

loadNotesFromStorage();

addButton.addEventListener("click", function () {
  addANote();
  sortNotesByDate("desc");
  document.activeElement.blur();
});

export function addANote() {
  const noteTitle = document.getElementById("title-area").value.trim();
  const noteBody = document.getElementById("take-a-note-textarea").value;
  //check if the note is empty
  if (noteBody === "") {
    return;
  }

  // Remove empty state message if it exists
  nonotetext.style.display = "none";
  //create note div
  const note = document.createElement("div");
  note.classList.add("note", "animate__animated", "animate__rubberBand");
  note.classList.add("note");
  note.style.backgroundColor = "white";
  note.setAttribute("tabindex", "0");
  note.style.backgroundSize = "cover";
  note.style.backgroundRepeat = "no-repeat"; // Prevents tiling
  note.style.backgroundPosition = "center"; // Centers the image

  // Add timestamp as data attribute
  const timestamp = new Date();
  note.dataset.createdAt = timestamp.toISOString();
  const dateElement = document.createElement("small");
  dateElement.textContent = timestamp.toLocaleString();
  dateElement.style.display = "block";
  dateElement.style.marginBottom = "8px";
  dateElement.style.opacity = "0.7";

  //create h3 element for title
  const titleElement = document.createElement("h3");
  titleElement.textContent = noteTitle || "Untitled Note";

  //create p element for notebody
  const bodyElement = document.createElement("p");
  bodyElement.innerHTML = noteBody
    .replace(/\n/g, "<br>")
    .replace(/ /g, "&nbsp;"); // <-- Fix here

  //create contentDiv to hold bodyElement
  const contentDiv = document.createElement("div");
  contentDiv.classList.add("note-content");

  //add (append) titleElement and dateElement to note div
  note.appendChild(titleElement);
  note.appendChild(dateElement);
  //append bodyElement to contentDiv
  contentDiv.appendChild(bodyElement);
  //append contentDiv to note
  note.appendChild(contentDiv);

  //create noteoptions div
  const noteOptionsDiv = document.createElement("div");
  noteOptionsDiv.classList.add("noteoptions");

  //background changine div
  const backgroundChangerDiv = document.createElement("div");
  backgroundChangerDiv.classList.add("backgroundChangerDiv");
  backgroundChangerDiv.style.display = "none";

  //colorSelectDiv for handling color slection pop up
  const colorSelectDiv = document.createElement("div");
  colorSelectDiv.classList.add("colorSelectDiv");
  //colorSelectDiv.style.display = "none";

  const color1 = document.createElement("div");
  color1.style.height = "30px";
  color1.style.width = "30px";
  color1.style.borderRadius = "50%";
  color1.style.backgroundColor = "#5d4037";
  color1.style.border = "2px solid white";
  color1.onclick = function (e) {
    e.stopPropagation();
    handleColorSelection("#5d4037");
  };

  const color2 = document.createElement("div");
  color2.style.height = "30px";
  color2.style.width = "30px";
  color2.style.borderRadius = "50%";
  color2.style.backgroundColor = "#1a1a1a";
  color2.style.border = "2px solid white";
  color2.onclick = function (e) {
    e.stopPropagation();
    handleColorSelection("#1a1a1a");
  };

  const color3 = document.createElement("div");
  color3.style.height = "30px";
  color3.style.width = "30px";
  color3.style.borderRadius = "50%";
  color3.style.backgroundColor = "#fff475";
  color3.style.border = "2px solid white";
  color3.onclick = function (e) {
    e.stopPropagation();
    handleColorSelection("#fff475");
  };

  const color4 = document.createElement("div");
  color4.style.height = "30px";
  color4.style.width = "30px";
  color4.style.borderRadius = "50%";
  color4.style.backgroundColor = "#ccff90";
  color4.style.border = "2px solid white";
  color4.onclick = function (e) {
    e.stopPropagation();
    handleColorSelection("#ccff90");
  };

  const color5 = document.createElement("div");
  color5.style.height = "30px";
  color5.style.width = "30px";
  color5.style.borderRadius = "50%";
  color5.style.backgroundColor = "#cbf0f8";
  color5.style.border = "2px solid white";
  color5.onclick = function (e) {
    e.stopPropagation();
    handleColorSelection("#cbf0f8");
  };

  const color6 = document.createElement("div");
  color6.style.height = "30px";
  color6.style.width = "30px";
  color6.style.borderRadius = "50%";
  color6.style.backgroundColor = "#a25d5dff";
  color6.style.border = "2px solid white";
  color6.onclick = function (e) {
    e.stopPropagation();
    handleColorSelection("#a25d5dff");
  };

  const color7 = document.createElement("div");
  color7.style.height = "30px";
  color7.style.width = "30px";
  color7.style.borderRadius = "50%";
  color7.style.backgroundColor = "#7070bcff";
  color7.style.border = "2px solid white";
  color7.onclick = function (e) {
    e.stopPropagation();
    handleColorSelection("#7070bcff");
  };

  const color8 = document.createElement("div");
  color8.style.height = "30px";
  color8.style.width = "30px";
  color8.style.borderRadius = "50%";
  color8.style.backgroundColor = "#8855acff";
  color8.style.border = "2px solid white";
  color8.onclick = function (e) {
    e.stopPropagation();
    handleColorSelection("#8855acff");
  };

  colorSelectDiv.appendChild(color1);
  colorSelectDiv.appendChild(color2);
  colorSelectDiv.appendChild(color3);
  colorSelectDiv.appendChild(color4);
  colorSelectDiv.appendChild(color5);
  colorSelectDiv.appendChild(color6);
  colorSelectDiv.appendChild(color7);
  colorSelectDiv.appendChild(color8);

  //image selector div
  const imageSelectorDiv = document.createElement("div");
  imageSelectorDiv.classList.add("imageSelectorDiv");

  const thumbnail1 = document.createElement("div");
  thumbnail1.style.backgroundImage = `url('assets/thumb1.png')`;
  thumbnail1.style.backgroundSize = "cover";
  thumbnail1.style.backgroundRepeat = "no-repeat"; // Prevents tiling
  thumbnail1.style.backgroundPosition = "center"; // Centers the image
  thumbnail1.style.height = "35px";
  thumbnail1.style.width = "35px";
  thumbnail1.style.borderRadius = "50%";
  thumbnail1.style.border = "2px solid white";
  thumbnail1.onclick = (e) => {
    e.stopPropagation();
    note.style.backgroundImage = `url('assets/bg1.jpg')`;
    note.style.color = "white";
    backgroundChangerDiv.style.display = "none";
    handleImageBackground(note);
  };

  const thumbnail2 = document.createElement("div");
  thumbnail2.style.backgroundImage = `url('assets/thumb2.png')`;
  thumbnail2.style.backgroundSize = "cover";
  thumbnail2.style.backgroundRepeat = "no-repeat"; // Prevents tiling
  thumbnail2.style.backgroundPosition = "center";
  thumbnail2.style.height = "35px";
  thumbnail2.style.width = "35px";
  thumbnail2.style.borderRadius = "50%";
  thumbnail2.style.border = "2px solid white";
  thumbnail2.onclick = (e) => {
    e.stopPropagation();
    note.style.backgroundImage = `url('assets/bg2.jpg')`;
    note.style.color = "white";
    backgroundChangerDiv.style.display = "none";
    handleImageBackground(note);
  };

  const thumbnail3 = document.createElement("div");
  thumbnail3.style.backgroundImage = `url('assets/thumb3.png')`;
  thumbnail3.style.backgroundSize = "cover";
  thumbnail3.style.backgroundRepeat = "no-repeat"; // Prevents tiling
  thumbnail3.style.backgroundPosition = "center";
  thumbnail3.style.height = "35px";
  thumbnail3.style.width = "35px";
  thumbnail3.style.borderRadius = "50%";
  thumbnail3.style.border = "2px solid white";
  thumbnail3.onclick = (e) => {
    e.stopPropagation();
    note.style.backgroundImage = `url('assets/bg3.jpg')`;
    note.style.color = "white";
    backgroundChangerDiv.style.display = "none";
    handleImageBackground(note);
  };

  const thumbnail4 = document.createElement("div");
  thumbnail4.style.backgroundImage = `url('assets/thumb4.png')`;
  thumbnail4.style.backgroundSize = "cover";
  thumbnail4.style.backgroundRepeat = "no-repeat"; // Prevents tiling
  thumbnail4.style.backgroundPosition = "center";
  thumbnail4.style.height = "35px";
  thumbnail4.style.width = "35px";
  thumbnail4.style.borderRadius = "50%";
  thumbnail4.style.border = "2px solid white";
  thumbnail4.onclick = (e) => {
    e.stopPropagation();
    note.style.backgroundImage = `url('assets/bg4.jpg')`;
    note.style.color = "white";
    backgroundChangerDiv.style.display = "none";
    handleImageBackground(note);
  };

  const thumbnail5 = document.createElement("div");
  thumbnail5.style.backgroundImage = `url('assets/thumb5.png')`;
  thumbnail5.style.backgroundSize = "cover";
  thumbnail5.style.backgroundRepeat = "no-repeat"; // Prevents tiling
  thumbnail5.style.backgroundPosition = "center";
  thumbnail5.style.height = "35px";
  thumbnail5.style.width = "35px";
  thumbnail5.style.borderRadius = "50%";
  thumbnail5.style.border = "2px solid white";
  thumbnail5.onclick = (e) => {
    e.stopPropagation();
    note.style.backgroundImage = `url('assets/bg5.jpg')`;
    note.style.color = "white";
    backgroundChangerDiv.style.display = "none";
    handleImageBackground(note);
  };

  const thumbnail6 = document.createElement("div");
  thumbnail6.style.backgroundImage = `url('assets/thumb6.png')`;
  thumbnail6.style.backgroundSize = "cover";
  thumbnail6.style.backgroundRepeat = "no-repeat"; // Prevents tiling
  thumbnail6.style.backgroundPosition = "center";
  thumbnail6.style.height = "35px";
  thumbnail6.style.width = "35px";
  thumbnail6.style.borderRadius = "50%";
  thumbnail6.style.border = "2px solid white";
  thumbnail6.onclick = (e) => {
    e.stopPropagation();
    note.style.backgroundImage = `url('assets/bg6.jpg')`;
    note.style.color = "white";
    backgroundChangerDiv.style.display = "none";
    handleImageBackground(note);
  };

  const thumbnail7 = document.createElement("div");
  thumbnail7.style.backgroundImage = `url('assets/thumb7.png')`;
  thumbnail7.style.backgroundSize = "cover";
  thumbnail7.style.backgroundRepeat = "no-repeat"; // Prevents tiling
  thumbnail7.style.backgroundPosition = "center";
  thumbnail7.style.height = "35px";
  thumbnail7.style.width = "35px";
  thumbnail7.style.borderRadius = "50%";
  thumbnail7.style.border = "2px solid white";
  thumbnail7.onclick = (e) => {
    e.stopPropagation();
    note.style.backgroundImage = `url('assets/bg7.jpg')`;
    note.style.color = "white";
    backgroundChangerDiv.style.display = "none";
    handleImageBackground(note);
  };

  const thumbnail8 = document.createElement("div");
  thumbnail8.style.backgroundImage = `url('assets/thumb8.png')`;
  thumbnail8.style.backgroundSize = "cover";
  thumbnail8.style.backgroundRepeat = "no-repeat"; // Prevents tiling
  thumbnail8.style.backgroundPosition = "center";
  thumbnail8.style.height = "35px";
  thumbnail8.style.width = "35px";
  thumbnail8.style.borderRadius = "50%";
  thumbnail8.style.border = "2px solid white";
  thumbnail8.onclick = (e) => {
    e.stopPropagation();
    note.style.backgroundImage = `url('assets/bg8.jpg')`;
    note.style.color = "white";
    backgroundChangerDiv.style.display = "none";
    handleImageBackground(note);
  };

  imageSelectorDiv.appendChild(thumbnail1);
  imageSelectorDiv.appendChild(thumbnail2);
  imageSelectorDiv.appendChild(thumbnail3);
  imageSelectorDiv.appendChild(thumbnail4);
  imageSelectorDiv.appendChild(thumbnail5);
  imageSelectorDiv.appendChild(thumbnail6);
  imageSelectorDiv.appendChild(thumbnail7);
  imageSelectorDiv.appendChild(thumbnail8);
  backgroundChangerDiv.appendChild(colorSelectDiv);
  backgroundChangerDiv.appendChild(imageSelectorDiv);

  //document.body.appendChild(backgroundChangerDiv);

  //create color selector button
  const colorSelectorButton = document.createElement("button");
  colorSelectorButton.style.background = "none";
  colorSelectorButton.style.border = "none";
  colorSelectorButton.style.cursor = "pointer";
  colorSelectorButton.classList.add("animate");
  const colorIcon = document.createElement("i");
  colorIcon.className = "fas fa-palette"; // Palette icon
  colorIcon.style.fontSize = "20px";
  colorSelectorButton.appendChild(colorIcon);

  //delete note button option
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.type = "button"; // Prevent form submission
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fas fa-trash-alt"; // Trash icon
  deleteIcon.style.fontSize = "20px";
  //deleteIcon.classList.add("delete-icon");
  deleteButton.appendChild(deleteIcon);

  //pinned note button
  const pinnedButton = document.createElement("button");
  pinnedButton.classList.add("pin-button");
  pinnedButton.style.background = "none";
  pinnedButton.style.border = "none";
  pinnedButton.style.cursor = "pointer";
  const pinImg = document.createElement("i");
  pinImg.className = "fas fa-thumbtack"; // Thumbtack/pin icon
  pinImg.style.fontSize = "20px";
  pinnedButton.appendChild(pinImg);

  //checkbox button
  const checkboxButton = document.createElement("button");
  checkboxButton.classList.add("checkbox-button");
  checkboxButton.style.background = "none";
  checkboxButton.style.border = "none";
  checkboxButton.style.cursor = "pointer";
  const checkboxImg = document.createElement("i");
  checkboxImg.className = "fa-regular fa-square-check";
  checkboxImg.style.fontSize = "20px";
  checkboxButton.appendChild(checkboxImg);

  //append colorSelectorButton and deleteButton to noteOptionsDiv
  noteOptionsDiv.appendChild(pinnedButton);
  noteOptionsDiv.appendChild(checkboxButton);
  noteOptionsDiv.appendChild(colorSelectorButton);
  noteOptionsDiv.appendChild(deleteButton);
  noteOptionsDiv.appendChild(backgroundChangerDiv);
  //append noteOptionsDiv to note
  //note.appendChild(backgroundChangerDiv);
  note.appendChild(noteOptionsDiv);
  //append note to notewrapper
  notewrapper.appendChild(note);

  note.addEventListener(
    "animationend",
    () => {
      note.classList.remove("animate__animated", "animate__rubberBand");
    },
    { once: true }
  );

  deleteButton.onclick = function (e) {
    e.stopPropagation();
    handleDeleteNote(note);
  };

  note.addEventListener("click", function () {
    openNote(note);
  });

  // Replace the colorSelectorButton click event handler with this:
  colorSelectorButton.addEventListener("click", function (e) {
    e.stopPropagation();
    document.querySelectorAll(".backgroundChangerDiv").forEach((div) => {
      if (div !== backgroundChangerDiv) {
        div.style.display = "none";
      }
    });

    if (backgroundChangerDiv.style.display === "none") {
      backgroundChangerDiv.style.display = "flex";
      //backgroundChangerDiv.classList.remove("animate__wobble"); // reset in case
      void backgroundChangerDiv.offsetWidth; // reflow to restart animation
      //backgroundChangerDiv.classList.add("animate__wobble");
    } else {
      backgroundChangerDiv.style.display = "none";
    }
  });

  pinnedButton.addEventListener("click", function (e) {
    e.stopPropagation();
    handleNotePinning(note);
  });

  checkboxButton.addEventListener("click", function (e) {
    e.stopPropagation();
    handleCheckboxAdding(contentDiv, note);
  });

  //make the title and note taking area clear
  document.getElementById("title-area").value = "";
  document.getElementById("take-a-note-textarea").value = "";
  saveNotesToStorage();
}
