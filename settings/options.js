document.addEventListener('DOMContentLoaded', () => {
    // Step 1: Get all stored settings
    chrome.storage.local.get(null, (settings) => {
      document.querySelectorAll('.switch').forEach(switchEl => {
        const key = switchEl.dataset.setting;
        const state = settings[key] ? 'on' : 'off';
  
        // Step 2: Set the state attribute
        switchEl.setAttribute('state', state);
  
        // Step 3 (optional): Apply a CSS class for visual toggle
        switchEl.classList.toggle('on', state === 'on');
      });
    });
  
    // Step 4: Handle toggle on click
    document.querySelectorAll('.switch').forEach(switchEl => {
      switchEl.addEventListener('click', () => {
        const key = switchEl.dataset.setting;
        const currentState = switchEl.getAttribute('state') === 'on';
        const newState = !currentState;
  
        switchEl.setAttribute('state', newState ? 'off' : 'on');
        switchEl.classList.toggle('on', newState);
  
        chrome.storage.local.set({ [key]: newState });
        });
    });
});


  document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings and apply them
    chrome.storage.local.get(null, (settings) => {
      document.querySelectorAll('.switch').forEach(switchEl => {
        const key = switchEl.dataset.setting;
        if (settings[key]) {
          switchEl.setAttribute('state', 'on');
        } else {
          switchEl.setAttribute('state', 'off');
        }
      });
    });
  
    // Add click event to all switches
    document.querySelectorAll('.switch').forEach(switchEl => {
      switchEl.addEventListener('click', () => {
        const key = switchEl.dataset.setting;
        const currentState = switchEl.getAttribute('state') === 'on';
        const newState = !currentState;
  
        // Update UI
        switchEl.setAttribute('state', newState ? 'on' : 'off');
  
        // Save to storage
        chrome.storage.local.set({ [key]: newState }, () => {
          console.log(`Setting "${key}" set to ${newState}`);
        });
      });
    });

    // Add click event to all theme btns
    document.querySelectorAll('.theme-btn').forEach(switchEl => {
      switchEl.addEventListener('click', () => {
        const key = switchEl.dataset.theme;
        // Save to storage
        chrome.storage.local.set({ theme: key }, () => {
          console.log(`Setting "theme" set to ${key}`);
        });

      // Loop through all theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
          btn.style.borderColor = "var(--subcolor-o)";  // Reset others
        });
        switchEl.style.borderColor = "var(--impcolor-blu-o)";
        setThemePreview(key);
      });
    });

    //initial highlight
    chrome.storage.local.get(['theme'], result => {
      const theme = result.theme ?? 0;
      const highlight = document.querySelector(`[data-theme="${theme}"]`);
      highlight.style.borderColor = 'var(--impcolor-blu-o)';

      setThemePreview(theme);
    });



    // Add click event to all font btns
    document.querySelectorAll('.font-btn').forEach(switchEl => {
      switchEl.addEventListener('click', () => {
        const key = switchEl.dataset.font;
        const title = switchEl.title;
        // Save to storage
        chrome.storage.local.set({ font: key }, () => {
          console.log(`Setting "font" set to ${key}`);
        });

      // Loop through all font buttons
        document.querySelectorAll('.font-btn').forEach(btn => {
          btn.style.borderColor = "var(--subcolor-o)";  // Reset others
        });
        switchEl.style.borderColor = "var(--impcolor-blu-o)";

      // set text to display cur font
      document.getElementById("fontpicked")
      .textContent = title;
      });
    });

    //initial highlight
    chrome.storage.local.get(['font'], result => {
      const font = result.font ?? 0;
      const highlight = document.querySelector(`[data-font="${font}"]`);
      highlight.style.borderColor = 'var(--impcolor-blu-o)';
    });


    // Add click event to all dropdowns
   document.querySelectorAll('.setting-drop').forEach(dropBtn => {
    dropBtn.addEventListener('click', () => {
      const key = dropBtn.dataset.setting;
      const currentState = dropBtn.getAttribute('state') === 'shown';
      const newState = !currentState;

      // Update UI
      dropBtn.setAttribute('state', newState ? 'shown' : 'hidden');
      const dropSvg = dropBtn.querySelector('.drop-svg');
      let setDesc = document.getElementById(key);
      setDesc = setDesc.querySelector('.setting-desc');
      if (dropBtn.getAttribute('state') == 'shown') {
        dropSvg.classList.add('reverted');
        setDesc.style.display = 'block';
      } else {
        dropSvg.classList.remove('reverted');
        setDesc.style.display = 'none';
      }

    });
  });
  });

  
  function setThemePreview(theme) {
    const themes = [
      "msmg-purple",
      "dark-purple",
      "orange",
      "sky",
      "suspicious-green",
      ];
    const vars = ["--maincolor",
      "--subcolor",
      "--border-color",
      "--fontcolor",

      "--impcolor-blu",
      "--impcolor-red",

      "--customco-1",
      "--customco-2",
      "--customco-3"
      ];
    // Dynamically inject the CSS
    cssUrl = chrome.runtime.getURL(`../themes/${themes[theme]}.css`);
    link = document.createElement("link");
    link.href = cssUrl;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    link.addEventListener('load', () => {
      const style = window.getComputedStyle(document.body);

      const shiftBtn = document.querySelector(".preview-shift");
      const titleshift = style.getPropertyValue('--titleshift');
      const shift = titleshift ? titleshift.trim() : '0deg';
      shiftBtn.style.filter = `hue-rotate(${shift})`;

      document.querySelectorAll(".preview-box").forEach(preview => {
        const color = style.getPropertyValue(vars[preview.dataset.preview]);
        preview.style.background = color;
      });
    });
  }
  
