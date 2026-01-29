
chrome.storage.local.get(['totalFollow'], result => {
    const setting = result.totalFollow ?? false; 

    if (typeof window !== "undefined" && window.location.href.includes("imgflip.com/followed-users") && setting == true) {
        const rows = document.querySelectorAll("a.row");
        const fcount = rows.length;
        let follow_title = document.querySelector(".tu-user");
        follow_title.textContent += ` (${fcount} Total)`;

    }
});
