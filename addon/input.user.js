// ==UserScript==
// @name         Aberoth ChatLog: Input
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Chat from input box below log, kind of buggy
// @author       S.Corp
// @match        https://aberoth.com/
// @match        https://aberoth.com/index.php?*
// @icon         https://icons.duckduckgo.com/ip2/aberoth.com.ico
// @grant        GM_addStyle
// @run-at document-start
// ==/UserScript==

GM_addStyle(`#chatinput{all:unset;height: 100%;background: #000000;padding-left:10px}`)

window.addEventListener("aberothchatlog",(e)=>{
    console.log("ACL: Input")
    run()
})

function run(){
    let inputValue="";
    document.body.addEventListener('keydown',(e)=>{
        if(e.keyCode === 13){
            if(document.activeElement.tagName === "BODY"){
                chatInput.focus()
                e.stopPropagation();
            }
        }
    })
    const chatboxBottom = document.getElementById('chatboxBottom')
    chatboxBottom.innerHTML = `<input id="chatinput" type="text" class="ACL-input" value="">`
    const chatInput = document.getElementById('chatinput')
    chatInput.addEventListener('keydown', async(e) => {
        let keycode = e.keyCode
        if(keycode === 13) {
            chatInput.blur()
            let str = chatInput.value
            sendInput(str)
            e.currentTarget.value = "";
        }
        e.stopPropagation();
    });
    document.body.addEventListener('click', (e) => {
        if(e.target?.id !== chatInput.id) chatInput.blur()
    });
}
let valid=[8,9,10,27,32,127,48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,42,43,45,46,47,59,61,44,96,91,92,93,39,41,33,64,35,36,37,94,38,40,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,58,60,95,62,63,126,123,124,125,34];
function getKeyCodes(str) {
    var keyCodes = [];
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        if(valid.includes(char)){
            keyCodes.push(char);
        }
    }
    return keyCodes;
}
function sendInput(str){
    const enter = [255, 0, 8, 14, 0, 0, 0, 1, 16, 10, 2]
    const esc = [255, 0, 8, 14, 0, 0, 0, 1, 16, 27, 2]
    sendPacket(esc)
    let codearr = getKeyCodes(str)
    sendPacket(enter)
    for(let c of codearr){
        let pkt = createPKT(c)
        sendPacket(pkt)
    }
    sendPacket(enter)
    sendPacket(esc)
}
function createPKT(code) {
    let arr = [255, 0, 8, 14, 0, 0, 0, 1, 16, 0, 2]
    arr[9] = code
    return arr
}
function sendPacket(pkt){
    app.game.Hc.GO(new Uint8Array(pkt).buffer);
}
