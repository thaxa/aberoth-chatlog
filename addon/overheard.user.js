// ==UserScript==
// @name         Aberoth ChatLog: Overheard
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Shows players,daynight & moon phase in Aberoth ChatLog
// @author       S.Corp
// @match        https://aberoth.com/
// @match        https://aberoth.com/index.php?*
// @icon         https://icons.duckduckgo.com/ip2/aberoth.com.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at document-start
// ==/UserScript==

GM_addStyle(`#overheard{display: grid;align-items: center;grid-template-columns: repeat(3, min-content);}.OH-item{padding: 0 10px;}#OH-time{font-size: 10pt;}#update-container{display: grid;grid-template-columns: 1fr 1fr;}`)
window.addEventListener("aberothchatlog", (e) => {
    console.log("ACL: Overheard")
    run()
})
let interval;
let delay = (GM_getValue("OHDelay", "")) ? GM_getValue("OHDelay", "") : 30
function run() {
    const filters = document.getElementById('filters')
    const newEle = document.createElement('div')
    newEle.id = "overheard"
    newEle.innerHTML = `
        <div id="OH-online" class="OH-item"></div>
        <div id="OH-time" class="OH-item"></div>
        <div id="OH-moon" class="OH-item"></div>`
    filters.after(newEle)
    const settingsEl = document.getElementById('settingsMain');
    let custom = `
        <div class="OH-settings">
           <span>Tavelor's Tavern update frequency</span>
           <div id="update-container">
              <div>
                 <label for="2min">2 minutes</label>
                 <input type="radio" id="2min" ${(delay === 2) ? "checked" : ""} name="update" value="2">
              </div>
              <div>
                 <label for="5min">5 minutes</label>
                 <input type="radio" id="5min" ${(delay === 5) ? "checked" : ""} name="update" value="5">
              </div>
              <div>
                 <label for="10min">10 minutes</label>
                 <input type="radio" id="10min" ${(delay === 10) ? "checked" : ""} name="update" value="10">
              </div>
              <div>
                 <label for="30min">30 minutes</label>
                 <input type="radio" id="30min" ${(delay === 30) ? "checked" : ""} name="update" value="30">
              </div>
           </div>
        </div>`
    settingsEl.insertAdjacentHTML('beforeend', custom);
    const uc = document.getElementById('update-container')
    uc.addEventListener('click', (e) => {
        if (e.target.type === 'radio') {
            delay = +e.target.value
            GM_setValue("OHDelay", delay)
            clearInterval(interval)

            //start new timer
            interval = setInterval(() => {
                updateOnline()
            }, 60 * 1000 * delay)
        }
    })
    updateOnline()
    interval = setInterval(() => {
        updateOnline()
    }, 60 * 5000 * delay)
}

async function updateOnline() {
    const res = await fetch('https://aberoth.com/highscore/overheard.html', { cache: "no-store" })
    if (!res.ok) return;
    let data = await res.text();
    var parser = new DOMParser();
    var doc = parser.parseFromString(data, 'text/html');
    const div = doc.querySelectorAll('div')[1]
    const text = div.innerHTML.split('<br>')
    const online = text[0].replace(/\D/g, '')
    document.getElementById('OH-online').innerText = `${online}`
    let dayOrNight = (text[0].includes("tonight")) ? "🌙" : "☀️"
    document.getElementById('OH-time').innerText = `${dayOrNight}`
    let moon = text[2]
    let img = ""
    switch (moon) {
        case 'waxing crescent':
        case 'The moon is a waxing crescent.':
            img = "data:image/webp;base64,UklGRtgAAABXRUJQVlA4WAoAAAAQAAAADQAADQAAQUxQSCgAAAABDzD/ERFCTSRJ0b0QnoSVgn8XSCD8IcJDRP+jac87Lh5e+XCxo+fKVlA4IIoAAACQAgCdASoOAA4AAkA4JZwCdAYrFmAHyxrO5j1hAAD++/cxAae/nospAx2uL6vsGifzybXR2nCekjMaGNV7DtAVsR0HxfolM7XAfz77hwihZ69jr16dtB9NC5tvP0PtHezeDVJG2CadvCWpYsK5+klCRzz14vRg7WCBQPAfMMv+WGvAnm1PrH4AAAA="
            break;
        case 'first quarter':
            img = "data:image/webp;base64,UklGRtgAAABXRUJQVlA4WAoAAAAQAAAADQAADQAAQUxQSCgAAAABDzD/ERFCTSRJ0b0QnoSVgn8XSCD8IcJDRP+jac87Lh5e+XCxo+fKVlA4IIoAAACQAgCdASoOAA4AAkA4JZQCdAYsz8AO3Jws/159gAD++wpP0h2VMyPtOnS3s9EF8Zvi/6Jdku+/SsVywgSFXMHsLfZeQ7YePNuf8cPvsE/fsqMLDOF0Uzgb/8sxxotbjnSFrMEkd22x0tmpWN8vfcxu8on+1XSY9oYReNGl8NDIa25pAzjIyeZp8AA="
            break;
        case 'waxing gibbous':
        case 'The moon is nearly full.':
            img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAA8FBMVEUAAAAAAADd3eLFyNWTp8s+PkM4O0I3OUI8PD4uMTjX2+rs6+nk4+WqvuWtvd/U1dzEydrLzdjIzdi5wtWYp8KVpcImM0dAQUU0OEIqMkEvMz8kLTs4ODoZJjktMDMlJyiixva0yu7G0eqQr+WguOS+yeDY3N+xvt3Q0dqpt9iktdjR0deTq9fe2tbM0NGzvdGuutChstCcrcuLncB4kL2DlLV9kLWSmq1/kKuIlKeIjp58iZ56gpBhcYuLjIh/hYdweH1YZHVJVGVUXWRiY2JZXF1fXVlTWFksN0lCQUQxNUBBQD8fKjs2NzoSHCkeICPku23+AAAAAXRSTlMAQObYZgAAAJtJREFUCNdFz0UCg0AQBEAWd4fgxN3d3fX/v8kCkT5NnboHiQLiwCPR07/3x1vwkeu7s3bLWIBYDsMwereD9zYAKrAe3tzAqyI+iJgiaXpazwnZkr4DMYlKPp1hWW0FeaGuhCgUFAnll5A3yj6PZFkto9wRMiQcc4hhisQ3QFTkUbapYTWU2yfFAWlN1GLz8J0FXuH69B+N/D54Az/wDpdFVVyaAAAAAElFTkSuQmCC"
            break;
        case 'full moon':
        case 'The moon is full.':
            img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAABEVBMVEUAAAAAAADEyNewt9Obq8va3uzt6+qPr+erv+aguObd3OC4xODOztzR0dnLzdjIzdi3wtamt9WwvdS1u9OTpMq+vceYp8SvsriWobWixva1y+/J1O53o+jl5Off3+bl4+WxweO+yeDY3N/U1t+svd9/ot6nuNvV1drSztrEydq9x9mpt9iTq9fe2tbMyNa4wNSCn9TEx9OardPM0NGWq9CotM/Cwc6er82UqMyJnsygsMuutcnPzMjHw8OWp8J6k8G2tsBxkL9ihr+ImrxUfrp5kLibprdMd7ePmrGDlbGQnKiPlpxneJSNjoqCiIpyfYQ4WIRweH17fnxdanxfZ29NWGpXYGdiY2JZXF1fXVlTWFlwznBgAAAAAXRSTlMAQObYZgAAAKFJREFUCNdjAAFGMAAyILwAdyd7z1BGKM/VxdFKSIDFhxHME/OQkBAzFzQRCWYE8rxMxR3c7CzUFIycQVweYVtRax12DmluljBGEFfUTJtTUoqVVcsPyNVgZmFS4VDkU5aT9QVybZgt2bk1mfh5udgigdwgPREZTiYmPnV5XUaQReLMBqr6hkDJcIjF3gKCQvxKxhEwZzGG+AdGIRzNAPcBAIjHEVn1GvRpAAAAAElFTkSuQmCC"
            break;
        case 'waning gibbous':
        case 'The moon is a waning gibbous.':
            img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAA5FBMVEUAAAAAAACeoalGRklFREU5PUUwNkDFyNWXp8NKSUlBQUMcHByPr+e8x9/OztzCyNq4wdWwt9KnttKfsMyVpsy+vcevsriWobVDQ0UqLzkqLCsgIycZHSCixvZ3o+ifuOesv+SguOSsvd9/ot7SztrFydipt9iTq9fMyNauvdWwt9SCn9Szu9O3u9LCwc6bqs2JnsyutcnPzMjHw8O2tsBxkL9ihr+On7tUfrp5kLibprdMd7eFlraPmrGDkKyQnKiLlKWPlpxyfYQ4WIR7fnxfZ28/Q0s0OUMtMz8mLj0gJi4fHx+hHZLjAAAAAXRSTlMAQObYZgAAAJpJREFUCNctztUWgzAMBuAVaPHhMAZzd3d3e//3WQrNVb78OSfJ0EJJQZPqtlt+whgxbdYL54zJFyWSDkEgOS/yjhDoZPvzreQeMQkps/2ZN2lp+ycmMQIOvGGzUljxPM4D692RUS3rXI6XKafWWNONBqcIsgq8t91iSRQhFRA95Fu9milC+AOCL6bd4QQFVtnLj2ukokRswPAH+oUNMCKCUawAAAAASUVORK5CYII="
            break;
        case 'third quarter':
        case 'The moon is in its third quarter.':
            img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAA21BMVEUAAAAAAABAQUM9P0MwNkBJSEhFRUUcHR2wt9NFRUk4PkjOztyot9a1u9OWpMi+vcevsrh7kLaWobV3hJg0PUtDQ0U0OUQ5PEMqLCsZHSCNruh3o+ifuOesvd9/ot66xN3SztrCxtjMyNa3wtaCn9SotM/Cwc6bqs2JnsyutcnPzMjHw8O2tsBxkL9UfrqbprdMd7eHlrOPmrGYnqxzhqmbnaiQnKiIlKeQl6Z9ip+PlpxNaZY4WIR7fnxfZ29ZYmg/Q0stN0gtMz8mLj0rMDspLzggJi4jJicdISeKBjGOAAAAAXRSTlMAQObYZgAAAJRJREFUCNctzVUSwzAMBNDKdsBuGmralJmZmfn+J6ocZ7/0tKNRQgai4KB0mh2f7zzE8ibjfRiyD0SyF76fZln2+AFq03ZHU6RgL8lkauj0V/fgJhieI52O5QWCc5pD1sxuvTynJMM1yYHZK1SXlBBdM5Dnhl0srbHVdJCPXLNV2VFVSh+a1pbqRAkNl+vXACW1iPEHa/AMDzvTmEsAAAAASUVORK5CYII="
            break;
        case 'waning crescent':
        case 'The moon is a waning crescent.':
            img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAvVBMVEUAAAAAAAA+P0NFREUbHB5JSEg2PEc6PUQ1OURBQUMxNkAuND7Pztuwt9JFRUk6PkgwOUgvNkKWpMg3OkAuMjonLjoqLCsgIyd3o+jMyNa3wtayudSmt9SCn9S3u9KotM+bqs2JnszPzMi9vsfHw8O2tsBxkL9ihr9UfrqtsLl5kLixs7dMd7dviLaXobSPmrFkf66Ym6mQnKiYl6KPlpyWk5t0fY5yfYQ4WIR7fnxfZ28zPk0/Q0sgJi4fHx8BHsvPAAAAAXRSTlMAQObYZgAAAJJJREFUCNc9z9cOgzAMBdA6gSQkBRJG6d57793+/2cVh4r75CNZunYFAzY4Wd3XszR14K/lfCpjLj9gFe22VyWFURnkOvYWk0QpwUyCrLbGl9ho9g6lAzm7o5PQrzAIeA3p9w+MhYQGLnLoDzacEOJRF5cfjaiurShg0crv7DnyWxSfm21BqFeeBc9b5gCqSPnBD1OBCcPo4QnLAAAAAElFTkSuQmCC"
            break;
        case 'new moon':
            img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAgVBMVEUAAAAAAAA+P0NBQUQ3OkIxNkA0O0g8PkVJSEg0OUQ5PEMuMjgaHB5DREZFREUuNUE8PD0vND03ODokJydBREtFRkgsN0g4PUcmM0c9PUE1OEEqMkFAQEAuMz8hKzwqLzkZJjktMDMqLCsdISceHh8zPk05QEsmLj0mLTogJi4SHCkQjkRYAAAAAXRSTlMAQObYZgAAAIpJREFUCNc9z1cWhCAMBdAJUgRsgL07Tt//AoeIx/eVe/KRvBsGjvgh6LfO7yWBU591ZlSxLxwyWmvDZD7t4LX11mqTy4YtyIgWRZ/XvGxYAp6q6CR/vspK3JGUCc4FSasYOdKhFoKQKIsfno5MLfdK4wzwkKVDq7qwRG9KUpKO11uwO5cAKuRq8AdOowd5YQ9b4gAAAABJRU5ErkJggg=="
    }
    document.getElementById('OH-moon').innerHTML = `<img title="${moon}" src="${img}">`
}

