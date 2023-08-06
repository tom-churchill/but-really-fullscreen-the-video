'use strict';

(() => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'context-ri',
      title: "But really fullscreen the video",
      contexts: ['all']
    });
  });

  chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === 'openNewTab') {
      const targetURL = message.url;

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.create({ url: targetURL, index: tabs[0].index + 1, openerTabId: tabs[0].id });
      });
    }
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab) return;

    chrome.tabs.sendMessage(tab.id, 'show', null);
  });
})();
