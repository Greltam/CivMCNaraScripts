//For a list of Scripts, 
//download each one from github and replace in Macros folder
directoryPath = "./"
ListOfAllScripts = [
    //Self updating
    "NaraGHScriptDownloader",
    
    //Main utility file
    "McUtilityFile",

    //Event utility files
    "McUReconnect",
    "McUKillSnitchEngage",
    
    //Auxiliary helper files
    "McIceRoading",
    "McCraftChests",
    "McCraftBottles",
    "McCraftDeepslateTiles",
    
    //Main Farm files
    "McOakHiTechReplant",
    "McOakHiTechChop",
    "McZealWestMelonTower",
    "McBeachaEastMelonTower",
    "McCarrotTower",
    "McWheatTower",
    "McPotatoTower",
    "McCocoaTower",
    "McSugarcane",
    "McSweetBerry",

    //Nether Farms
    "McTwistingVines",
    "McNetherwart",
    "McNetherStemTower",

    //Delayed Start Scripts
    "vDelayZealOak",
    "vDelayNetherStem",

    //Simple utility scripts
    "zBridge",
    "zCrouchMine",
    "zJumpUsing",
    "zKeepAttacking",
    "zKeepMoving",
    "zKeepUsing",
    "zOreBreak"
]

function scriptNameToGithubURL(scriptName){
    return "https://raw.githubusercontent.com/"
         + "Greltam/CivMCNaraScripts/main/Code/"
         + scriptName +".js"
}

function rewriteScript(scriptName){
    scriptGithubText = Request.get(scriptNameToGithubURL(scriptName)).text()
    scriptFile = FS.open(directoryPath + scriptName + ".js")
    scriptFile.write(scriptGithubText)
}


//update all files
for(let i = 0; i < ListOfAllScripts.length; i++){
    Chat.log("Redownloading " + ListOfAllScripts[i] + " Script...")
    rewriteScript(ListOfAllScripts[i])
}
