if (typeof window !== "undefined" && window.location.href.includes("imgflip.com/settings")) {
  const page = document.querySelector("#user-page");

  const settingBtn = document.createElement("button");
  settingBtn.className = "imgx-settingBtn";
  settingBtn.textContent = "imgx Settings";
  settingBtn.style.cursor = "pointer";
  settingBtn.style.border = "1px solid #ccc";
  settingBtn.style.padding = "4px 8px";
  settingBtn.style.marginBottom = "10px";

  page.prepend(settingBtn);

  settingBtn.addEventListener("click", () => {
    try {
        chrome.runtime.sendMessage({ action: "openOptions" });
    } catch (err) {
        browser.runtime.sendMessage({ action: "openOptions" });
    }
  });

  const updateBtn = document.createElement("button");
  updateBtn.className = "imgx-settingBtn";
  updateBtn.textContent = "imgx Logs";
  updateBtn.style.cursor = "pointer";
  updateBtn.style.border = "1px solid #ccc";
  updateBtn.style.padding = "4px 8px";
  updateBtn.style.marginBottom = "10px";

  page.prepend(updateBtn);

  updateBtn.addEventListener("click", () => {
    try {
        chrome.runtime.sendMessage({ action: "openUpdates" });
    } catch (err) {
        browser.runtime.sendMessage({ action: "openUpdates" });
    }
 
  });
}
