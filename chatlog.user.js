// ==UserScript==
// @name         Aberoth ChatLog
// @namespace    https://github.com/shobcorp/aberoth-chatlog
// @updateURL    https://raw.githubusercontent.com/shobcorp/aberoth-chatlog/main/chatlog.user.js
// @downloadURL  https://raw.githubusercontent.com/shobcorp/aberoth-chatlog/main/chatlog.user.js
// @version      0.3.2.74
// @description  Log chat messages to a chatbox
// @author       S.Corp
// @match        https://aberoth.com/*
// @icon         https://icons.duckduckgo.com/ip2/aberoth.com.ico
// @grant        GM_addStyle
// @grant       unsafeWindow

// ==/UserScript==

//css
GM_addStyle(`.msg {display: grid;grid-template-columns: min-content 1fr;gap: 0.5em;}.hide {display: none;}#chatboxTop, #chatboxBottom {height: 30px;width: 640px;background: #2b2116;display: grid;align-content: center;}#chatboxTop {display: flex;justify-content: space-between;}#messages {display: flex;flex-direction: column;justify-content: end;}#chatbox {border: 5px ridge tan;height: 200px;border-right: 0;border-left: 0;overflow: auto;}#filters{margin: auto 0;display:flex;}#bin {background: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="16" height="16" viewBox="0 0 16 16"%3E%3Cpath fill="%232b2116" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"%2F%3E%3C%2Fsvg%3E'),tan;color: white;height: 30px;background-repeat: no-repeat;background-position: center;width: 40px;}.item{font-size: 12pt;padding: 0 10px;}#btns{padding:0 10px;margin: auto 0;}.rainbow {background-image: linear-gradient(to left, #ff6bff, #c074f7, #6464ff, #11ff11, yellow, orange, red);-webkit-background-clip: text;color: transparent;}input[type="checkbox"]{vertical-align: middle;}`)

const CHAT_COLOR_FRIENDLY = "#95D776"
const CHAT_LIMIT = 200


const CHAT_COLOR_NAME = 'rgba(255,255,255,1)'
const CHAT_COLOR_NAME_UNFRIENDLY = "rgba(255,175,175,1)"
const CHAT_COLOR_NAME_THIEF = "rgba(255,215,175,1)" //holding engraved item
const NPCS = ["Inala", "Gomald", "Tavelor", "Lysis", "Sholop", "Darklow", "Wodon", "Magerlin", "Gurun"]

unsafeWindow.aberothChatLog = {}

const chatboxContainer = document.createElement('div')
chatboxContainer.id = "chatboxContainer"
chatboxContainer.style.background = "#2b2116"
chatboxContainer.style.width = "640px"
chatboxContainer.style.border = "5px ridge tan"
chatboxContainer.style.margin = "0 auto"
chatboxContainer.innerHTML = `
<div id="chatboxTop">
    <div id="filters">
        <div class="item">
            <label for="joinleave">join/leave
            <input type="checkbox" name="joinleave" id="joinleave">
            </label>
        </div>
         <div class="item">
            <label for="satcol" class="rainbow" title="might not work well">saturate color
            <input type="checkbox" name="satcol" id="satcol">
            </label>
        </div>
    </div>
    <div id="btns" >
        <button id="bin"></button>
    </div>
</div>
<div id="chatbox"><div id="messages"></div></div>
<div id="chatboxBottom"></div>
`
document.body.appendChild(chatboxContainer)

const chatbox = document.getElementById('chatbox')
const chatboxmsgs = document.getElementById('messages')

//clear chat
document.getElementById('bin').addEventListener('click', () => {
    chatboxmsgs.innerHTML = '';
})

let joinleave = false
document.getElementById('joinleave').addEventListener('change', (e) => {
    let nodes = document.querySelectorAll('.joinleave');
    joinleave = !joinleave
    e.target.checked = joinleave
    if (joinleave) {
        nodes.forEach((node) => {
            node.classList.add('hide')
        })
    }
    else {
        nodes.forEach((node) => {
            node.classList.remove('hide')
        })
    }
})

let saturateColors = false;
document.getElementById('satcol').addEventListener('change', (e) => {
    saturateColors = !saturateColors
    e.target.checked = saturateColors
    if (saturateColors) { }
})

let playerName;
window.addEventListener('load', function () {
    playerName = app.game.playerName.charAt(0).toUpperCase() + app.game.playerName.slice(1)
    //hook into textCommand
    const FrFunc = ES.prototype.Fr
    if (FrFunc) {
        console.log("LOADED CHATLOG")
        ES.prototype.Fr = function () {
            Fr(this, arguments);
            return FrFunc.apply(this, arguments);
        };
    }
}, false);

//local app.game.Bc.DA
let memory = {}

function Fr(t, a) {
    let CX = t.CX
    const Ge = t.Ff.peek();
    const data = Ge.bytes;
    const mix = Ge.mix;
    const IN = data[CX];
    const id = t.Bx(mix, CX + 1);
    const x = t.Bx(mix, CX + 3);
    const y = t.Bx(mix, CX + 5);
    const HR = data[CX + 7];
    CX += 8;
    let text = null

    //clear all text on screen (moving rooms)
    if (id === 0) {
        for (const user of Object.values(memory)) {
            let color = (user.col === CHAT_COLOR_NAME ? CHAT_COLOR_FRIENDLY : user.col)
            unsafeWindow.aberothChatLog.addText(`${user.name} LEFT`, CHAT_COLOR_FRIENDLY, "joinleave", `${(joinleave) ? "hide" : ""}`);
        }
        memory = {}
    }
    if (IN === 8) {
        text = t.Bz(Ge, CX + 2);
        CX += text.length + 4;
        //game sends a chat ID with "" to delete it
        if (memory[id] && text === '') {
            let tempObj = { ...memory[id] }
            delete memory[id]
            //if user still exists, stop
            if (Object.values(memory).find(e => e.name === tempObj.name)) return;
            let color = tempObj.col === CHAT_COLOR_NAME ? CHAT_COLOR_FRIENDLY : tempObj.col
            unsafeWindow.aberothChatLog.addText(`${tempObj.name} LEFT`, color, "joinleave", `${(joinleave) ? "hide" : ""}`);
        }
        //text not game info, or 'Say:[text]' or '...'
        if ((x !== 0 || y !== 0) && text !== '...') {
            if (text === playerName || NPCS.includes(text)) return;
            switch (app.game.Bc.HI) {
                case CHAT_COLOR_NAME:
                case CHAT_COLOR_NAME_UNFRIENDLY:
                case CHAT_COLOR_NAME_THIEF:

                    //if user doesnt exist (with dif ID), log join
                    if (!Object.values(memory).find(e => e.name === text)) {
                        if (app.game.Bc.HI === CHAT_COLOR_NAME) unsafeWindow.aberothChatLog.addText(`${text} JOINED`, CHAT_COLOR_FRIENDLY, "joinleave", `${(joinleave) ? "hide" : ""}`)
                        else unsafeWindow.aberothChatLog.addText(`${text} JOINED`, app.game.Bc.HI, "joinleave", `${(joinleave) ? "hide" : ""}`)
                    }
                    memory[id] = {}
                    memory[id].name = text
                    memory[id].col = app.game.Bc.HI
                    break;

                default:
                    unsafeWindow.aberothChatLog.addText(text, app.game.Bc.HI)
                    break;
            }
        }
    }
}

function ts() {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
}


unsafeWindow.aberothChatLog.addText = function addText(text, color = "white", ...cssClasses) {
    if (saturateColors) {
        let arr = str2num(color)
        if (arr) color = RGBToSaturated(arr)
    }
    const div = document.createElement('div');
    div.classList.add('msg')
    cssClasses.forEach((c) => { if (c) div.classList.add(c) })
    div.innerHTML = `<span class="timestamp">${ts()}</span> <span style="color:${color}; display: block;word-break: break-word;">${text}</span>`
    chatboxmsgs.appendChild(div)
    chatbox.scrollTop = chatbox.scrollHeight;
    //del oldest child
    let chatCount = chatboxmsgs.childNodes.length
    if (chatCount > CHAT_LIMIT) chatboxmsgs.removeChild(chatboxmsgs.firstChild)
}

function str2num(s) {
    if (s === CHAT_COLOR_FRIENDLY) return;
    let a = s.slice(5, -1);
    let x = a.split(',').map(Number)
    return x
}

//https://css-tricks.com/converting-color-spaces-in-javascript/
function RGBToSaturated(arr) {
    let [r, g, b] = arr
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = 100
    l = +(l * 100).toFixed(1);
    return "hsl(" + h + "," + s + "%," + l + "%)";
}
