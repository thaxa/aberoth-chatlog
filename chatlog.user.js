// ==UserScript==
// @name         Aberoth ChatLog
// @namespace    https://github.com/shobcorp/aberoth-chatlog
// @updateURL    https://raw.githubusercontent.com/shobcorp/aberoth-chatlog/main/chatlog.user.js
// @downloadURL  https://raw.githubusercontent.com/shobcorp/aberoth-chatlog/main/chatlog.user.js
// @version      1.5.327
// @description  Log chat messages to a chatbox
// @author       S.Corp
// @match        https://aberoth.com/
// @match        https://aberoth.com/index.php?*
// @icon         https://icons.duckduckgo.com/ip2/aberoth.com.ico
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

//css
GM_addStyle(`
.msg {
    display: grid;
    grid-template-columns: min-content 1fr;
    gap: 0.5em;
    padding-left:2px;
}
.msg-text {
    display: block;
    word-break: break-word;
}
.hide {
    display: none;
}
#chatboxContainer{
    background: linear-gradient(to bottom, rgb(0 0 0 / 50%), rgb(0 0 0 / 50%)), url(https://safebooru.org/images/4382/f867d2bddd7a60254fa13ac53d4adc695cf811fd.jpg);
    background-size: cover;
    background-position: center;
    width:640px;
    height:280px;
    border:5px ridge tan;
    margin:0 auto;
    display:grid;
    grid-template-rows: 30px 210px;
}
#chatboxTop, #settingsTop {
    height:30px;
    display: flex;
    justify-content: space-between;
}
#chatboxBottom{
    display: grid;
    align-items: center;
}
#messages {
    display: flex;
    flex-direction: column;
    justify-content: end;
}
#chatbox {
    border: 5px ridge tan;
    height: 200px;
    border-right: 0;
    border-left: 0;
    overflow: auto;
}
#filters{
    margin: auto 0;
    display:flex;
}
.btn {
    height: 30px;
    padding: 0 15px;
}
#bin {
    background: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="16" height="16" viewBox="0 0 16 16"%3E%3Cpath fill="%232b2116" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"%2F%3E%3C%2Fsvg%3E'),tan;
    background-repeat: no-repeat;
    background-position: center;
}
#cog{
    background: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="20" height="20" viewBox="0 0 24 24"%3E%3Cpath fill="%232b2116" d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z"%2F%3E%3C%2Fsvg%3E'), tan;
    background-repeat: no-repeat;
    background-position: center;
}
.item{
    font-size: 10pt;
    padding: 0 10px;
}
#btns{
    display: flex;
}
.rainbow {
    background-image: linear-gradient(to left, #ff6bff, #c074f7, #6464ff, #11ff11, yellow, orange, red);
    -webkit-background-clip: text;
    color: transparent;
}
input[type="checkbox"]{
    vertical-align: middle;
}
#close {
    background: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="%232b2116" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6L6.4 19Z"%2F%3E%3C%2Fsvg%3E'), tan;
    background-repeat: no-repeat;
    background-position: center;
}
#settingsMain {
    display:grid;
    grid-template-columns: 1fr 1fr;
    border-top:5px ridge tan;
    padding: 5px;
    gap: 10px;
}
#hslastupdated{
    font-size: small;
}
 `)

const CHAT_LIMIT = 500


const CHAT_COLOR_NAME = 'rgba(255,255,255,1)'
const CHAT_COLOR_NAME_UNFRIENDLY = "rgba(255,175,175,1)"
const CHAT_COLOR_NAME_THIEF = "rgba(255,215,175,1)" //holding engraved item
const NPCS = ["Inala", "Gomald", "Tavelor", "Lysis", "Sholop", "Darklow", "Wodon", "Magerlin", "Gurun"]

unsafeWindow.aberothChatLog = {}

const chatboxContainer = document.createElement('div')
chatboxContainer.id = "chatboxContainer"
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
         <div class="item">
             <label for="hiscoretoggle">
            skill total
            <input type="checkbox" name="hiscoretoggle" id="hiscoretoggle">
            </div>
      </label>
    </div>
    <div id="btns" >
        <button id="bin" class="btn"></button>
        <button id="cog" class="btn"></button>
    </div>
</div>
<div id="chatbox"><div id="messages"></div></div>
<div id="chatboxBottom"></div>

<div id="settings" style="display:none ">
    <div id="settingsTop">
    <span style="margin: auto 0;padding: 0 10px;">Settings</span>
        <div id="btns">
            <button id="close" class="btn"></button>
        </div>
    </div>
<div id="settingsMain">
   <div class="hs">
      <div class="update">
         <span>get highscore data</span>
         <button id="hsbtn">fetch</button>
      </div>
      <span id="hslastupdated"></span>
   </div>
  <div class="color">
      <div class="update">
         <span>friendly chat color</span>
         <input type="color" id="colorInput">
      </div>
   </div>
   <div class="cache">
   <span>clear message cache</span>
       <button id="clearcache">clear cache</button>
   </div>

</div>
`
document.body.appendChild(chatboxContainer)

const chatboxTop = document.getElementById('chatboxTop')
const chatbox = document.getElementById('chatbox')
const chatboxmsgs = document.getElementById('messages')
const chatboxBottom = document.getElementById('chatboxBottom')

const settingsEl = document.getElementById('settings')



//clear chat
document.getElementById('bin').addEventListener('click', () => {
  chatboxmsgs.innerHTML = '';
})

let joinleave = (GM_getValue("joinLeaveToggle", "")) ? GM_getValue("joinLeaveToggle", "") : false;
const joinLeaveToggleCheckbox = document.getElementById('joinleave')
joinLeaveToggleCheckbox.checked = joinleave;
joinLeaveToggleCheckbox.addEventListener('change', (e) => {
  joinleave = e.target.checked
  GM_setValue("joinLeaveToggle", joinleave)
  let nodes = document.querySelectorAll('.joinleave');
  if (joinleave) nodes.forEach((node) => { node.classList.add('hide') });
  else nodes.forEach((node) => { node.classList.remove('hide') });
})

let saturateToggle = (GM_getValue("saturateToggle", "")) ? GM_getValue("saturateToggle", "") : false;
const saturateToggleCheckbox = document.getElementById('satcol')
saturateToggleCheckbox.checked = saturateToggle;
saturateToggleCheckbox.addEventListener('change', (e) => {
  saturateToggle = e.target.checked
  GM_setValue("saturateToggle", saturateToggle)
})

let hiscoreSkillToggle = (GM_getValue("hiscoreToggle", "")) ? GM_getValue("hiscoreToggle", "") : false;
const hiscoreToggleCheckbox = document.getElementById('hiscoretoggle')
hiscoreToggleCheckbox.checked = hiscoreSkillToggle;
hiscoreToggleCheckbox.addEventListener('change', (e) => {
  hiscoreSkillToggle = e.target.checked
  GM_setValue("hiscoreToggle", hiscoreSkillToggle)
})

const eve = new Event("aberothchatlog")

let playerName;
window.addEventListener('load', () => {
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
  window.dispatchEvent(eve);
});

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
    //never runs
    // for (const user of Object.values(memory)) {
    //     let color = (user.col === CHAT_COLOR_NAME ? CHAT_COLOR_FRIENDLY : user.col)
    //     //check for user in highscores data
    //     const userData = HSDATA[user.name]
    //     if (hiscoreSkillToggle && userData) user.name += ` (${userData.skill})`
    //     unsafeWindow.aberothChatLog.addText(`${user.name} LEFT`, CHAT_COLOR_FRIENDLY, "joinleave", `${(joinleave) ? "hide" : ""}`);
    // }
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

      //check for user in highscores data
      let realName = (tempObj.name.endsWith('!')) ? tempObj.name.slice(0, -1) : tempObj.name
      const userData = HSDATA[realName]
      if (hiscoreSkillToggle && userData) tempObj.name += ` (${userData.skill})`

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

            //check for user in highscores data
            let realName = (text.endsWith('!')) ? text.slice(0, -1) : text
            const userData = HSDATA[realName]
            if (hiscoreSkillToggle && userData) text += ` (${userData.skill})`

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
  if (saturateToggle) {
    let arr = str2num(color)
    if (arr) color = RGBToSaturated(arr)
  }
  const div = document.createElement('div');
  div.classList.add('msg')
  cssClasses.forEach((c) => { if (c) div.classList.add(c) })
  let mHTML = `<span class="timestamp">${ts()}</span> <span class="msg-text" style="color:${color};">${text}</span>`
  //add chat to chatlog
  div.innerHTML = mHTML
  chatboxmsgs.appendChild(div)
  chatbox.scrollTop = chatbox.scrollHeight;
  //add chat to cache
  let log = (GM_getValue("msgcache", "")) ? JSON.parse(GM_getValue("msgcache", "")) : []
  log.push(div.outerHTML)
  GM_setValue("msgcache", JSON.stringify(log))
  //del oldest child
  let chatCount = chatboxmsgs.childNodes.length
  if (chatCount > CHAT_LIMIT) {
    deleteOldestMsgs()
  }
}

//load msg cache
if (GM_getValue("msgcache", "")) {
  let cachedArr = JSON.parse(GM_getValue("msgcache", ""))
  for (let msg of cachedArr) {
    chatboxmsgs.innerHTML += msg
  }
  let cachemsg = document.createElement('div')
  cachemsg.innerText = "-------------------------"
  chatboxmsgs.appendChild(cachemsg)
}

function deleteOldestMsgs() {
  //del from DOM
  chatboxmsgs.removeChild(chatboxmsgs.firstChild)

  //del from localstorage
  if (!GM_getValue("msgcache", "")) return;

  let arr = JSON.parse(GM_getValue("msgcache", ""))
  arr.shift()
  GM_setValue("msgcache", JSON.stringify(arr))
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


function loadWindow(win) {
  switch (win) {
    //settings window
    case 0:
      chatboxTop.style.display = "none"
      chatbox.style.display = "none"
      chatboxBottom.style.display = "none"
      settingsEl.style.display = "block"
      break;
    //chatlog window
    case 1:
      chatboxTop.style.display = "flex"
      chatbox.style.display = "block"
      chatboxBottom.style.display = "grid"
      settingsEl.style.display = "none"
  }
}

//settings window
const settingsBtn = document.getElementById('cog').addEventListener('click', () => {
  loadWindow(0)
})
//close settings window
const closeBtn = document.getElementById('close').addEventListener('click', () => {
  loadWindow(1)
})


//highscores settings
//GM_getValue is slow
let HSDATA = GM_getValue("users", "")
document.getElementById('hslastupdated').innerText = `updated: ${GM_getValue("time", "")}`

document.getElementById('hsbtn').addEventListener('click', () => {
  updateHighscoreData()
})

async function updateHighscoreData() {
  let json = {}
  const res = await fetch('https://aberoth.com/highscore/Most_Skillful_More.html', { cache: "no-store" })
  if (!res.ok) return;
  let data = await res.text();
  var parser = new DOMParser();
  var doc = parser.parseFromString(data, 'text/html');
  const tableEl = doc.querySelectorAll('tr')
  const userRow = [...tableEl]
  userRow.shift()
  for (let user of userRow) {
    let userTds = [...user.childNodes]
    const userObj = {}
    userObj.rank = +userTds[0].innerText
    userObj.skill = +userTds[2].innerText

    let name = userTds[1].innerText
    json[name] = userObj
  }
  GM_setValue("users", json)
  HSDATA = GM_getValue("users", "")

  GM_setValue("time", new Date().toUTCString())
  document.getElementById('hslastupdated').innerText = `updated: ${GM_getValue("time", "")}`
}


//color
let CHAT_COLOR_FRIENDLY = (GM_getValue("CHAT_COLOR_FRIENDLY")) ? GM_getValue("CHAT_COLOR_FRIENDLY") : "#ffffff"
const colorInput = document.getElementById('colorInput')
colorInput.value = CHAT_COLOR_FRIENDLY
colorInput.addEventListener('input', () => {
  CHAT_COLOR_FRIENDLY = colorInput.value
  GM_setValue("CHAT_COLOR_FRIENDLY", colorInput.value)
})


//cache
document.getElementById('clearcache').addEventListener('click', () => {
  GM_setValue("msgcache", null)
})
