//For a list of Scripts, 
//download each one from github and replace in Macros folder
directoryPath = "./"

ListOfAllScripts = [
    //Self updating
    "NaraGHScriptDownloader",
    
    //Main utility file
    "McUtilityFile",
    "McUConfigFile",
    "McUConfigSetup",
    "McUVisualizer",

    //Event utility files
    "McUReconnect",
    "McUKillSnitchEngage",
    
    //Auxiliary helper files
    "McIceRoading",
    "McCraftChests",
    "McCraftBottles",
    "McCraftDeepslateTiles",
    "McCraftGoldenCarrots",
    "McCraftBulkEnchanting",
    
    //Main Farm files
    "McOakHiTechChop",
    "McZealWestMelonTower",
    "McBeachaEastMelonTower",
    "McCarrotTower",
    "McWheatTower",
    "McPotatoTower",
    "McCocoaTower",
    "McSugarcane",
    "McSweetBerry",
    "McBeetTower",

    //Nether Farms
    "McTwistingVines",
    "McNetherwart",
    "McNetherStemTower",

    //Delayed Start Scripts
    "vDelayFarm",
    "vDaisyTwistingWart",
    "vDaisyMelonPotato",

    //Simple utility scripts
    "zBridge",
    "zCrouchMine",
    "zJumpUsing",
    "zKeepAttacking",
    "zKeepMoving",
    "zKeepUsing",
    "zOreBreak"
]

ListOfRemovedScripts = [
    
    //Main Farm files
    "McOakHiTechReplant",
    
    //Delayed Start Scripts
    "vDelayZealOak",
    "vDelayNetherStem",
    "vDelayAFK"
]

/*-------------------
   3 Functions Start
-------------------*/
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

function deleteScript(scriptName){
    scriptFile = directoryPath + scriptName + ".js"
    if(FS.exists(scriptFile)){
        FS.unlink(scriptFile)
        Chat.log("Removing " + scriptFile + "...")
    }
}
function getDirectory(){

    rawPath = FS.toRawPath("NaraGHScriptDownloader.js")
    path = rawPath.toString()
    
    subPath = path.split("\\Macros\\")
    //subPath[0] should be all the .../.minecraft/config/jsmacros
    //subPath[1] should be the subdirectory(s)/"NaraGHScriptDownloader.js"
    
    subSplit = subPath[1].split("NaraGHScriptDownloader.js")
    return subSplit[0]
        
    //return "./"
}

/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/
//update all files
for(let i = 0; i < ListOfAllScripts.length; i++){
    Chat.log("Redownloading " + ListOfAllScripts[i] + " Script...")
    rewriteScript(ListOfAllScripts[i])
}

//remove old files
for(let i = 0; i < ListOfRemovedScripts.length; i++){
    deleteScript(ListOfRemovedScripts[i])
}

//prepopulate player settings
Chat.log("Populating playerSettings.txt...")
JsMacros.runScript(getDirectory() + "McUConfigSetup.js")

/*-------------------
   4 Program End
-------------------*/









