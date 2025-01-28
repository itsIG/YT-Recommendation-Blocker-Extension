let isEnabled = true;
let observer = null;

const blockedSelectors = [
    'ytd-rich-grid-renderer',          // Homepage grid
    '#secondary',                      // Right sidebar
    '#related',                        // Related videos
    'ytd-watch-next-secondary-results-renderer',  // Below player
    'ytd-reel-shelf-renderer',         // Shorts shelf
    'ytd-rich-section-renderer',       // Various shelves
    'ytd-compact-video-renderer'       // Sidebar videos
];

function refreshBlock() {
    blockedSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.style.display = isEnabled ? 'none' : '';
        });
    });
}

function createObserver() {
    return new MutationObserver(mutations => {
        if (!isEnabled) return;
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // ELEMENT_NODE
                    blockedSelectors.forEach(selector => {
                        if (node.matches(selector)) {
                            node.style.display = 'none';
                        }
                        node.querySelectorAll(selector).forEach(element => {
                            element.style.display = 'none';
                        });
                    });
                }
            });
        });
    });
}

function initializeBlocker() {
    isEnabled = true;
    refreshBlock();
    
    // Create new observer
    observer = createObserver();
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function disableBlocker() {
    isEnabled = false;
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    blockedSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.style.display = '';
        });
    });
}

// Initialize from storage
chrome.storage.local.get(['blockEnabled'], (result) => {
    const shouldEnable = result.blockEnabled !== undefined ? result.blockEnabled : true;
    shouldEnable ? initializeBlocker() : disableBlocker();
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
    if (changes.blockEnabled) {
        changes.blockEnabled.newValue ? initializeBlocker() : disableBlocker();
    }
});