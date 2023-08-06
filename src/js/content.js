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

  const openUrl = (url) => chrome.runtime.sendMessage({action: 'openNewTab', url: url})

  const getImgUrl = (tag, element) => {
    if (tag === "img") return element.src;
  }

  const getBackgroundImageUrls = (element) => {
    const backgroundImage = window.getComputedStyle(element).backgroundImage;

    if (backgroundImage && backgroundImage !== "none") {
      const urlRegex = /url\(['"]?(.*?)['"]?\)/g;
      const matches = backgroundImage.match(urlRegex) || [];

      return matches.map(match => match.match(/url\(['"]?(.*?)['"]?\)/)[1]);
    }

    return [];
  }

  const getSvgUrl = (tag, element) => {
    if (tag === "svg") {
      const asText = new XMLSerializer().serializeToString(element);
      const blob = new Blob([asText], {type: "image/svg+xml"});

      return URL.createObjectURL(blob);
    }
  }

  const getElementsUnderPoint = (x, y) => {
    const allElements = Array.from(document.getElementsByTagName('*'));

    return allElements.filter(element => {
      const rect = element.getBoundingClientRect();

      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    })
  }

  const getImagesUnderPoint = (x, y) => {
    const urls = new Set();
    const elements = getElementsUnderPoint(x, y);

    elements.forEach(element => {
      const tag = element.tagName.toLowerCase();

      const urlImg = getImgUrl(tag, element);
      const urlsBackgroundImage = getBackgroundImageUrls(element);
      const urlSvg = getSvgUrl(tag, element);

      if (urlImg) urls.add(urlImg);
      if (urlSvg) urls.add(urlSvg);
      urlsBackgroundImage.forEach(url => urls.add(url));
    });

    return urls;
  }

  chrome.runtime.onMessage.addListener((request) => {
    if (request !== 'show') return;

    const urls = getImagesUnderPoint(position.x, position.y);

    urls.forEach(url => openUrl(url));
  });
})();
