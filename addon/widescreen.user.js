// ==UserScript==
// @name         Aberoth ChatLog: Widescreen
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds widescreen toggle in Aberoth ChatLog
// @author       S.Corp
// @match        https://aberoth.com/
// @match        https://aberoth.com/index.php?*
// @icon         https://icons.duckduckgo.com/ip2/aberoth.com.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at document-start
// ==/UserScript==

GM_addStyle(`#wide{background:url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="%232b2116" d="M14 17h5v-5h-2v3h-3v2Zm-9-5h2V9h3V7H5v5Zm-1 8q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Z"%2F%3E%3C%2Fsvg%3E'), tan;background-repeat: no-repeat;background-position: center;}`)

let gameWidth = (GM_getValue("gameWidth", "")) ? GM_getValue("gameWidth", "") : 640
GM_setValue("gameWidth", gameWidth)
let gameHeight = (GM_getValue("gameHeight", "")) ? GM_getValue("gameHeight", "") : 480
GM_setValue("gameHeight", gameHeight)
let screenDefinition = (gameWidth === 640 && gameHeight === 480) ? 0 : 1

window.addEventListener("aberothchatlog", (e) => {
    document.getElementById('screen').width = gameWidth
    document.getElementById('screen').height = gameHeight
    console.log("ACL: Widescreen")
    run()
})

function run() {
    const btns = document.getElementById('btns');
    const btn = document.createElement('button')
    btn.id = "wide"
    btn.classList.add('btn')
    btn.addEventListener('click', () => {
        if (gameWidth === 640) gameWidth = 960
        else gameWidth = 640
        if (gameHeight === 480) gameHeight = 540
        else gameHeight = 480
        GM_setValue("gameWidth", gameWidth)
        GM_setValue("gameHeight", gameHeight)
        if (gameWidth === 640 && gameHeight === 480) screenDefinition = 0
        else screenDefinition = 1
        app = new App()
    })
    btns.insertBefore(btn, btns.firstChild)
}

window.addEventListener('load', () => {
    const EKFunc = App.prototype.EK
    if (EKFunc) {
        App.prototype.EK = function () {
            EK(this, arguments);
        };
    }
});

function EK(t, a) {
    autoLoad.screendefinition = screenDefinition
    t.sizeX = gameWidth
    t.sizeY = gameHeight
    t.canvas.width = gameWidth;
    t.canvas.height = gameHeight;
}
