/*------------------------
   0 Title Start
------------------------*/
/*
    Name: Daisy Melon and Potato
    Location: SaTa  @ 4020, 7378, 103
    Author: Greltam
    Date: 9/17/2025
    
    Description: A Linking of the farm scripts for
        Beacha34 East Melon Tower -> 
        Zeal West Melon Tower -> 
        Potato Tower
    
    Directions:
        Head to lodestone @ 4020, 7376, -62
        Either
            Activate script
        Or
            Activate vDelayFarm
    
    Collector: Lodestone elevator @ 
*/
/*------------------------
   0 Title End
------------------------*/

/*------------------------
   0.1 Player Requirements Start
------------------------*/
/*    
    Inventory will be filled with:
    5 - 6 Efficiency 4 or 5 ST Diamond Axes
    1 Harvest Hoe (fortune 3)
    
    Player must place axe in the rightmost hotbar(9)
    Player must place hoe in the next rightmost hotbar(8)
    
    Pre-Start actions: 
        Check Compactor for health and compact recipe
        If repairing, remove items from compactor chest
            to deactivate auto turn on/off cycling
        Remember to reactivate the compact recipe
        Load up 30 stacks of crates
    Items Required: Harvest hoe (fortune 3)
*/
/*-----------------------
   0.1 Player Requirements End
-----------------------*/

/*------------------------
   1.1 Import Files Start
------------------------*/
const util = require("./McUtilityFile.js")

const config = require("./McUConfigFile.js")
config.initialize()

const visual = require("./McUVisualizer.js")
visual.clear()

/*-----------------------
   1.1 Import Files End
-----------------------*/

/*------------------------
   1.2 Player Configurables Start
------------------------*/
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
    // default: "key.keyboard.left.shift"
logDiscord = true // default: "true"
verboseLog = false // default: "false"
logoutOnCompletion = false // default: "false"

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

//alter the default quitkey from j to whatever you want.
util.setQuitKey(quitKey) //default: util.setQuitKey("key.keyboard.j") 


/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
farmName = "Daisy Chaining SaTa Melon and Potatoes"
regrowthTime = 24 * 3600 //hours multiplied by seconds per hour
harvestDuration = 85 //minutes to run a full harvest

/*------------------------
   2 Global Variables End
------------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("SaTa", "yellow"),
        util.simpleJSONString(" Melon Potato", "dark_green"),
        util.simpleJSONString(" Daisy Chain", "gray"),
        util.simpleJSONString(", booting", "gold")
    ])
)
    
quitText =  Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("To ", "white"),
        util.simpleJSONString("Quit", "red"),
        util.simpleJSONString(", Press: ", "white"),
        util.simpleJSONString(util.getQuitKey(), "gold")
    ])
)

finishedText =  Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("SaTa", "yellow"),
        util.simpleJSONString(" Melon Potato", "dark_green"),
        util.simpleJSONString(" Daisy Chain", "gray"),
        util.simpleJSONString(", shutting down...", "red")
    ])
)
/*-----------------------
   2.1 Formatted Strings End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/
function getDirectory(){

    rawPath = FS.toRawPath("vDaisyMelonPotato.js")
    path = rawPath.toString()
    
    subPath = path.split("\\Macros\\")
    //subPath[0] should be all the .../.minecraft/config/jsmacros
    //subPath[1] should be the subdirectory(s)/"vDaisyTwistingWart.js"
    
    subSplit = subPath[1].split("vDaisyMelonPotato.js")
    return subSplit[0]
}

function moveToStart(){
//starting at bottom lodestone, head up elevator to start of Beacha
    Chat.log("Heading up to Beacha34 Melon Tower")
    util.simpleMove(lodestoneUpKey,-180, 0, 20)
    util.simpleMove(lodestoneUpKey,-180, 0, 20)
    util.simpleMove(backwardKey,-180, 0, 1*20)
}

function moveToZealMelon(){
//starting from Beacha, head over to Zeal Melon Tower
    Chat.log("Moving to Zeal Melon Tower")
    util.simpleMove(forwardKey,-180, 0, 1*20)
    util.simpleMove(lodestoneDownKey,-180, 0, 10)
    util.simpleMove(forwardKey,90, 0, 10*20)
    util.simpleMove(forwardKey,-180, 0, 1*20)
    util.simpleMove(lodestoneUpKey,-180, 0, 10)
    util.simpleMove(forwardKey,90, 0, 1*20)
    util.simpleMove(lodestoneUpKey,90, 0, 10)
    util.simpleMove(backwardKey,90, 0, 1*20)
}

function moveToPotatoes(){
//starting from Zeal Melon tower, head down to Potato Tower
    Chat.log("Moving to Potato Tower")
    
    //Switch to harvest hoe
    util.selectHotbar(7)
    util.simpleMove(forwardKey,0, 0, 5*20)
    util.simpleMove(forwardKey,-90, 0, 4*20)
    util.simpleMove(lodestoneUpKey,0, 0, 10)
    util.simpleMove(forwardKey,0, 0, 1*20)
}
/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   3.9 Pre-Program Start
-------------------*/
//restart farm on reconnect
GlobalVars.putBoolean("farmRunning",true)
GlobalVars.putBoolean("daisySata",true)//for reconnect
GlobalVars.putBoolean("killsnitch", false)

Chat.log(greetingsText)
Chat.log(quitText)

//protect from tabbed out dysfunction
Client.grabMouse()
/*-------------------
   3.9 Pre-Program End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/
//Run first farm of Beacha Melon Tower
if(!GlobalVars.getBoolean("farm1")){
    GlobalVars.putBoolean("farmComplete", false)
    
    moveToStart()
    Chat.log("Booting up Beacha Melon Tower")
    JsMacros.runScript(getDirectory() + "McBeachaEastMelonTower.js")
    while(!GlobalVars.getBoolean("farmComplete")){
        Time.sleep(60000)//check back in 1 minute
    }
    
    moveToZealMelon()
    GlobalVars.putBoolean("farm1", true)
} 

//Run second farm of Zeal Melon Tower
if(!GlobalVars.getBoolean("farm2")){
    GlobalVars.putBoolean("farmComplete", false)
    
    Chat.log("Booting up Zeal Melon")
    JsMacros.runScript(getDirectory() + "McZealWestMelonTower.js")
    while(!GlobalVars.getBoolean("farmComplete")){
        Time.sleep(60000)//check back in 1 minute
    }
    
    moveToPotatoes()
    GlobalVars.putBoolean("farm2", true)

} 

//Run third farm of Potato Tower
if(!GlobalVars.getBoolean("farm3")){
    GlobalVars.putBoolean("farmComplete", false)
    
    Chat.log("Booting up Potato Tower")
    JsMacros.runScript(getDirectory() + "McPotatoTower.js")
    while(!GlobalVars.getBoolean("farmComplete")){
        Time.sleep(60000)//check back in 1 minute
    }
    GlobalVars.putBoolean("farm3", true) 
}
/*-------------------
   4 Program End
-------------------*/

/*-------------------
   4.1 Shutdown Start
-------------------*/

//prevent reconnect from restarting farm
GlobalVars.putBoolean("farmComplete", false)
GlobalVars.putBoolean("farmRunning", false)
GlobalVars.putBoolean("daisySata",false)
GlobalVars.putBoolean("farm1", false)
GlobalVars.putBoolean("farm2", false)
GlobalVars.putBoolean("farm3", false)

//Reset keybinds to prevent phantom key holds.
util.resetKeys()

//log script completion
Chat.log(finishedText)

//logout after daisy chain completion
GlobalVars.putBoolean("killsnitch", true)
Chat.say("/logout")

/*-------------------
   4.1 Shutdown End
-------------------*/
