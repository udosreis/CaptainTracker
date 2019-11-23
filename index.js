//Axios defaults
axios.defaults.headers.common['Authorization'] = "561d74b671cff6b82ca5a334e9cf8f48";

//Get official game names
var officialNames = ["Team's of 20","50 vs 50", "50 vs 50 HE","Food Fight","High Stakes","Blitz","Classic","Blitz Showdown","","","","Winter Royale","Final Fight","Fly Explosives","Ground Game","Barebones","Love Shot","One Shot","Marshmello Concert","Playground","Playground","Team Rumble","Score Royale","Showdown","Showdown (ALT)","Sneaky Silencers","Solid Gold","Sword Fight","Catch","Trios","Wild West","Creative","Close Encounters","Disco","Sniper Shootout","goose","vamp","slide","hover","ashton","fill","Steady Storm","wax","Soaring 50's","slide","Showdown","High Explosives","green","Soaring 50's","Unvaulted","bison"]
var databaseNames = ["5x20","50v50","50v50he","barrier","bling","blitz","classic","comp","defaultduo","defaultsolo","defaultsquad","deimos","final","flyexplosives","ground","hard","love","low","music","playground","playgroundv2","respawn","score","showdowntournament","showdownalt","sneaky","solidgold","sword","toss","trios","ww","creative","close","disco","snipers","goose","vamp","slide","hover","ashton","fill","steady","wax","soaring","slide","showdown","highexplosives","green","50v50sau","unvaulted","bison"]

//Statistic Variables
var pinnedUsers = []
var pinnedUserNumbers = []
var totalUsersEver = 0
var mode = 3 // 0 - Default   1 - Compare   2 - Share   3 - News
var currentGamemode = "defaultsolo"
var currentStatSpan = "alltime"
var gamingConsole = 'pc'
var storedStatCode = ''

//Share
let imgSRC = ["IMAGES/Heads/Banana.png","IMAGES/Heads/BlackHeart.png","IMAGES/Heads/BunkerJonesy.png","IMAGES/Heads/Calamity.png","IMAGES/Heads/Drift.png","IMAGES/Heads/Ember.png","IMAGES/Heads/Fable.png","IMAGES/Heads/GiddyUp.png","IMAGES/Heads/Huntress.png","IMAGES/Heads/Hybrid.png","IMAGES/Heads/PoisedPlaymaker.png","IMAGES/Heads/Stratus.png","IMAGES/Heads/SunStrider.png","IMAGES/Heads/Vega.png"]
/*async function imageToBase64Prom(imageId) {
        var img = document.createElement("img");
        img.crossOrigin = 'Anonymous';
        img.src = imgSRC[imageId]
        var canvas = document.createElement("canvas");
        canvas.width = 276;
        canvas.height = 276;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var imgd = canvas.toDataURL("image/png");
        return(imgd)
}*/
var tempShare = [];
class shareTemp {
    constructor(tempCode,color) {
        this.tempCode = tempCode
        this.color = color
    }
}
var shareStyle = 0 //0 - Card    1 - MSG    2 - NEWS
var lastCardNum = 0
var imgShareNum = 0
var numOfImgHeads = 14
msgColors = ["4A90E2","F5A623","D3122A","7243C0"]
class phrase {
    constructor(topPhrase, bottomPhrase) {
        this.topPhrase = topPhrase
        this.bottomPhrase = bottomPhrase
    }
}

//User Class
class User {
    constructor(username,userID, fnstats, number,fnstatsv1) {
        this.username = username;
        this.userID = userID
        this.fnstats = fnstats
        this.number = number
        this.fnstatsv1 = fnstatsv1
    }
}

//News
var currentNews = []
var currentShop = []
var tweetCode = ""
var chosenNews = 0
var numberOfNews = 0
class News{
    constructor(image, title, details) {
        this.image = image
        this.title = title
        this.details = details
    }
}
class shopItem {
    constructor(image, cost) {
        this.image = image
        this.cost = cost
    }
}

//Startup
updateMode(3)

//Load saved users
var loadedData = localStorage.getItem("savedUsernames")
console.log(loadedData)
var loadedUsernameList = []
while (loadedData.indexOf("|[]{}|?") != -1) {
    console.log(loadedData)
    let loadedUsername = loadedData.substr(0,loadedData.indexOf("|[]{}|?"))
    loadedUsernameList.push(loadedUsername)
    loadedData = loadedData.substr(loadedData.indexOf("|[]{}|?")+7)
    console.log(loadedUsername)

    if (loadedUsername != "") {
        axios.get("https://fortnite-user-api.theapinetwork.com/users/id?username="+loadedUsername)
            .then(function (response) {
            console.log(response)
            let fnUserID = response.data.data.uid
            axios.get("https://fortnite-api.theapinetwork.com/prod09/users/public/br_stats_v2?user_id="+fnUserID)
                .then(function (response) {
                console.log(response)
                let fnStatsV2 = response
                axios.get("https://fortnite-api.theapinetwork.com/prod09/users/public/br_stats?user_id="+ fnUserID + "&platform=pc")
                    .then(function (response2) {
                    console.log(response + "logged")
                    console.log("logged")
                    let fnStatsV1 = response2
                    totalUsersEver += 1
                    pinnedUsers.push(new User(loadedUsername, fnUserID, fnStatsV2, totalUsersEver, fnStatsV1))
                    pinnedUserNumbers.push(totalUsersEver)
                })
            })
        })
    }
}
fixOrder()
async function fixOrder() {
    console.log(pinnedUsers)
    while (pinnedUsers.length == 0) {
        await sleep(1000)
    }
    if (loadedUsernameList[1] != pinnedUsers[0].username) {
        for (i = pinnedUsers.length-1; i > 0; i--) {
            if (loadedUsernameList[1] == pinnedUsers[i].username) {
                let tempUser = pinnedUsers[i] 
                pinnedUsers.splice(i,1)
                pinnedUsers.unshift(tempUser)

                let tempNum = pinnedUserNumbers[i]
                pinnedUserNumbers.splice(i,1)
                pinnedUserNumbers.unshift(tempNum)
            }
        }
    }
    console.log(pinnedUsers)
    console.log(pinnedUserNumbers)
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Function to Get Stats
function getStats() {
    //Get the username
    if (document.getElementById("fortniteNameInput").value != "") {
        let fnUsername = document.getElementById("fortniteNameInput").value
        console.log(fnUsername)
        axios.get("https://fortnite-user-api.theapinetwork.com/users/id?username="+fnUsername)
            .then(function (response) {
            console.log(response)
            let fnUserID = response.data.data.uid
            axios.get("https://fortnite-api.theapinetwork.com/prod09/users/public/br_stats_v2?user_id="+fnUserID)
                .then(function (response) {
                console.log(response)
                let fnStatsV2 = response
                axios.get("https://fortnite-api.theapinetwork.com/prod09/users/public/br_stats?user_id="+ fnUserID + "&platform=pc")
                    .then(function (response2) {
                    console.log(response2)
                    console.log("logged")
                    let fnStatsV1 = response2
                    if (mode == 1) {
                        totalUsersEver += 1
                        pinnedUsers.push(new User(fnUsername, fnUserID, fnStatsV2, totalUsersEver, fnStatsV1))
                        pinnedUserNumbers.push(totalUsersEver)
                        sortStatsComp()
                    }
                    else {
                        pinnedUsers = []
                        pinnedUserNumbers = []
                        pinnedUsers.push(new User(fnUsername, fnUserID, response, totalUsersEver, fnStatsV1))
                        pinnedUserNumbers.push(totalUsersEver)
                        updateMode(0)
                    }
                    saveData()
                })
            })
        })
    }
}

//Function to sort through stats and add the SVGs when mode is 0 FIX INFINITY VALUES
function sortStats(user) {
    let defaultGamemodes = ""
    tempShare = []
    let entries;
    if (gamingConsole == 'pc') {
        entries = user.fnstats.data.data.stats.keyboardmouse
    }
    else if (gamingConsole == 'console') {
        entries = user.fnstats.data.data.stats.gamepad
    }
    else if (gamingConsole == 'mobile') {
        entries = user.fnstats.data.data.stats.touch
    }
    let entriesStatV1 = user.fnstatsv1.data.stats
    console.log(entries)

    let tableRowColorNum = 0

    document.getElementById("contentOfPage").innerHTML = '<div id="divWithStats"><table id = "ltmTable"><tr><th colspan = "7" id = "tableTitleLTM">LTM - ALLTIME</th></tr><tr id = "tableLabelsLTM"><th>Name</th><td>Wins</td><td>Win %</td><td>K/D</td><td>KPM</td><td>Kills</td></tr></table></div>'
    document.getElementById("contentOfPage").innerHTML = '<p id = "personsTitle">' + user.username + '\'s stats <a href="javascript:updateMode(1)"><img src="IMAGES/CompareIcon.png"/></a><p><div id="consolePickerDiv" ><a href="javascript:changeConsole(1)" class="consolePill" id="pillCON">CONSOLE</a><a href="javascript:changeConsole(0)" class="consolePill" id="pillPC">PC</a><a href="javascript:changeConsole(2)" class="consolePill" id="pillMOB">MOBILE</a></div>' + document.getElementById("contentOfPage").innerHTML
    if (gamingConsole == 'pc') {
        document.getElementById("pillPC").className= "consolePillSelected"
    }
    else if (gamingConsole == 'console') {
        document.getElementById("pillCON").className= "consolePillSelected"
    }
    else {
        document.getElementById("pillMOB").className= "consolePillSelected"
    } 
    for (i = 0; i < entries.length; i++) {
        let gameName = entries[i].id
        let officialGameName = officialNames[databaseNames.indexOf(gameName)]
        let statEntries = entries[i].entries
        for (c = 0; c < statEntries.length; c++) {
            let teamMode = statEntries[c].mode
            if (teamMode != "solo" && teamMode != "duo" && teamMode != "squad") {
                teamMode = ""
            }
            teamMode = teamMode.charAt(0).toUpperCase() + teamMode.slice(1)
            let stats = statEntries[c].stats
            var kills = stats.kills
            var matchesPlayed = stats.matchesplayed
            var wins = stats.placetop1
            var killDeath = Math.round(kills/(matchesPlayed-wins) * 100) / 100
            var killsPerMatch = Math.round(kills/matchesPlayed * 100) / 100
            var winPer = Math.round(wins/matchesPlayed * 100 * 100) / 100
            //Stats v1 for more accuracy
            if (gamingConsole == 'pc') {
                if (gameName == "defaultsolo") {
                    kills = entriesStatV1.kills_solo
                    killDeath = entriesStatV1.kd_solo
                    wins = entriesStatV1.placetop1_solo
                    matchesPlayed = entriesStatV1.matchesplayed_solo
                    winPer = entriesStatV1.winrate_solo
                    killsPerMatch = Math.round(kills/matchesPlayed * 100) / 100
                }
                else if (gameName == "defaultduo") {
                    kills = entriesStatV1.kills_duo
                    killDeath = entriesStatV1.kd_duo
                    wins = entriesStatV1.placetop1_duo
                    matchesPlayed = entriesStatV1.matchesplayed_duo
                    winPer = entriesStatV1.winrate_duo
                    killsPerMatch = Math.round(kills/matchesPlayed * 100) / 100
                }
                else if (gameName == "defaultsquad") {
                    kills = entriesStatV1.kills_squad
                    killDeath = entriesStatV1.kd_squad
                    wins = entriesStatV1.placetop1_squad
                    matchesPlayed = entriesStatV1.matchesplayed_squad
                    winPer = entriesStatV1.winrate_squad
                    killsPerMatch = Math.round(kills/matchesPlayed * 100) / 100
                }
            }

            var topBarColor = "7243C0"
            var topBarColor2 = "7243C0"
            if (gameName == "defaultsolo") {
                topBarColor = "4A90E2"
                topBarColor2 = "366DAD"
            }
            else if (gameName == "defaultduo") {
                topBarColor = "F5A623"
                topBarColor2 = "D48E1A"
            }
            else if (gameName == "defaultsquad") {
                topBarColor = "D3122A"
                topBarColor2 = "A90B1F"
            }
            if (gameName != "defaultsolo" && gameName != "defaultduo" && gameName != "defaultsquad" && gameName != "playgroundv2" && gameName != "playground" && gameName != "creative" && gameName != "music" && gameName != "toss" && gameName != "hard" && gameName != "love" && gameName != "ground" && gameName != "50v50he" && gameName != "toss" && gameName != "showdown" && gameName != "showdownalt" && gameName != "goose" && gameName != "vamp" && gameName != "slide" && gameName != "hover" && gameName != "ashton" && gameName != "fill" && gameName != "wax" && gameName != "slide" && gameName != "green" && gameName != "50v05sau" && gameName != "bison") {
                if (tableRowColorNum == 0) {
                    tableRowColorNum = 1
                    document.getElementById("ltmTable").innerHTML = document.getElementById("ltmTable").innerHTML + '<tr id = "tableContentLTMTR" style = "background: rgba(144,19,254,0.13)"><th>' + officialGameName +' '+ teamMode + '</th><td>' + wins + '</td><td>' + winPer + '</td><td>' + killDeath + '</td><td>' + killsPerMatch + '</td><td>' + kills + '</td><td><a href = "javascript:shareStatCard(' + tempShare.length + ')"><img src="SVG/shareButton.svg" id = "shareButton"/></a></td></tr>'
                }
                else {
                    tableRowColorNum = 0
                    document.getElementById("ltmTable").innerHTML = document.getElementById("ltmTable").innerHTML + '<tr id = "tableContentLTMTR" style = "background: rgba(144,19,254,0.29)"><th>' + officialGameName +' '+ teamMode + '</th><td>' + wins + '</td><td>' + winPer + '</td><td>' + killDeath + '</td><td>' + killsPerMatch + '</td><td>' + kills + '</td><td><a href = "javascript:shareStatCard(' + tempShare.length + ')"><img src="SVG/shareButton.svg" id = "shareButton"/></a></td></tr>'
                }
                if (teamMode.charAt(0) == "S") {
                    teamMode = "(" + teamMode.substring(0,2) + ")"
                }
                else if (teamMode.charAt(0) == "D" ) {
                    teamMode = "(" + teamMode.charAt(0) + ")"
                }
                else {
                    teamMode = ""
                }
                tempShare.push(new shareTemp('<svg width="652px" height="888px" viewBox="0 0 326 444" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>StatGroup</title><desc>Created with Sketch.</desc><defs><rect id="path-1" x="-4.54747351e-13" y="4.54747351e-13" width="304" height="426" rx="8"></rect><filter x="-2.1%" y="-1.3%" width="104.3%" height="103.1%" filterUnits="objectBoundingBox" id="filter-2"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter><path d="M8,0 L296,0 C300.418278,-8.11624501e-16 304,3.581722 304,8 L304,38 L0,38 L0,8 C-5.41083001e-16,3.581722 3.581722,8.11624501e-16 8,0 Z" id="path-3"></path><rect id="path-5" x="0" y="4" width="304" height="426" rx="8"></rect><filter x="-2.1%" y="-1.3%" width="104.3%" height="103.1%" filterUnits="objectBoundingBox" id="filter-6"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter><path d="M8,0 L296,0 C300.418278,-8.11624501e-16 304,3.581722 304,8 L304,38 L0,38 L0,8 C-5.41083001e-16,3.581722 3.581722,8.11624501e-16 8,0 Z" id="path-7"></path><rect id="path-9" x="0" y="0" width="222" height="6" rx="3"></rect></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Default" transform="translate(-153.000000, -1589.000000)"><g id="ShareCardSVG" transform="translate(156.000000, 1591.000000)"><g id="BackCard" transform="translate(160.069799, 218.998782) rotate(-2.000000) translate(-160.069799, -218.998782) translate(8.069799, 5.998782)"><g id="Rectangle"><use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use></g><g id="Path-3" transform="translate(-0.000000, 0.000000)"><mask id="mask-4" fill="white"><use xlink:href="#path-3"></use></mask><use id="Mask" fill="#' + topBarColor + '" xlink:href="#path-3"></use></g></g><g id="StatGroup" transform="translate(8.000000, 2.000000)"><g id="Rectangle"><use fill="black" fill-opacity="1" filter="url(#filter-6)" xlink:href="#path-5"></use><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-5"></use></g><g id="Path-3" transform="translate(0.000000, 4.000000)"><mask id="mask-8" fill="white"><use xlink:href="#path-7"></use></mask><use id="Mask" fill="#' + topBarColor + '" xlink:href="#path-7"></use></g><g id="Other" transform="translate(41.000000, 202.000000)"><rect id="Rectangle" fill="#4A4A4A" x="0" y="0" width="222" height="172" rx="7"></rect><path d="M113,0 L94,98 L113,80 L89.5,171.5 L214.973585,171.973485 C218.839551,171.988074 221.985362,168.865916 221.99995,164.99995 C221.999983,164.991145 222,164.98234 222,164.973535 L222,7 C222,3.13400675 218.865993,-7.10171439e-16 215,0 L113,0 Z" id="Path" fill="#D8D8D8"></path></g><text id="SOLO" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="26" font-weight="normal" letter-spacing="0.2442856" fill="#FFFFFF"><tspan x="10" y="35">' + officialGameName + " " + teamMode + '</tspan></text><text id="k/d" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607142" fill="#FFFFFF"><tspan x="69.9337334" y="250">k/d</tspan></text><text id="Kills" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607142" fill="#FFFFFF"><tspan x="61.3135465" y="342">Kills</tspan></text><text id="KPM" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607142" fill="#FFFFFF"><tspan x="65.7528252" y="296">KPM</tspan></text><text id="0.00" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="250">' + killDeath + '</tspan></text><text id="0.00" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="296">' + killsPerMatch + '</tspan></text><text id="0" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="342">' + kills + '</tspan> </text><text id="WINS-5" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141"><tspan x="111.948766" y="95" fill="#9B9B9B">WINS </tspan><tspan x="178.621477" y="95" fill="#4A4A4A">' + wins + '</tspan></text><text id="WIN%-5%" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141"><tspan x="100.381" y="135" fill="#9B9B9B">WIN% </tspan><tspan x="171.899902" y="135" letter-spacing="0.1674105" fill="#4A4A4A">' + winPer + '</tspan></text><g id="WinPerBar" transform="translate(41.000000, 152.000000)"><mask id="mask-10" fill="white"><use xlink:href="#path-9"></use></mask><use id="Mask" fill="#D0021B" xlink:href="#path-9"></use><rect id="Rectangle" fill="#7ED321" mask="url(#mask-10)" x="0" y="0" width="' + (222*winPer/100) +'" height="6"></rect></g></g></g></g></g></svg>',topBarColor))
            }
            else {
                var svgCardCode = '<div class = "svgCard"><svg viewBox="0 0 312 434" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>StatGroup</title><desc>Created with Sketch.</desc><defs><rect id="path-1" x="0" y="4" width="304" height="426" rx="8"></rect><filter x="-2.1%" y="-1.3%" width="104.3%" height="103.1%" filterUnits="objectBoundingBox" id="filter-2"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter><path d="M8,0 L296,0 C300.418278,-8.11624501e-16 304,3.581722 304,8 L304,38 L0,38 L0,8 C-5.41083001e-16,3.581722 3.581722,8.11624501e-16 8,0 Z" id="path-3"></path><rect id="path-5" x="0" y="0" width="222" height="6" rx="3"></rect></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Default" transform="translate(-160.000000, -682.000000)"><g id="StatGroup" transform="translate(164.000000, 681.000000)"><g id="Rectangle"><use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use></g><g id="Oval" transform="translate(0.000000, 4.000000)"><mask id="mask-4" fill="white"><use xlink:href="#path-3"></use></mask> <use id="Mask" fill="#' + topBarColor + '" xlink:href="#path-3"></use><polygon id="Path-3" fill="#' + topBarColor2 + '" mask="url(#mask-4)" points="168.5 0 192.079152 38 304 38 304 0"></polygon></g><g id="Other" transform="translate(41.000000, 0.000000)"><rect id="Rectangle" fill="#4A4A4A" x="0" y="202" width="222" height="172" rx="7"></rect><path d="M113,202 L94,300 L113,282 L89.5,373.5 L214.973585,373.973485 C218.839551,373.988074 221.985362,370.865916 221.99995,366.99995 C221.999983,366.991145 222,366.98234 222,366.973535 L222,209 C222,205.134007 218.865993,202 215,202 L113,202 Z" id="Path" fill="#D8D8D8"></path></g><text id="440-matches" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="16" font-weight="normal" letter-spacing="0.1028572" fill="#FFFFFF"><tspan x="192.242879" y="28">' + matchesPlayed + ' matches</tspan></text><text id="SOLO" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="38" font-weight="normal" letter-spacing="0.2442856" fill="#FFFFFF"><tspan x="10" y="35">' + officialGameName + teamMode + '</tspan></text><text id="k/d" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607142" fill="#FFFFFF"><tspan x="69.9337334" y="250">k/d</tspan></text><text id="Kills" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607142" fill="#FFFFFF"><tspan x="61.3135465" y="342">Kills</tspan></text><text id="KPM" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607142" fill="#FFFFFF"><tspan x="65.7528252" y="296">KPM</tspan></text><text id="0.00" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="250">' + killDeath + '</tspan></text><text id="0.00" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="296">' + killsPerMatch + '</tspan></text><text id="0" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="342">' + kills + '</tspan> </text><text id="WINS-5" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141"><tspan x="111.948766" y="95" fill="#9B9B9B">WINS </tspan><tspan x="178.621477" y="95" fill="#4A4A4A">' + wins + '</tspan></text><text id="WIN%-5%" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141"><tspan x="100.381" y="135" fill="#9B9B9B">WIN% </tspan><tspan x="171.899902" y="135" letter-spacing="0.1674105" fill="#4A4A4A">' + winPer + '</tspan></text><g id="WinPerBar" transform="translate(41.000000, 152.000000)"><mask id="mask-6" fill="white"><use xlink:href="#path-5"></use></mask><use id="Mask" fill="#D0021B" xlink:href="#path-5"></use><rect id="Rectangle" fill="#7ED321" mask="url(#mask-6)" x="0" y="0" width="' + (222*winPer/100) +'" height="6"></rect></g><a href="javascript:shareStatCard(' + tempShare.length + ')"><g id="ShareButton" transform="translate(109.000000, 388.000000)"><rect id="Rectangle" fill="#' + topBarColor + '" x="0" y="2" width="94" height="25" rx="12.5"></rect><text id="SHARE" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="26" font-weight="normal" letter-spacing="0.167142838" fill="#FFFFFF"><tspan x="9.30235775" y="23">SHARE</tspan></text></g></a></g></g></g></svg></div>'
                if (gameName == "defaultduo" || gameName == "defaultsquad") {
                    defaultGamemodes = defaultGamemodes + svgCardCode
                    tempShare.push(new shareTemp('<svg viewBox="0 0 326 444" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>StatGroup</title><desc>Created with Sketch.</desc><defs><rect id="path-1" x="-4.54747351e-13" y="4.54747351e-13" width="304" height="426" rx="8"></rect><filter x="-2.1%" y="-1.3%" width="104.3%" height="103.1%" filterUnits="objectBoundingBox" id="filter-2"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter><path d="M8,0 L296,0 C300.418278,-8.11624501e-16 304,3.581722 304,8 L304,38 L0,38 L0,8 C-5.41083001e-16,3.581722 3.581722,8.11624501e-16 8,0 Z" id="path-3"></path><rect id="path-5" x="0" y="4" width="304" height="426" rx="8"></rect><filter x="-2.1%" y="-1.3%" width="104.3%" height="103.1%" filterUnits="objectBoundingBox" id="filter-6"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter><path d="M8,0 L296,0 C300.418278,-8.11624501e-16 304,3.581722 304,8 L304,38 L0,38 L0,8 C-5.41083001e-16,3.581722 3.581722,8.11624501e-16 8,0 Z" id="path-7"></path><rect id="path-9" x="0" y="0" width="222" height="6" rx="3"></rect></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Default" transform="translate(-153.000000, -1589.000000)"><g id="ShareCardSVG" transform="translate(156.000000, 1591.000000)"><g id="BackCard" transform="translate(160.069799, 218.998782) rotate(-2.000000) translate(-160.069799, -218.998782) translate(8.069799, 5.998782)"><g id="Rectangle"><use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use></g><g id="Path-3" transform="translate(-0.000000, 0.000000)"><mask id="mask-4" fill="white"><use xlink:href="#path-3"></use></mask><use id="Mask" fill="#' + topBarColor + '" xlink:href="#path-3"></use><polygon fill="#' + topBarColor2 + '" mask="url(#mask-4)" points="169 0 192.579152 38 304.5 38 304.5 0"></polygon></g></g><g id="StatGroup" transform="translate(8.000000, 2.000000)"><g id="Rectangle"><use fill="black" fill-opacity="1" filter="url(#filter-6)" xlink:href="#path-5"></use><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-5"></use></g><g id="Path-3" transform="translate(0.000000, 4.000000)"><mask id="mask-8" fill="white"><use xlink:href="#path-7"></use></mask><use id="Mask" fill="#' + topBarColor + '" xlink:href="#path-7"></use><polygon fill="#' + topBarColor2 + '" mask="url(#mask-8)" points="169 0 192.579152 38 304.5 38 304.5 0"></polygon></g><g id="Other" transform="translate(41.000000, 202.000000)"><rect id="Rectangle" fill="#4A4A4A" x="0" y="0" width="222" height="172" rx="7"></rect><path d="M113,0 L94,98 L113,80 L89.5,171.5 L214.973585,171.973485 C218.839551,171.988074 221.985362,168.865916 221.99995,164.99995 C221.999983,164.991145 222,164.98234 222,164.973535 L222,7 C222,3.13400675 218.865993,-7.10171439e-16 215,0 L113,0 Z" id="Path" fill="#D8D8D8"></path></g><text id="440-matches" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="16" font-weight="normal" letter-spacing="0.1028572" fill="#FFFFFF"><tspan x="192.242879" y="28">' + matchesPlayed + ' matches</tspan></text><text id="SOLO" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="38" font-weight="normal" letter-spacing="0.2442856" fill="#FFFFFF"><tspan x="10" y="35">' + officialGameName + teamMode + '</tspan></text><text id="k/d" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607142" fill="#FFFFFF"><tspan x="69.9337334" y="250">k/d</tspan></text><text id="Kills" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607142" fill="#FFFFFF"><tspan x="61.3135465" y="342">Kills</tspan></text><text id="KPM" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607142" fill="#FFFFFF"><tspan x="65.7528252" y="296">KPM</tspan></text><text id="0.00" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="250">' + killDeath + '</tspan></text><text id="0.00" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="296">' + killsPerMatch + '</tspan></text><text id="0" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="342">' + kills + '</tspan> </text><text id="WINS-5" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141"><tspan x="111.948766" y="95" fill="#9B9B9B">WINS </tspan><tspan x="178.621477" y="95" fill="#4A4A4A">' + wins + '</tspan></text><text id="WIN%-5%" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141"><tspan x="100.381" y="135" fill="#9B9B9B">WIN% </tspan><tspan x="171.899902" y="135" letter-spacing="0.1674105" fill="#4A4A4A">' + winPer + '</tspan></text><g id="WinPerBar" transform="translate(41.000000, 152.000000)"><mask id="mask-10" fill="white"><use xlink:href="#path-9"></use></mask><use id="Mask" fill="#D0021B" xlink:href="#path-9"></use><rect id="Rectangle" fill="#7ED321" mask="url(#mask-10)" x="0" y="0" width="' + (222*winPer/100) +'" height="6"></rect></g></g></g></g></g></svg>',topBarColor))
                }
                else if (gameName == "defaultsolo") {
                    defaultGamemodes = svgCardCode + defaultGamemodes
                    tempShare.push(new shareTemp('<svg viewBox="0 0 326 444" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>StatGroup</title><desc>Created with Sketch.</desc><defs><rect id="path-1" x="-4.54747351e-13" y="4.54747351e-13" width="304" height="426" rx="8"></rect><filter x="-2.1%" y="-1.3%" width="104.3%" height="103.1%" filterUnits="objectBoundingBox" id="filter-2"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter><path d="M8,0 L296,0 C300.418278,-8.11624501e-16 304,3.581722 304,8 L304,38 L0,38 L0,8 C-5.41083001e-16,3.581722 3.581722,8.11624501e-16 8,0 Z" id="path-3"></path><rect id="path-5" x="0" y="4" width="304" height="426" rx="8"></rect><filter x="-2.1%" y="-1.3%" width="104.3%" height="103.1%" filterUnits="objectBoundingBox" id="filter-6"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter><path d="M8,0 L296,0 C300.418278,-8.11624501e-16 304,3.581722 304,8 L304,38 L0,38 L0,8 C-5.41083001e-16,3.581722 3.581722,8.11624501e-16 8,0 Z" id="path-7"></path><rect id="path-9" x="0" y="0" width="222" height="6" rx="3"></rect></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Default" transform="translate(-153.000000, -1589.000000)"><g id="ShareCardSVG" transform="translate(156.000000, 1591.000000)"><g id="BackCard" transform="translate(160.069799, 218.998782) rotate(-2.000000) translate(-160.069799, -218.998782) translate(8.069799, 5.998782)"><g id="Rectangle"><use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use></g><g id="Path-3" transform="translate(-0.000000, 0.000000)"><mask id="mask-4" fill="white"><use xlink:href="#path-3"></use></mask><use id="Mask" fill="#' + topBarColor + '" xlink:href="#path-3"></use><polygon fill="#' + topBarColor2 + '" mask="url(#mask-4)" points="169 0 192.579152 38 304.5 38 304.5 0"></polygon></g></g><g id="StatGroup" transform="translate(8.000000, 2.000000)"><g id="Rectangle"><use fill="black" fill-opacity="1" filter="url(#filter-6)" xlink:href="#path-5"></use><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-5"></use></g><g id="Path-3" transform="translate(0.000000, 4.000000)"><mask id="mask-8" fill="white"><use xlink:href="#path-7"></use></mask><use id="Mask" fill="#' + topBarColor + '" xlink:href="#path-7"></use><polygon fill="#' + topBarColor2 + '" mask="url(#mask-8)" points="169 0 192.579152 38 304.5 38 304.5 0"></polygon></g><g id="Other" transform="translate(41.000000, 202.000000)"><rect id="Rectangle" fill="#4A4A4A" x="0" y="0" width="222" height="172" rx="7"></rect><path d="M113,0 L94,98 L113,80 L89.5,171.5 L214.973585,171.973485 C218.839551,171.988074 221.985362,168.865916 221.99995,164.99995 C221.999983,164.991145 222,164.98234 222,164.973535 L222,7 C222,3.13400675 218.865993,-7.10171439e-16 215,0 L113,0 Z" id="Path" fill="#D8D8D8"></path></g><text id="440-matches" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="16" font-weight="normal" letter-spacing="0.1028572" fill="#FFFFFF"><tspan x="192.242879" y="28">' + matchesPlayed + ' matches</tspan></text><text id="SOLO" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="38" font-weight="normal" letter-spacing="0.2442856" fill="#FFFFFF"><tspan x="10" y="35">' + officialGameName + teamMode + '</tspan></text><text id="k/d" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607142" fill="#FFFFFF"><tspan x="69.9337334" y="250">k/d</tspan></text><text id="Kills" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607142" fill="#FFFFFF"><tspan x="61.3135465" y="342">Kills</tspan></text><text id="KPM" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607142" fill="#FFFFFF"><tspan x="65.7528252" y="296">KPM</tspan></text><text id="0.00" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="250">' + killDeath + '</tspan></text><text id="0.00" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="296">' + killsPerMatch + '</tspan></text><text id="0" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="342">' + kills + '</tspan> </text><text id="WINS-5" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141"><tspan x="111.948766" y="95" fill="#9B9B9B">WINS </tspan><tspan x="178.621477" y="95" fill="#4A4A4A">' + wins + '</tspan></text><text id="WIN%-5%" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141"><tspan x="100.381" y="135" fill="#9B9B9B">WIN% </tspan><tspan x="171.899902" y="135" letter-spacing="0.1674105" fill="#4A4A4A">' + winPer + '</tspan></text><g id="WinPerBar" transform="translate(41.000000, 152.000000)"><mask id="mask-10" fill="white"><use xlink:href="#path-9"></use></mask><use id="Mask" fill="#D0021B" xlink:href="#path-9"></use><rect id="Rectangle" fill="#7ED321" mask="url(#mask-10)" x="0" y="0" width="' + (222*winPer/100) +'" height="6"></rect></g></g></g></g></g></svg>',topBarColor))
                }
            }
        }
    }
    document.getElementById("divWithStats").innerHTML = defaultGamemodes + document.getElementById("divWithStats").innerHTML
    document.getElementById("personsTitle").style.marginBottom = "-30px";
} 

//Function to sort through stats and add SVGs when mode is 1 FIX INFINITY VALUES
function sortStatsComp() {
    //ChartTest
    var names = []
    var kd = []

    document.getElementById("contentOfPage").innerHTML = '<div id="divWithStats"></div>'
    document.getElementById("contentOfPage").innerHTML = '<p id = "personsTitle">Comparing Stats <a href="javascript:updateMode(0)"><img src="IMAGES/StopCompareIcon.png"/></a><p><table id="gamemodeSelector"><tr><td id = "leftEdge"><a onclick="changeGamemode(\'solo\')" id = "gameModeSelectorSolo">SOLO</a></td><td><a onclick="changeGamemode(\'duo\')" id = "gameModeSelectorDuo">DUO</a></td><td id = "rightEdge"><a onclick="changeGamemode(\'squad\')" id = "gameModeSelectorSquad">SQUAD</a></td></tr></table>' + document.getElementById("contentOfPage").innerHTML //<td id = "rightEdge"><a onclick="changeGamemode(\'ltm\')" id = "gameModeSelectorLTM">LTM</a></td>
    for (u = 0; u < pinnedUsers.length; u++) {
        let user = pinnedUsers[u]

        //ChartTest
        names.push(pinnedUsers[u].username)

        let entries = user.fnstats.data.data.stats.keyboardmouse
        console.log(entries)
        for (i = 0; i < entries.length; i++) {
            let gameName = entries[i].id
            let officialGameName = officialNames[databaseNames.indexOf(gameName)]
            let statEntries = entries[i].entries
            if (gameName == currentGamemode) {
                for (c = 0; c < statEntries.length; c++) {
                    let teamMode = statEntries[c].mode
                    if (teamMode != "solo" && teamMode != "duo" && teamMode != "squad" && teamMode != "trios") {
                        teamMode = ""
                    }
                    let stats = statEntries[c].stats
                    let kills = stats.kills
                    let matchesPlayed = stats.matchesplayed
                    let wins = stats.placetop1
                    let killDeath = Math.round(kills/(matchesPlayed-wins) * 100) / 100
                    let killsPerMatch = Math.round(kills/matchesPlayed * 100) / 100
                    let winPer = Math.round(wins/matchesPlayed * 100 * 100) / 100

                    //ChartTest
                    kd.push(killDeath)

                    let topBarColor = "7243C0"
                    if (gameName == "defaultsolo") {
                        topBarColor = "4A90E2"
                    }
                    else if (gameName == "defaultduo") {
                        topBarColor = "F5A623"
                    }
                    else if (gameName == "defaultsquad") {
                        topBarColor = "D3122A"
                    }
                    document.getElementById("divWithStats").innerHTML = document.getElementById("divWithStats").innerHTML + '<div class = "svgCard" id = "' + user.number + '"><svg viewBox="0 0 312 434" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: Sketch 53.2 (72643) - https://sketchapp.com --><title>StatGroup</title><defs><rect id="path-1" x="0" y="4" width="304" height="426" rx="8"></rect><filter x="-2.1%" y="-1.3%" width="104.3%" height="103.1%" filterUnits="objectBoundingBox" id="filter-2"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur> <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter><rect id="path-3" x="0" y="0" width="222" height="6" rx="3"></rect></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Default" transform="translate(-160.000000, -682.000000)"><g id="StatGroup" transform="translate(164.000000, 681.000000)"><g id="Rectangle"><use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use></g><path d="M8,4 L296,4 C300.418278,4 304,7.581722 304,12 L304,42 L0,42 L0,12 C-5.41083001e-16,7.581722 3.581722,4 8,4 Z" id="Rectangle" fill="#' + topBarColor + '"></path><g id="Other" transform="translate(41.000000, 202.000000)"><rect id="Rectangle" fill="#4A4A4A" x="0" y="0" width="222" height="172" rx="7"></rect><path d="M113,0 L94,98 L113,80 L89.5,171.5 L214.973585,171.973485 C218.839551,171.988074 221.985362,168.865916 221.99995,164.99995 C221.999983,164.991145 222,164.98234 222,164.973535 L222,7 C222,3.13400675 218.865993,-7.10171439e-16 215,0 L113,0 Z" id="Path" fill="#D8D8D8"></path></g><text id="nameOfMode" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="24" font-weight="normal" letter-spacing="0.244285613" fill="#FFFFFF"><tspan x="9" y="32">' + user.username + '</tspan></text><text id="k/d" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.160714194" fill="#FFFFFF"><tspan x="69.9337334" y="250">k/d</tspan></text><text id="Kills" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.160714194" fill="#FFFFFF"><tspan x="61.3135465" y="342">Kills</tspan></text><text id="KPM" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.160714194" fill="#FFFFFF"><tspan x="65.7528252" y="296">KPM</tspan></text><text id="0.00" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="250" id="killDeathRatio">' + killDeath + '</tspan></text><text id="0.00" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="296" id="killPerMatch">' + killsPerMatch + '</tspan></text><text id="0" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141" fill="#4A4A4A"><tspan x="180.988386" y="342" id="numOfKills">' + kills + '</tspan></text><text id="WINS-5" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.1607141"><tspan x="111.948766" y="95" fill="#9B9B9B">WINS </tspan><tspan x="178.621477" y="95" fill="#4A4A4A" id="numOfWins">' + wins + '</tspan></text><text id="WIN%-5%" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="25" font-weight="normal" letter-spacing="0.160714105"><tspan x="100.381" y="135" fill="#9B9B9B">WIN% </tspan><tspan x="171.899902" y="135" letter-spacing="0.167410523" fill="#4A4A4A" id="winPer">' + winPer + '%</tspan></text><g id="WinPerBar" transform="translate(41.000000, 152.000000)"><mask id="mask-4" fill="white"><use xlink:href="#path-3"></use></mask><use id="Mask" fill="#D0021B" xlink:href="#path-3"></use><rect id="Rectangle" fill="#7ED321" mask="url(#mask-4)" x="0" y="0" width="' + (222*winPer/100) +'" height="6"></rect></g><a href ="javascript:close(' + user.number + ')"><g id="CloseButton" transform="translate(267.000000, 3.000000)" fill="#FFFFFF"><rect id="Rectangle" transform="translate(17.000000, 17.000000) rotate(45.000000) translate(-17.000000, -17.000000) " x="-2" y="13" width="38" height="8" rx="4"></rect><rect id="Rectangle" transform="translate(17.000000, 17.000000) scale(-1, 1) rotate(45.000000) translate(-17.000000, -17.000000) " x="-2" y="13" width="38" height="8" rx="4"></rect></g></a></g></g></g></svg> </div>'
                }
            }
        }
    }

    //ChartTest
    document.getElementById("divWithStats").innerHTML = document.getElementById("divWithStats").innerHTML + '<div><canvas id="myChart"></canvas></div>'
    var ctx = document.getElementById('myChart').getContext('2d');
    ctx.canvas.parentNode.style.height = '500px';
    ctx.canvas.parentNode.style.width = '500px';
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Kill/Death Ratio',
                data: kd,
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ]
            }]
        },
        options: {
            title: {
                display: true,
                text: 'K/D'
            },
            legend: {
                display: false,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            }
        }
    });

} //Add cool graphs

//Change Console
function changeConsole(conNum) {
    if (conNum == 0) {
        gamingConsole = 'pc'
    }
    else if (conNum == 1) {
        gamingConsole = 'console'
    }
    else {
        gamingConsole = 'mobile'
    } 
    sortStats(pinnedUsers[0])
}

//Removes users
function close(idNumber) { 
    document.getElementById(idNumber).parentNode.removeChild(document.getElementById(idNumber))
    console.log(pinnedUsers)
    console.log(pinnedUserNumbers)

    console.log(pinnedUserNumbers.indexOf(idNumber))
    console.log(idNumber)
    pinnedUsers.splice(pinnedUserNumbers.indexOf(idNumber),1)
    pinnedUserNumbers.splice(pinnedUserNumbers.indexOf(idNumber),1)

    console.log(pinnedUsers)
    console.log(pinnedUserNumbers)
    saveData()
}

//Changes gamemode for comparing NEEDS LTM ADAPTING
function changeGamemode(gamemode) {
    if (gamemode != "LTM") {
        currentGamemode = "default" + gamemode
    }
    sortStatsComp()
}

//Function that changes mode
function updateMode(modePick) {
    mode = modePick
    document.getElementById("statsLabel").style.borderBottom = "0px solid";
    document.getElementById("newsLabel").style.borderBottom = "0px solid";
    if (mode == 0 || mode == 1) {
        document.getElementById("statsLabel").style.borderBottom = "5px solid";
        document.getElementById("statsLabel").style.borderBottomColor = "#F8E71C";
        if (pinnedUserNumbers.length == 0) {
            document.getElementById("contentOfPage").innerHTML = '<p id = "personsTitle">No username entered...<p>'
        }
        else {
            if (mode == 1) {
                sortStatsComp();
            }
            if (mode == 0) {
                sortStats(pinnedUsers[0])
            }
        }
    }
    else if (mode == 3) {
        document.getElementById("newsLabel").style.borderBottom = "5px solid";
        document.getElementById("newsLabel").style.borderBottomColor = "#F8E71C";
        getNews();
    }
}

//Save data to local storage
function saveData() {
    var dataToBeSaved = ""
    for (i = 0; i < pinnedUsers.length; i++) {
        dataToBeSaved = dataToBeSaved + "|[]{}|?" + pinnedUsers[i].username
    }
    dataToBeSaved = dataToBeSaved + "|[]{}|?"
    localStorage.setItem("savedUsernames", dataToBeSaved)
}

//Puts the news and Twitter feed
function getNews() {
    //Get Ingame News
    document.getElementById("contentOfPage").innerHTML = '<div id = "divWithStats"><div><p id="newsHeader">INGAME NEWS</p><table id = "newsTable"></table></div><div id = "divWithTweetsAndShop" ><div id = "divWithTweets"></div><div id = "itemShop"><p id="itemShopHeader">ITEM SHOP</p></div></div></div>'
    /*var reqURL = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://www.youtube.com/feeds/videos.xml?channel_id=");
    var iframe = document.getElementById("latestYoutubeVid")
    $.getJSON( reqURL + iframe.getAttribute('cid'),
              function(data) {
        var videoNumber = (iframe.getAttribute('vnum')?Number(iframe.getAttribute('vnum')):0);
        console.log(videoNumber);
        var link = data.items[videoNumber].link;
        id = link.substr(link.indexOf("=") + 1);  
        iframe.setAttribute("src","https://youtube.com/embed/"+id + "?controls=0&autoplay=1");
    });*/
    //Get News
    if (currentNews.length == 0) {
        axios.get("https://fortnite-api.theapinetwork.com/br_motd/get")
            .then(function (response) {
            console.log(response)
            let news = response.data.data
            for (i = 0; i < 10; i++) {
                let newsTitle = news[i].title
                let newsImage = news[i].image
                let newsPreview = news[i].body
                currentNews.push(new News(newsImage, newsTitle, newsPreview))
                document.getElementById("newsTable").innerHTML = document.getElementById("newsTable").innerHTML + '<tr><td><img src="' + newsImage + '" id="newsTableIMG"/></td><td><p id="newsTitle">' + newsTitle + '</p><p id="newsPreview">' + newsPreview + '</p><a href="javascript:shareStatCard(-2,'+numberOfNews+')"><img src="SVG/shareButton.svg" id = "shareButton"/></a></td></tr>' 
                numberOfNews++
            }
        })
    }
    else {
        numberOfNews = 0
        for (i = 0; i < currentNews.length; i++) {
            document.getElementById("newsTable").innerHTML = document.getElementById("newsTable").innerHTML + '<tr><td><img src="' + currentNews[i].image + '" id="newsTableIMG"/></td><td><p id="newsTitle">' + currentNews[i].title + '</p><p id="newsPreview">' + currentNews[i].details + '</p><a href="javascript:shareStatCard(-2,'+numberOfNews+')"><img src="SVG/shareButton.svg" id = "shareButton"/></a></td></tr>' 
            numberOfNews++
        }
    }
    //Get Item Shop
    if (currentShop.length == 0) {
        axios.get("https://fortnite-api.theapinetwork.com/store/get")
            .then(function (response) {
            console.log(response)
            let items = response.data.data
            console.log(items)
            for (i = 0; i < items.length; i++) {
                let image = items[i].item.images.background
                let price = items[i].store.cost
                currentShop.push(new shopItem(image, price))
                document.getElementById("itemShop").innerHTML = document.getElementById("itemShop").innerHTML + '<div class="itemShopItemDiv"><img id="itemImage" src="' + image + '" /><p id = "itemPrice"><img src="IMAGES/vbuck.png" height="20px" />' + price + '</div>'
            }
        })
    }
    else {
        for (i = 0; i <currentShop.length; i++) {
            document.getElementById("itemShop").innerHTML = document.getElementById("itemShop").innerHTML + '<div class="itemShopItemDiv"><img id="itemImage" src="' + currentShop[i].image + '" /><p id = "itemPrice"><img src="IMAGES/vbuck.png" height="20px" />' + currentShop[i].cost + '</div>'
        }
    }
    //Get Twitter feed
    twttr.widgets.createTimeline(
        {
            sourceType: "profile",
            screenName: "FortniteGame"
        },
        document.getElementById("divWithTweets"),
        {
            height: '1000',
        }
    );
} //Change number of news and sort them

//Creates the share box and allows customizing
function shareStatCard(shareTempNum, newsnumber) {
    if (shareTempNum == -1) {
        shareStyle=1
        shareTempNum = 0
    }
    else if (shareTempNum == -2) {
        shareStyle=2
        shareTempNum = 0
        chosenNews = newsnumber
        console.log(chosenNews)
        console.log(currentNews[chosenNews])
    }
    else {
        shareStyle = 0
    }
    try {
        document.getElementById("shareEditDiv").parentElement.removeChild(document.getElementById("shareEditDiv"))
    }
    catch(err) {
        console.log(err)
    }
    document.getElementById("divWithStats").innerHTML = document.getElementById("divWithStats").innerHTML + '<div id = "shareEditDiv" ></div>'
    document.getElementById("shareEditDiv").scrollIntoView({behavior: "smooth", block: "center", inline: "center"})

    document.getElementById("shareEditDiv").innerHTML = document.getElementById("shareEditDiv").innerHTML + '<div id = "imagePreview"><img id = "shareActualImage" src=""/></div><div id = "editShareDiv"><p id = "customizeTitle">CUSTOMIZE</p><p class = "customizeSubTitles" id="customizeSubTitlesStyle" >STYLE</p><table class = "customizeTable" id="customizeTableStyle"><tr><td><a href="javascript:changeShareStyle(0)">CARD</a></td><td><a href="javascript:changeShareStyle(1)">MESSAGES</a></td></tr></table></div>'

    if (shareStyle == 0) {
        lastCardNum = shareTempNum
        document.getElementById("shareActualImage").src = 'data:image/svg+xml;base64,' + base64EncodeUnicode(tempShare[shareTempNum].tempCode)
    }
    else if (shareStyle == 1) {
        document.getElementById("editShareDiv").innerHTML = document.getElementById("editShareDiv").innerHTML + '<p class = "customizeSubTitles" >IMAGE</p><table class = "customizeTable" id="imageShareTable"></table><p class = "customizeSubTitles" >TEXT</p><table class = "customizeTable"><tr><td><div id = "customizeShareFormDIV"><form action="javascript:changeMSGShareLook()" id = "customizeShareForm"><input type="text" name="topline" placeholder="Top Line..." id="customizeShareFormINT" class = "customizeShareFormIN"><br></form></div></td><td><div id = "customizeShareFormDIV"><form action="javascript:changeMSGShareLook()" id = "customizeShareForm"><input type="text" name="bottomline" placeholder="Bottom Line..." id="customizeShareFormINB" class = "customizeShareFormIN"><br></form></div></td><td><a href="javascript:randomShareText()"><svg id = "randomTextShareBTN" viewBox="0 0 165 43" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: Sketch 53.2 (72643) - https://sketchapp.com --> <title>CopyToClipboardBTN</title><desc>Created with Sketch.</desc><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Default" transform="translate(-806.000000, -1938.000000)"><g id="CopyToClipboardBTN" transform="translate(806.000000, 1938.000000)"><rect id="backgroundOfGenerate" fill="#' + tempShare[shareTempNum].color + '" x="0" y="0" width="145" height="43" rx="21.5"></rect><text id="generate" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="22" font-weight="normal" letter-spacing="0.1414285" fill="#FFFFFF"><tspan x="28.0548915" y="28">RANDOM</tspan></text></g></g></g></svg></a></td></tr></table>'
        document.getElementById("editShareDiv").innerHTML = document.getElementById("editShareDiv").innerHTML + '<p class = "customizeSubTitles" >Color</p><table class = "customizeTable" ><tr id = "colorPickerTableTR"></tr></table>'
        changeMSGShareLook(msgColors.indexOf(tempShare[shareTempNum].color))
    }
    else if (shareStyle == 2) {
        document.getElementById("editShareDiv").innerHTML = document.getElementById("editShareDiv").innerHTML + '<p class = "customizeSubTitles" >TYPE</p><table class = "customizeTable" ><tr><td><a href="javascript:changeNewsStyle(0)">Horizontal</a></td></tr></table>'
        document.getElementById("customizeTableStyle").parentNode.removeChild(document.getElementById("customizeTableStyle")) 
        document.getElementById("customizeSubTitlesStyle").parentNode.removeChild(document.getElementById("customizeSubTitlesStyle"))
        changeNewsStyle(0)
    }
    var tempColor = ""
    try {
        tempColor = tempShare[shareTempNum].color
    }
    catch (err) {
        console.log("error")
        tempColor = msgColors[1]
    }
    document.getElementById("editShareDiv").innerHTML = document.getElementById("editShareDiv").innerHTML + '<a href="javascript:makeImage()"><svg id = "copyToClipboardBTN" viewBox="0 0 165 43" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: Sketch 53.2 (72643) - https://sketchapp.com --> <title>CopyToClipboardBTN</title><desc>Created with Sketch.</desc><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Default" transform="translate(-806.000000, -1938.000000)"><g id="CopyToClipboardBTN" transform="translate(806.000000, 1938.000000)"><rect id="backgroundOfGenerate" fill="#' + tempColor + '" x="0" y="0" width="165" height="43" rx="21.5"></rect><text id="generate" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="22" font-weight="normal" letter-spacing="0.1414285" fill="#FFFFFF"><tspan x="30.0548915" y="28">generate</tspan></text></g></g></g></svg></a>'
}

//Changes the look of the news share
function changeNewsStyle(num) {
    document.getElementById("shareActualImage").src = "data:image/svg+xml;base64," + base64EncodeUnicode('<svg  viewBox="0 0 557 379" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><desc>Created with Sketch.</desc><defs><rect id="path-1" x="0" y="0" width="541" height="363" rx="14"></rect><filter x="-2.4%" y="-3.0%" width="104.8%" height="107.2%" filterUnits="objectBoundingBox" id="filter-3"><feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="4" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="brainstorming" transform="translate(-132.000000, -5813.000000)"><g id="card1v" transform="translate(140.000000, 5819.000000)"><g id="Rectangle"><mask id="mask-2" fill="white"><use xlink:href="#path-1"></use></mask><g id="Mask"><use fill="black" fill-opacity="1" filter="url(#filter-3)" xlink:href="#path-1"></use><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use></g><image id="image" mask="url(#mask-2)" x="0" y="0" width="541" height="270.31" xlink:href="'+imageToBase64(chosenNews+numOfImgHeads+1)+'"></image></g><text id="Patchnotes-v1.1" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="35" font-weight="normal" letter-spacing="-0.2552083" fill="#4A4A4A"><tspan x="270.5" y="330" text-anchor="middle">'+currentNews[chosenNews].title+'</tspan></text></g></g></g></svg>')
}

//Generates random text for the share msg
function randomShareText() {
    let phrases = []
    phrases.push(new phrase("You're a","TTV"))
    phrases.push(new phrase("Better Luck","Next Time"))
    phrases.push(new phrase("Get Good","BOT"))
    phrases.push(new phrase("We Hit","Those!!!"))
    phrases.push(new phrase("Stream","Sniper!!!"))
    phrases.push(new phrase("You Have","Ligma"))
    phrases.push(new phrase("HACKKKKS",""))
    phrases.push(new phrase("This Game","SUCKS"))
    phrases.push(new phrase("GET","NOSCOPED!!!"))
    phrases.push(new phrase("Stop","Sweating"))
    phrases.push(new phrase("Stop","W Keying"))
    phrases.push(new phrase("You're a","Tryhard"))
    phrases.push(new phrase("Good","Shit"))
    phrases.push(new phrase("Get","Rekt"))
    phrases.push(new phrase("Take The Fat","L"))
    phrases.push(new phrase("He's","Hacking"))
    phrases.push(new phrase("Freaking","LAG!!!"))
    phrases.push(new phrase("Clip That!","Clip That!!"))
    phrases.push(new phrase("Headshot","For 17 WTF"))
    phrases.push(new phrase("Fix The","Game Epic"))
    phrases.push(new phrase("1v1 Me","BOT"))
    phrases.push(new phrase("You're a","BOT"))
    phrases.push(new phrase("I Had No","Shotgun"))
    phrases.push(new phrase("Your Binds","Suck"))
    phrases.push(new phrase("My BLOOM","Sucks"))
    phrases.push(new phrase("Freaking","RNG"))
    phrases.push(new phrase("400 Ping!?!","W T F"))
    phrases.push(new phrase("0 Ping","Warrior"))
    phrases.push(new phrase("I'm a","GOD"))
    phrases.push(new phrase("WDYM","Brother"))
    phrases.push(new phrase("WTF Is","This Game"))
    phrases.push(new phrase("They're","Sweats"))
    let randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]
    document.getElementById("customizeShareFormINT").value = randomPhrase.topPhrase
    document.getElementById("customizeShareFormINB").value = randomPhrase.bottomPhrase
    changeMSGShareLook(1)
}

//Picks a random color for the share msg
function randomShareColor() {
    changeMSGShareLook(Math.floor(Math.random() * msgColors.length))
}

//Changes the imgNumber and reloads the share
function changeImgShare(num) {
    if (imgShareNum==0 && num < 0) {

    }
    else if (imgShareNum==numOfImgHeads-1 && num > 0) {

    }
    else {
        imgShareNum += num
    }
    changeMSGShareLook(-1)
}

//Changes the look of the share MSG
function changeMSGShareLook(sender) {
    let color = "4A90E2"
    if (sender > -1) {
        color = msgColors[sender]
    }
    document.getElementById("shareActualImage").src = "data:image/svg+xml;base64," + base64EncodeUnicode('<svg id = "shareActualImage" viewBox="0 0 709 276" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: Sketch 53.2 (72643) - https://sketchapp.com --><title>TTV</title><desc>Created with Sketch.</desc><defs><circle id="path-1" cx="138" cy="138" r="138"></circle><filter x="-0.7%" y="-0.7%" width="101.4%" height="101.4%" filterUnits="objectBoundingBox" id="filter-3"><feGaussianBlur stdDeviation="1.5" in="SourceAlpha" result="shadowBlurInner1"></feGaussianBlur><feOffset dx="0" dy="1" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset><feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowInnerInner1"></feColorMatrix></filter></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Desktop-HD" transform="translate(-123.000000, -2196.000000)"><g id="TTV" transform="translate(123.000000, 2196.000000)"><g id="Group-2"><mask id="mask-2" fill="white"><use xlink:href="#path-1"></use></mask><g id="Mask"><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use><use fill="black" fill-opacity="1" filter="url(#filter-3)" xlink:href="#path-1"></use></g><image id="Bitmap" mask="url(#mask-2)" x="3" y="2" width="276" height="276" xlink:href="'+imageToBase64(imgShareNum)+'"></image></g><path d="M306,138 L338,112 L338,33.319508 C338,28.90123 341.581722,25.319508 346,25.319508 L698.299941,25.319508 C702.718219,25.319508 706.299941,28.90123 706.299941,33.319508 L706.299941,157.922604 C706.299941,162.340882 702.718219,165.922604 698.299941,165.922604 L346,165.922604 C341.581722,165.922604 338,162.340882 338,157.922604 L338,138 L306,138 Z" id="Path-5" stroke="#' + color + '" stroke-width="4"></path><text id="You’re-a-TTV" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="60" font-weight="normal" letter-spacing="0.3857141" fill="#' + color + '" transform="translate(515)"><tspan id = "topLineMSGShare" x="0" y="79" text-anchor="middle" >' + document.getElementById("customizeShareFormINT").value + '</tspan><tspan x="0" y="151" text-anchor="middle" id = "bottomLineMSGShare">' + document.getElementById("customizeShareFormINB").value + '</tspan></text></g></g></g></svg>')

    document.getElementById("colorPickerTableTR").innerHTML = ""
    for (i = 0; i < msgColors.length; i ++) {
        var selectedID = ""
        if (i == sender) {
            selectedID="Selected"
        }
        document.getElementById("colorPickerTableTR").innerHTML = document.getElementById("colorPickerTableTR").innerHTML + '<td><a href="javascript:changeMSGShareLook(' + i + ')"><svg id="colorPickerShare'+selectedID+'" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Rectangle</title><desc>Created with Sketch.</desc><defs><filter x="0.0%" y="0.0%" width="100.0%" height="100.0%" filterUnits="objectBoundingBox" id="filter-1"><feGaussianBlur stdDeviation="0" in="SourceGraphic"></feGaussianBlur></filter></defs><g id="Page-1" stroke="fill" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Default" transform="translate(-730.000000, -1912.000000)" fill="#' + msgColors[i] + '"><g id="StyleBar" transform="translate(579.000000, 1874.000000)"><rect id="Rectangle" filter="url(#filter-1)" x="151" y="38" width="42" height="42" rx="11"></rect></g></g></g></svg></a></td>'
    }
    document.getElementById("colorPickerTableTR").innerHTML = document.getElementById("colorPickerTableTR").innerHTML + '<td><a href="javascript:randomShareColor()"><svg id = "randomTextShareBTN" viewBox="0 0 165 43" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: Sketch 53.2 (72643) - https://sketchapp.com --> <title>CopyToClipboardBTN</title><desc>Created with Sketch.</desc><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Default" transform="translate(-806.000000, -1938.000000)"><g id="CopyToClipboardBTN" transform="translate(806.000000, 1938.000000)"><rect id="backgroundOfGenerate" fill="#F5A623" x="0" y="0" width="145" height="43" rx="21.5"></rect><text id="generate" font-family="LuckiestGuy-Regular, Luckiest Guy" font-size="22" font-weight="normal" letter-spacing="0.1414285" fill="#FFFFFF"><tspan x="28.0548915" y="28">RANDOM</tspan></text></g></g></g></svg></a></td>'
    var imgOne = imgSRC[imgShareNum-1]
    var imgTwo = imgSRC[imgShareNum]
    var imgThree = imgSRC[imgShareNum+1]
    if (imgShareNum == 0) {
        imgOne = ""
    }
    if (imgShareNum == numOfImgHeads) {
        imgThree = ""
    }
    document.getElementById("imageShareTable").innerHTML = '<tr><td><a href="javascript:changeImgShare(-1)"><img src="Images/NextArrow.png" id="nextArrow"/></a></td><td><img src="'+imgOne+'" id="imageOfPicker"/></td><td><img src="'+imgTwo+'" id="imageOfPicker"/></td><td><image src="'+imgThree+'" id="imageOfPicker"/></td><td><a href="javascript:changeImgShare(1)"><img src="Images/NextArrow.png" style="-webkit-transform: scaleX(-1);transform: scaleX(-1);" id="nextArrow"/></a></td></tr>'
}

//Changes the share style
function changeShareStyle(styleNum) {
    shareStyle = styleNum
    if (shareStyle == 0) {
        shareStatCard(lastCardNum)
    }
    else {
        shareStatCard(-1)
    }
}

//Converts String to base64
function base64EncodeUnicode(str) {
    utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    });
    return btoa(utf8Bytes);
}

//Converts image to base64
function imageToBase64(imageId) { 
    var img = document.createElement("img");
    img.crossOrigin = 'Anonymous';
    if (imageId > numOfImgHeads) {
        img.src = currentNews[imageId-numOfImgHeads-1].image
        console.log(img.src)
    }
    else {  
        img.src = imgSRC[imageId]
    }
    var canvas = document.createElement("canvas");
    canvas.width = 276;
    canvas.height = 276;
    if (imageId > numOfImgHeads) {
        canvas.width = 1024;
        canvas.height = 512;
    }
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var imgd = canvas.toDataURL("image/png");
    return imgd;
}

//Opens new tab with the img and instructions
function makeImage() { 
    let img = document.getElementById("shareActualImage")
    var canvas = document.createElement("canvas");
    if (shareStyle == 0) {
        canvas.width = 652;
        canvas.height = 888;
    }
    else if (shareStyle == 1) {
        canvas.width = 709;
        canvas.height = 276;
    }
    else if (shareStyle == 2) {
        canvas.width = 541;
        canvas.height = 363;
    }
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var imgd = canvas.toDataURL("image/png");
    var win = window.open()
    win.document.write('<h1 style="text-align:center">Copy This Image and Send It!</h1><div style="text-align:center"><img src="' + imgd + '"/></div>')
}

//Getting the World Cup finalists
/*var finalistUSN = []
$.get("https://cors.io/?https://www.epicgames.com/fortnite/competitive/en-US/events/world-cup/apiStandings/final-players", function(data) {
    let element = $(data).find(".easfp-entry-table.solo").html()
    var finalists = ""
    $(element).find("li").each(function() {
        finalistUSN.push($(this).text())
        finalists = finalists + " " + $(this).text()

    })
    console.log(finalistUSN)
    document.getElementById("text").innerHTML = finalists*/