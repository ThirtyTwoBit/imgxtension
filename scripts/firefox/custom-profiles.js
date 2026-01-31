function isValidHex(hex) {
    if (!hex || typeof hex !== 'string') {
        return false;
    }
    // Regex for #RGB, #RRGGBB, #RGBA, #RRGGBBAA
    const hexPattern = /^#([0-9a-fA-F]{3}){1,2}$|^#([0-9a-fA-F]{4})$|^#([0-9a-fA-F]{8})$/;
    // Simplified for common #RGB, #RRGGBB:
    // const hexPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    return hexPattern.test(hex);
}


chrome.storage.local.get(['customProfiles'], result => {
    const setting = result.customProfiles ?? false; 
    if (typeof window !== "undefined" && window.location.href.includes("imgflip.com") && setting == true) {


        bioElem = document.querySelector('#user-tagline');
        if (bioElem) {
            let bioText = bioElem.textContent;

            // Match any {...} style block with key-value pairs inside
            const stylePattern = /{([^}]+)}/;
            const match = bioText.match(stylePattern);

            fontName = '';
            colorName = '';
            pfpID = '';
            followers = '';

            if (match) {
                const styleString = match[1];
                const stylePairs = styleString.split(',').map(s => s.trim());

                stylePairs.forEach(pair => {
                    const [key, value] = pair.split(':').map(s => s.trim().replace(/^"|"$/g, ''));
                    if (key === 'font') fontName = value;
                    if (key === 'color') colorName = value;
                    if (key === 'pfp') pfpID = value;
                    if (key === 'ft') followers = value;
                });

                const cleanBio = bioText.replace(stylePattern, '').trim();
                bioElem.textContent = cleanBio;
            }
        }

        const fonts = [
                        "papyrus",
                        "comic-sans",
                        "times-new-roman",
                        "chalkduster",
                        "wingdings",
                        "audiowide",
                        "exo",
                        "orbitron",
                        "permanent-marker",
                        "saira-stencil-one",
                        "tektur",
                        "pricedown",
                        "love-ya-like-a-sister",
                        "andy",
                        "vcr-ocd",
                        "copperplate",
                        "pacifico",
                        "silkscreen",
                        "mojangles",
                        "impact",
                        "ubuntu",
                        "slackey",
                        ];

        let html

        // set profile font
        console.log(fontName);
        if (typeof fontName != 'undefined' && fonts.includes(fontName)) {
            const fontUrl = chrome.runtime.getURL(`../fonts/${fontName}.ttf`);
            // create html
            html = `@font-face {
                        font-family: '${fontName}';
                        src: url('${fontUrl}') format('truetype');
                        }
                        * {
                            font-family: '${fontName}' !important;
                        }
                        `;
            // generate html
            const temp = document.createElement('style');
            temp.innerHTML = html;

            // inject html
            const head = document.querySelectorAll(`head`)[0];
                if (head) {
                    head.appendChild(temp);
                    console.log('Appended font successfully');
                }
        }

        // set profile color
        if (typeof colorName != 'undefined' && isValidHex(colorName)) {
            // create html
            html = `#user-tagline, .u-username, .ico-pixel {
                        color: ${colorName} !important;
                    }
                    `;
            // generate html
            const temp = document.createElement('style');
            temp.innerHTML = html;

            // inject html
            const head = document.querySelectorAll(`head`)[0];
                if (head) {
                    head.appendChild(temp);
                    console.log('Appended font successfully');
                }
        } else {
            console.log(`invalid color: ${colorName}`);
        }

        // set profile picture
        const ico = document.querySelector('#user-title .ico');
        if (ico && pfpID != '') {
            const img = document.createElement('img');
            img.src = `https://i.imgflip.com/${pfpID}.jpg`;
            img.width = 27;
            img.height = 27;
            img.title = pfpID;
            img.onerror = () => {
                img.onerror = null;
                img.src = `https://i.imgflip.com/${pfpID}.gif`;
            };
            ico.innerHTML = '';  // Clear old content safely
            ico.appendChild(img);
        }


        // set follower title
        //if (followers != '') {
            const eas = document.querySelectorAll(".user-stat");
            eas.forEach((ea) => {
                if (ea.textContent.toLowerCase().includes("followers")) {
                    const ws = ea.textContent.split(" ");
                    const nt = ws[0] + " " + followers;
                    ea.textContent = nt;
                }
            });
        //}

    }


});
