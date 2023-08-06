'use strict';

(() => {
  let position;
  let contextMenuState = "closed";

  document.addEventListener('mousedown', (e) => {
    if (e.button !== 2) return;

    contextMenuState = "opened";
  });

  document.addEventListener('mousemove', (e) => {
    if (contextMenuState === "opened") {
      contextMenuState = "closing";

      setTimeout(() => contextMenuState = "closed", 200);
      return;
    }

    if (contextMenuState !== "closed") return;

    position = {x: e.clientX, y: e.clientY};
  });

  const getElementsUnderPoint = (x, y) => {
    const allElements = Array.from(document.getElementsByTagName('*'));

    return allElements.filter(element => {
      const rect = element.getBoundingClientRect();

      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    })
  }

  const getVideoUnderPoint = (x, y) => {
    const elements = getElementsUnderPoint(x, y);

    return elements.find(e => e.tagName.toLowerCase() === "video");
  }

  chrome.runtime.onMessage.addListener((request) => {
    if (request !== 'show') return;

    const video = getVideoUnderPoint(position.x, position.y);

    if (video) {
      video.requestFullscreen();

      chrome.storage.sync.get(['disableUnmute'], (result) => {
        if(!result.disableUnmute) video.muted = false;
      });

      chrome.storage.sync.get(['disableSkip'], (result) => {
        if(!result.disableSkip) video.currentTime = 0;
      });

      chrome.storage.sync.get(['disablePlay'], (result) => {
        if(!result.disablePlay) video.play();
      });
    }
  });
})();
