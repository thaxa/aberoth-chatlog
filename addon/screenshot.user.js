// ==UserScript==
// @name         Aberoth ChatLog: Screenshot
// @namespace    https://github.com/shobcorp/aberoth-chatlog/blob/main/addon/screenshot.user.js
// @updateURL    https://raw.githubusercontent.com/shobcorp/aberoth-chatlog/main/addon/screenshot.user.js
// @downloadURL  https://raw.githubusercontent.com/shobcorp/aberoth-chatlog/main/addon/screenshot.user.js
// @version      1.0
// @description  Adds btn to copy screenshot to clipboard (about:config -> clipboardItem FF)
// @author       S.Corp
// @match        https://aberoth.com/
// @match        https://aberoth.com/index.php?*
// @icon         https://icons.duckduckgo.com/ip2/aberoth.com.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at document-start
// ==/UserScript==

GM_addStyle(`#shot{background:url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="%232b2116" d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m8 3a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m0 2a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3Z"%2F%3E%3C%2Fsvg%3E'), tan;background-repeat: no-repeat;background-position: center;}`)

window.addEventListener("aberothchatlog", (e) => {
    console.log("ACL: Screenshot")
    run()
})

function run() {
    const btns = document.getElementById('btns');
    const btn = document.createElement('button')
    btn.id = "shot"
    btn.classList.add('btn')
    btn.addEventListener('click', () => {
        if (copyToToggle) {
            app.canvas.toBlob((b) => {
                const img = new ClipboardItem({ "image/png": b });
                navigator.clipboard.write([img]);
            })
        }
        if (newtabToggle) {
            let url = app.canvas.toDataURL()
            app.canvas.toBlob((b) => {
                const blobUrl = URL.createObjectURL(b);
                window.open(blobUrl, '_blank');
            })
        }
    })
    btns.insertBefore(btn, btns.firstChild)
    const settingsEl = document.getElementById('settingsMain')
    const custom = `
    <div class="SS-settings">
            <label for="SS-copy" >Copy image to clipboard
                <input type="checkbox"  name="SS-copy" id="SS-copy">
            </label>
            <br>
            <label for="SS-tab">Open image in new tab
                <input type="checkbox" name="SS-tab" id="SS-newtab">
            </label>
     </div>`
    settingsEl.insertAdjacentHTML('beforeend', custom);
    let newtabToggle = (GM_getValue("newtab", "")) ? GM_getValue("newtab", "") : false;
    const newtabCheckbox = document.getElementById('SS-newtab')
    newtabCheckbox.checked = newtabToggle;
    newtabCheckbox.addEventListener('change', (e) => {
        newtabToggle = e.target.checked
        GM_setValue("newtab", newtabToggle)
    })
    let copyToToggle = (GM_getValue("copyto", "")) ? GM_getValue("copyto", "") : true;
    const copyToCheckbox = document.getElementById('SS-copy')
    copyToCheckbox.checked = copyToToggle;
    copyToCheckbox.addEventListener('change', (e) => {
        copyToToggle = e.target.checked
        GM_setValue("copyto", copyToToggle)
    })
}
