import { notewrapper, nonotetext, addButton, deletedmsg } from "./config.js";
import { handleColorSelection } from "./note-colors-pinning.js";
import { handleNotePinning } from "./note-colors-pinning.js";
import { checkIfWrapperIsEmpty } from "./note-colors-pinning.js";
import { handleCheckboxAdding } from "./note-utilities.js";
import { handleImageBackground } from "./note-utilities.js";
import { updatePinnedNotesVisibility } from "./note-utilities.js";
import { handleDeleteNote } from "./note-creation-helpers.js";
import { openNote } from "./note-creation-helpers.js";
import { sortNotesByDate } from "./note-creation-helpers.js";

function setIconColors(note) {
  // Get the computed background color and image
  const bgColor = window.getComputedStyle(note).backgroundColor;
  const bgImage = window.getComputedStyle(note).backgroundImage;

  const icons = note.querySelectorAll(
    ".fa-palette, .fa-thumbtack, .fa-trash-alt, .fa-link-slash, .fa-square-check"
  );

  // Check for background image first
  if (bgImage && bgImage !== "none") {
    icons.forEach((icon) => {
      icon.style.color = "white";
      icon.style.transition = "color 0.3s ease"; // Smooth transition
    });
    return;
  }

  // Check for light backgrounds that need black icons
  const lightColors = [
    "rgb(255, 244, 117)", // #fff475
    "rgb(204, 255, 144)", // #ccff90
    "rgb(203, 240, 248)", // #cbf0f8
    "rgb(255, 255, 255)", // white
  ];

  if (lightColors.includes(bgColor)) {
    icons.forEach((icon) => {
      icon.style.color = "black";
      icon.style.transition = "color 0.3s ease";
    });
  } else {
    icons.forEach((icon) => {
      icon.style.color = "white";
      icon.style.transition = "color 0.3s ease";
    });
  }
}

export function saveNotesToStorage() {
  const notes = [];
  const noteElements = document.querySelectorAll(".note");

  noteElements.forEach((note) => {
    const contentDiv = note.querySelector(".note-content");
    const noteData = {
      id:
        note.id ||
        `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: note.querySelector("h3").textContent,
      body: contentDiv.innerHTML, // Save the entire content HTML
      createdAt: note.dataset.createdAt,
      backgroundColor: note.style.backgroundColor || "white",
      backgroundImage: note.style.backgroundImage || "none",
      color: note.style.color || "black",
      isPinned: note.parentNode.id === "pinned-notes-wrapper",
    };
    notes.push(noteData);
  });

  try {
    localStorage.setItem("notes", JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving notes to localStorage:", error);
  }
}

function restoreCheckboxes(contentDiv) {
  if (!contentDiv) return;

  // Get all checkboxes in the content
  const checkboxes = Array.from(
    contentDiv.querySelectorAll("input.note-checkbox")
  );

  // Only proceed if there are any checkboxes
  if (checkboxes.length === 0) return;

  // Restore functionality for all checkboxes
  checkboxes.forEach((checkbox) => {
    const textspan = checkbox.nextElementSibling;

    if (textspan && textspan.classList.contains("checkbox-text")) {
      // Restore checkbox change handler
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          textspan.classList.add("checked-item");
        } else {
          textspan.classList.remove("checked-item");
        }
        saveNotesToStorage();
      });

      // Restore checked state if needed
      if (textspan.classList.contains("checked-item")) {
        checkbox.checked = true;
      }
    }
  });

  // Get the last checkbox and its parent div
  const lastCheckbox = checkboxes[checkboxes.length - 1];
  const lastCheckboxDiv = lastCheckbox.parentNode;
  const note = contentDiv.closest(".note");

  // Create a new paragraph after the last checkbox
  const paragraph = document.createElement("p");
  paragraph.contentEditable = note?.classList.contains("expanded") || false;
  paragraph.textContent = "...";
  paragraph.classList.add("paragraph");

  // Insert the paragraph after the last checkbox's div
  lastCheckboxDiv.parentNode.insertBefore(
    paragraph,
    lastCheckboxDiv.nextSibling
  );
}

export function loadNotesFromStorage() {
  try {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    if (!notes || !Array.isArray(notes)) return;

    const notewrapper = document.getElementById("notewrapper");
    const pinnedNotesWrapper = document.getElementById("pinned-notes-wrapper");
    const nonotetext = document.getElementById("no-note-text");
    const pinnedtext = document.getElementById("pinnedtext");

    // Clear existing notes
    notewrapper.innerHTML = "";
    pinnedNotesWrapper.innerHTML = "";

    notes.forEach((noteData) => {
      const note = document.createElement("div");
      note.classList.add("note");
      note.id = noteData.id;
      note.dataset.createdAt = noteData.createdAt;
      note.style.backgroundColor = noteData.backgroundColor;
      note.style.backgroundImage = noteData.backgroundImage;
      note.style.color = noteData.color;
      note.style.backgroundSize = "cover";
      note.style.backgroundRepeat = "no-repeat";
      note.style.backgroundPosition = "center";
      setTimeout(() => {
        setIconColors(note);
      }, 10);

      // Create title
      const titleElement = document.createElement("h3");
      titleElement.textContent = noteData.title || "Untitled Note";

      // Create date
      const dateElement = document.createElement("small");
      dateElement.textContent = new Date(noteData.createdAt).toLocaleString();
      dateElement.style.display = "block";
      dateElement.style.marginBottom = "8px";
      dateElement.style.opacity = "0.7";

      // Create content
      const contentDiv = document.createElement("div");
      contentDiv.classList.add("note-content");

      const bodyElement = document.createElement("p");
      //restoreCheckboxes(contentDiv, noteData.body);
      bodyElement.innerHTML = noteData.body;
      //bodyElement.contentEditable = "true";
      contentDiv.appendChild(bodyElement);
      restoreCheckboxes(bodyElement);

      // Create note options (similar to addANote())
      const noteOptionsDiv = document.createElement("div");
      noteOptionsDiv.classList.add("noteoptions");

      // Background changer div (hidden by default)
      const backgroundChangerDiv = document.createElement("div");
      backgroundChangerDiv.classList.add("backgroundChangerDiv");
      backgroundChangerDiv.style.display = "none";

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

      // Color selector buttons (simplified for brevity)
      const colorSelectorButton = document.createElement("button");
      colorSelectorButton.style.background = "none";
      colorSelectorButton.style.border = "none";
      colorSelectorButton.style.cursor = "pointer";
      const colorIcon = document.createElement("i");
      colorIcon.className = "fas fa-palette";
      colorIcon.style.fontSize = "20px";
      colorSelectorButton.appendChild(colorIcon);

      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fas fa-trash-alt";
      deleteIcon.style.fontSize = "20px";
      deleteButton.appendChild(deleteIcon);

      // Pin button
      const pinnedButton = document.createElement("button");
      pinnedButton.classList.add("pin-button");
      pinnedButton.style.background = "none";
      pinnedButton.style.border = "none";
      pinnedButton.style.cursor = "pointer";
      // const pinImg = document.createElement("i");
      // pinImg.className = "fas fa-thumbtack";
      // pinImg.style.fontSize = "20px";
      // pinnedButton.appendChild(pinImg);

      //**********************************************************/
      if (noteData.isPinned) {
        // Create unpin button for pinned notes
        pinnedButton.classList.add("unpin-button");
        const unpinImg = document.createElement("i");
        unpinImg.className = "fas fa-link-slash";
        unpinImg.style.fontSize = "20px";
        pinnedButton.appendChild(unpinImg);

        // Set icon color based on note background
        const bgHex = note.style.backgroundColor;
        unpinImg.style.color =
          bgHex === "rgb(255, 244, 117)" ||
          bgHex === "rgb(204, 255, 144)" ||
          bgHex === "rgb(203, 240, 248)" ||
          bgHex === "white"
            ? "#000000"
            : "#FFFFFF";
      } else {
        // Create regular pin button for unpinned notes
        pinnedButton.classList.add("pin-button");
        const pinImg = document.createElement("i");
        pinImg.className = "fas fa-thumbtack";
        pinImg.style.fontSize = "20px";
        pinnedButton.appendChild(pinImg);
      }

      //**********************************************************/

      // Checkbox button (optional)
      const checkboxButton = document.createElement("button");
      checkboxButton.classList.add("checkbox-button");
      checkboxButton.style.background = "none";
      checkboxButton.style.border = "none";
      checkboxButton.style.cursor = "pointer";
      const checkboxImg = document.createElement("i");
      checkboxImg.className = "fa-regular fa-square-check";
      checkboxImg.style.fontSize = "20px";
      checkboxButton.appendChild(checkboxImg);

      // Append buttons to noteOptionsDiv
      noteOptionsDiv.appendChild(pinnedButton);
      noteOptionsDiv.appendChild(checkboxButton);
      noteOptionsDiv.appendChild(colorSelectorButton);
      noteOptionsDiv.appendChild(deleteButton);
      noteOptionsDiv.appendChild(backgroundChangerDiv);

      // Append all elements to note
      //contentDiv.appendChild(bodyElement);
      note.appendChild(titleElement);
      note.appendChild(dateElement);
      note.appendChild(contentDiv);
      note.appendChild(noteOptionsDiv);

      colorSelectorButton.onclick = function (e) {
        e.stopPropagation();
        if (backgroundChangerDiv.style.display === "none") {
          backgroundChangerDiv.style.display = "flex";
        } else {
          backgroundChangerDiv.style.display = "none";
        }
      };

      checkboxButton.onclick = function (e) {
        e.stopPropagation();
        handleCheckboxAdding(contentDiv);
      };

      // Reattach event listeners
      deleteButton.onclick = function (e) {
        e.stopPropagation();
        handleDeleteNote(note);
      };

      pinnedButton.onclick = function (e) {
        e.stopPropagation();
        handleNotePinning(note);
      };

      note.addEventListener("click", function () {
        openNote(note);
      });

      // Append to appropriate wrapper
      if (noteData.isPinned) {
        pinnedNotesWrapper.appendChild(note);
        pinnedtext.style.display = "block";
        pinnedNotesWrapper.style.display = "block";
      } else {
        notewrapper.appendChild(note);
      }
    });

    if (notes.length === 0) {
      nonotetext.style.display = "block";
    } else {
      nonotetext.style.display = "none";
    }

    updatePinnedNotesVisibility();
  } catch (error) {
    console.error("Error loading notes from localStorage:", error);
  }
}

function deleteNoteFromStorage(noteId) {
  try {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  } catch (error) {
    console.error("Error deleting note from localStorage:", error);
  }
}
