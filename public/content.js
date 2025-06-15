/*global chrome */
var selectedText = "";
var saveButton = null;
const clickHandler = (text) => {
  chrome.storage?.local.get(["highlights"], (res) => {
    const highlights = res.highlights || [];
    highlights.push({
      id: "hl_" + new Date().getTime() + "_" + Math.floor(Math.random() * 10000),
      text,
      date: new Date().toLocaleString(),
      location: window.location.href,
    });
    chrome.storage.local.set({ highlights }, () => {
      alert("✅ Highlight saved!");
    });
  });
  removeButton();
};

document.addEventListener("mouseup", function (e) {
  setTimeout(() => {
    selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
      showSaveButton(e.pageX, e.pageY);
    } else {
      removeButton();
    }
  }, 10);
});

const showSaveButton = (pageX, pageY) => {
  // removeButton();
  saveButton = document.createElement("button");
  saveButton.innerText = "💾 Save Highlight";
  Object.assign(saveButton.style, {
    position: "fixed",
    top: `${pageY + 30}px`,
    left: `${pageX + 10}px`,
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  });
  document.body.appendChild(saveButton);
  saveButton.addEventListener("click", () => {
    clickHandler(selectedText);
    window.getSelection().removeAllRanges();
  });
};

const removeButton = () => {
  if (saveButton) {
    saveButton.remove();
    saveButton = null;
  }
};

document.addEventListener("mousedown", (e) => {
  if (saveButton && !saveButton.contains(e.target)) {
    removeButton();
  }
});
