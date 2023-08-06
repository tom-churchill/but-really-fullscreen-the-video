const handleOption = (name) => {
    const element = document.getElementById(name);

    chrome.storage.sync.get([name], (result) => element.checked = result[name]);

    element.addEventListener('change', () => chrome.storage.sync.set({[name]: element.checked}));
}
document.addEventListener('DOMContentLoaded', function () {
    handleOption("disableUnmute");
    handleOption("disableSkip");
    handleOption("disablePlay");
});
