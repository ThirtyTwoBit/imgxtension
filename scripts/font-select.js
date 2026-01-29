chrome.storage.local.get(['useFont'], result => {
    const setting = result.useFont ?? false; 

    if (typeof window !== "undefined" && window.location.href.includes("imgflip.com") && setting == true) {
        chrome.storage.local.get(['font'], result => {
        const font = result.font ?? 0;
        if (font == undefined || font == null) {
            font = 0;
        };

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
                        "montserrat",
                        ];

        let html

        const fontUrl = chrome.runtime.getURL(`../fonts/${fonts[font]}.ttf`);
        // create html
        html = `@font-face {
                    font-family: '${fonts[font]}';
                    src: url('${fontUrl}') format('truetype');
                    }
                    * {
                        font-family: '${fonts[font]}';
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
    })}
});
