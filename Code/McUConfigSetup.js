/*
    Prepopulate the player's config settings
*/
/*------------------------
   1.1 Import Files Start
------------------------*/
const config = require("./McUConfigFile.js")
config.initialize()
/*-----------------------
   1.1 Import Files End
-----------------------*/

/*------------------------
   1.2 Player Configurables Start
------------------------*/
//subdirectory(s) under config/JSMacros/Macros folder
// "./" for main Macros folder
// "NaraGH" if you have these in config/JSMacros/Macros/NaraGH
scriptDirectory = "./" //default: "./" 

//player control initialization
quitKey = "key.keyboard.j" // default: "key.keyboard.j"
leftKey = "key.keyboard.a" // default: "key.keyboard.a"
rightKey = "key.keyboard.d" // default: "key.keyboard.d"
forwardKey = "key.keyboard.w" // default: "key.keyboard.w"
backwardKey = "key.keyboard.s" // default: "key.keyboard.s"
jumpKey = "key.keyboard.space" // default: "key.keyboard.space"
useKey = "key.mouse.right" // default: "key.mouse.right"
attackKey = "key.mouse.left" // default: "key.mouse.left"
lodestoneUpKey = "key.keyboard.space" // default: "key.keyboard.space"
lodestoneDownKey = "key.keyboard.left.shift" 
    //default: "key.keyboard.left.shift"

//special flags
logDiscord = true // default: true
verboseLog = false // default: false
logoutOnCompletion = false // default: false
delayStartHour = 3 // default: 3

quitKey = config.getString("quitKey", quitKey)
leftKey = config.getString("leftKey", leftKey)
rightKey = config.getString("rightKey", rightKey)
forwardKey = config.getString("forwardKey", forwardKey)
backwardKey = config.getString("backwardKey", backwardKey)
jumpKey = config.getString("jumpKey", jumpKey)
useKey = config.getString("useKey", useKey)
attackKey = config.getString("attackKey", attackKey)
lodestoneUpKey = config.getString("lodestoneUpKey", lodestoneUpKey)
lodestoneDownKey = config.getString("lodestoneDownKey", lodestoneDownKey)

logDiscord = config.getBool("logDiscord", logDiscord)
verboseLog = config.getBool("verboseLog", verboseLog)
logoutOnCompletion = config.getBool("logoutOnCompletion", logoutOnCompletion)
delayStartHour = config.getValue("delayStartHour", delayStartHour)
