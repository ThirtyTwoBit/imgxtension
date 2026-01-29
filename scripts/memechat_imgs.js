chrome.storage.local.get(['mcImgs'], result => {
  const setting = result.mcImgs ?? false;
  if (typeof window === 'undefined' || !window.location.href.includes('imgflip.com/memechat') || !setting) return;

  // Separate regexes: one without global for .test, one global for matching all
  const IMGX_TEST_REGEX = /imgx\.([a-zA-Z0-9_-]+)/;
  const IMGX_GLOBAL_REGEX = /imgx\.([a-zA-Z0-9_-]+)/g;

  function processTextNode(node) {
    const text = node.nodeValue;
    if (!IMGX_TEST_REGEX.test(text)) return; // quick check before costly matchAll

    const matches = [...text.matchAll(IMGX_GLOBAL_REGEX)];
    if (matches.length === 0) return;

    const parent = node.parentNode;
    const fragments = [];
    let lastIndex = 0;

    for (const match of matches) {
      const [fullMatch, id] = match;
      const index = match.index;

      // Add text before the match
      if (index > lastIndex) {
        fragments.push(document.createTextNode(text.slice(lastIndex, index)));
      }

      // Create image element
      const img = document.createElement('img');
      img.src = `https://i.imgflip.com/${id}.jpg`;
      img.style.maxWidth = '300px';
      img.style.maxHeight = '150px';
      img.title = id;
      img.style.cursor = 'pointer';

      // Fallback to gif on error
      img.onerror = () => {
        img.onerror = null;
        img.src = `https://i.imgflip.com/${id}.gif`;
      };

      // Click opens image in new tab
      img.onclick = () => window.open(img.src);

      fragments.push(img);
      lastIndex = index + fullMatch.length;
    }

    // Add remaining text after last match
    if (lastIndex < text.length) {
      fragments.push(document.createTextNode(text.slice(lastIndex)));
    }

    // Replace the original text node with fragments
    for (const frag of fragments) {
      parent.insertBefore(frag, node);
    }
    parent.removeChild(node);
  }

  function scanAndReplace(root) {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          IMGX_TEST_REGEX.lastIndex = 0; // reset regex state
          return IMGX_TEST_REGEX.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(processTextNode);
  }

  // Initial pass over the whole document body
  scanAndReplace(document.body);

  // MutationObserver to watch for any added nodes containing new chat messages or text nodes
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          // Directly process added text nodes
          processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // If the added element is a chat message, process it
          if (node.classList.contains('chat-msg')) {
            // Use setTimeout to avoid race conditions with DOM updates
            setTimeout(() => scanAndReplace(node), 0);
          }

          // Also scan deeper in case multiple chat messages added inside
          node.querySelectorAll && node.querySelectorAll('.chat-msg').forEach(el => {
            setTimeout(() => scanAndReplace(el), 0);
          });

          // Additionally, scan any text nodes added anywhere in subtree that might contain imgx.
          scanAndReplace(node);
        }
      }
    }
  });

  // Start observing the whole body for any added nodes or subtree modifications
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
