document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle');
    const status = document.getElementById('status');

    // Load initial state
    chrome.storage.local.get(['blockEnabled'], (result) => {
        const isEnabled = result.blockEnabled ?? true;
        toggle.checked = isEnabled;
        status.textContent = isEnabled ? 'Enabled' : 'Disabled';
    });

    // Handle toggle changes
    toggle.addEventListener('change', () => {
        const newState = toggle.checked;
        chrome.storage.local.set({ blockEnabled: newState }, () => {
            status.textContent = newState ? 'Enabled' : 'Disabled';
            
            // Update all YouTube tabs
            chrome.tabs.query({url: "*://*.youtube.com/*"}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.scripting.executeScript({
                        target: {tabId: tab.id},
                        func: (newState) => {
                            if (newState) {
                                window.location.reload();
                            } else {
                                window.location.reload();
                            }
                        },
                        args: [newState]
                    });
                });
            });
        });
    });
});