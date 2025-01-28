document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle');
    const statusText = document.getElementById('statusText');

    // Load saved state
    chrome.storage.local.get(['blockEnabled'], (result) => {
        const isEnabled = result.blockEnabled !== undefined ? result.blockEnabled : true;
        toggle.checked = isEnabled;
        statusText.textContent = isEnabled ? 'Blocking Enabled' : 'Blocking Disabled';
    });

    // Save state on toggle
    toggle.addEventListener('change', () => {
        chrome.storage.local.set({ blockEnabled: toggle.checked }, () => {
            statusText.textContent = toggle.checked ? 'Blocking Enabled' : 'Blocking Disabled';
            // Send message to all YouTube tabs to update
            chrome.tabs.query({url: "*://*.youtube.com/*"}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {enabled: toggle.checked});
                });
            });
        });
    });
});