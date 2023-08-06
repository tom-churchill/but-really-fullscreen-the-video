'use strict';

(() => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'context-ri',
      title: "But really fullscreen the video",
      contexts: ['all']
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab) return;

    chrome.tabs.sendMessage(tab.id, 'show', null);
  });
})();
