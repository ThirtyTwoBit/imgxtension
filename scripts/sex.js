if (typeof window !== "undefined" && window.location.href.includes("imgflip.com/sex")) {
    box = document.querySelector('.info-page.ibox');
    html = `<h1>sex</h1>
            <div style="width:360px;max-width:100%;"><div style="height:0;padding-bottom:72.22%;position:relative;"><iframe width="360" height="260" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameBorder="0" src="https://imgflip.com/embed/9geor3"></iframe></div><p></p></div>`;
    box.innerHTML = html;

    document.title = 'sex';
}


const now = new Date();
console.log("date");
const isAprilFools =
  now.getMonth() === 3 &&  // April (0 = January)
  now.getDate() === 1;
const year = now.getFullYear;

const rand = Math.floor(Math.random() * 3) + 1; // Returns 1, 2, or 3   

if (isAprilFools && rand == 1 && typeof window !== "undefined" && window.location.href.includes("imgflip.com")) {
    box = document.getElementById('panel');
    html = `<div class="shutdown-banner">ALERT: Early warning. Imgflip.com will be shutting down effective November 2nd, ${year}. Thank you for the decade of amazing memes!
    <span class="shutdown-btn">[Close]</span></div>`;
    box.innerHTML += html;

    box.querySelector(".shutdown-btn")
    .addEventListener("click", () => {
        box.querySelector(".shutdown-banner")
        .remove();
    });
}
