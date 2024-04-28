//For a list of Scripts, 
//download each one from github and replace in Macros folder
directoryPath = "NaraGH/"
ListOfAllScripts = [
    "McUtilityFile",
    "McIceRoading",
    "McOakHiTechReplant",
    "McOakHitTechChop"
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
