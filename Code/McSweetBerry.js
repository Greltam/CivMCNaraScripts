/*------------------------
   0 Title Start
------------------------*/
/*
    Name: Zeal SaTa Sweet Berry Tower Script
    Location: CivMC @ 4000, 7400, 104
    Author: Greltam
    Date: 9/13/2025
    
    Description: A tower full of Sweet Berries!
    
    Directions: 
        Enter building, stand on trapdoor 
            by lodestone @ 3980, 7427, 106
        Hold anything but stick in hand. 
        Fortune does not work on berries
        Activate farm script.
        
    Collector: Lodestone elevator @ 3982, 7421, 103
*/
/*------------------------
   0 Title End
------------------------*/

/*------------------------
   0.1 Player Requirements Start
------------------------*/
/*
    Pre-Start actions: 
        Go to collector room
        Open trapdoors to check compactor for health.
        Repair if necessary and return recipe to compact.
        Remove items from compactor if repair is stopping.
        
    Items Required:
        A fortune 3 tool, I use a golden "harvest" hoe
        Tool held in mainhand
    
    Restarting: Anywhere inside the farm

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
useKey = "key.mouse.right" // default: "key.mouse.right"
attackKey = "key.mouse.left" // default: "key.mouse.left"
lodestoneUpKey = "key.keyboard.space" // default: "key.keyboard.space"
lodestoneDownKey = "key.keyboard.left.shift" 
    //default: "key.keyboard.left.shift"
logDiscord = true // default: "true"
verboseLog = false // default: "false"
logoutOnCompletion = false // default: "false"

quitKey = config.getString("quitKey", quitKey)
leftKey = config.getString("leftKey", leftKey)
rightKey = config.getString("rightKey", rightKey)
forwardKey = config.getString("forwardKey", forwardKey)
backwardKey = config.getString("backwardKey", backwardKey)
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
farmName = "SaTa Sweet Berry Tower"
regrowthTime = 29 * 3600 //hours multiplied by seconds per hour
harvestDuration = 145 //minutes to run a full harvest

//Player starts script at this location
xStartPosition = 3980 
zStartPosition = 7427
yStartPosition = 106

//Script likes to get kicked for 180 -> -180 looking
//tell utility not to cross boundary and do full spins
//smoothly to not get kicked
util.setPassLookBoundary(false)
util.setTossItemList(["minecraft:sweet_berries"])
util.setTossLookVector([-90,0])

//Allows restarting anywhere in the farm
startingLayer = 1 //default: startingLayer = 1
startingRow = 1 //default: startingRow = 1
restarting = false //default: restarting = false

//total layers in the tree farm
totalLayers = 54 //default: totalLayers = 14
berriesPerRow = 25 //default: berriesPerRow = 25
rowsPerLayer = 14 //default: rowsPerLayer = 14
layerHeight = 3 //default: layerHeight = 3

//Time it takes to cross sides
//replace after doing hitech stuff
secondsToHarvest = 7 //or 8

//direction to look at carrots to harvest while strafing
harvestLookX = 84
harvestLookY = 16
/*------------------------
   2 Global Variables End
------------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("SaTa", "yellow"),
        util.simpleJSONString(" Sweet Berry", "red"),
        util.simpleJSONString(" Tower", "green"),
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
        util.simpleJSONString(" Sweet Berry", "red"),
        util.simpleJSONString(" Tower", "green"),
        util.simpleJSONString(", shutting down...", "red")
    ])
)
/*-----------------------
   2.1 Formatted Strings End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/

function harvestOutStrip(){
    if(util.checkQuit()){
        return
    }
    util.complexMove([forwardKey,useKey],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
    
    //move to next row
    util.simpleMove(forwardKey, 0, 0, 1*20)
}

function harvestReturnStrip(){
    if(util.checkQuit()){
        return
    }
    util.complexMove([forwardKey,useKey],
        -harvestLookX, harvestLookY, secondsToHarvest * 20)
        
    util.simpleMove(forwardKey, 0, 0, 1*20)
}
function moveToNextLayer(){
    //at the end of the left side of the row.
    
    //move flush to the stairs
    util.simpleMove(forwardKey, -45, 0, 1*20)
    
    //walk to the lodestone
    util.simpleMove(forwardKey, -180, 0, 7*20)
        
    //crouch to next floor
    util.simpleMove(lodestoneDownKey,-180,0,10)
    
    //move off the lodestone onto the floor
    util.simpleMove(forwardKey, 90, 0, 10)
}

//called at start of script to set layer in carrot farm
//especially for restarts
function setStartingPosition(){
    playerY = util.player.getY()
    //set layer
    startingLayer = ((yStartPosition - playerY) / layerHeight) + 1
    startingLayer = Math.floor(startingLayer)
    Chat.log("Starting layer = " + startingLayer)
    
    //set row
    startingRow = Math.floor((util.player.getZ() - zStartPosition)/2) + 1
    Chat.log("Starting row = " + startingRow)
    if(startingLayer > 1 || startingRow > 1){
        restarting = true
    }
}
/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   3.9 Pre-Program Start
-------------------*/
//GUI overlay
visual.fullText("farmName", farmName, 0xdddddd,0,0)
visual.fullText("toQuit", "Quit key: " + quitKey,0xffaaaa,0,8)
visual.fullText("berries","Berries: " 
    + util.getTossedItemAmount("minecraft:sweet_berries"), 0xff4444,0,16)
visual.fullText("timeLeft",
            "Remaining time: " + harvestDuration, 0x999999,0,24)

//restart farm on reconnect
GlobalVars.putBoolean("farmRunning",true)


Chat.log(greetingsText)
Chat.log(quitText)
    
//output to Discord
if(logDiscord){
    util.logScriptStart(farmName)
}

//protect from tabbed out dysfunction
Client.grabMouse()

/*-------------------
   3.9 Pre-Program End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/

//set starting layer in case restarting on another layer
setStartingPosition()

//harvest all the layers
for(let i = startingLayer; i <= totalLayers; i++){
    if(util.checkQuit()){
        break
    }
    
    //harvest all the rows
    for(let j = startingRow; j <= rowsPerLayer; j++){
        if(util.checkQuit()){
            break
        }
        if(j % 2 == 1){
            harvestOutStrip()
        }
        else{
            harvestReturnStrip()
            util.tossItems()
            visual.setText("berries", "Berries: " 
                + util.getTossedItemAmount("minecraft:sweet_berries"))
        }
        visual.setText("timeLeft", "Remaining time: " 
                + util.remainingMinutes(
                i,j,totalLayers, rowsPerLayer,harvestDuration))
    }
    
    //move to the start of the next layer
    moveToNextLayer()
    
    //if restarting, set restart to false and change 
    //starting back to defaults
    if(restarting){
        restarting = false
        startingRow = 1
    }
}

/*-------------------
   4 Program End
-------------------*/
/*-------------------
   4.1 Shutdown Start
-------------------*/

//prevent reconnect from restarting farm
GlobalVars.putBoolean("farmRunning", false)

//Reset keybinds to prevent phantom key holds.
util.resetKeys()

//log script completion
Chat.log(finishedText)

//output to Discord
if(logDiscord){
    util.logScriptEnd(farmName, regrowthTime, verboseLog)
}

//clear all GUI overlays
visual.clear()

//Exit server if on a delay start or desired
if(logoutOnCompletion || GlobalVars.getBoolean("delayFarm")){
    GlobalVars.putBoolean("delayFarm", false)
    GlobalVars.putBoolean("killsnitch", true)
    Chat.say("/logout")
}
/*-------------------
   4.1 Shutdown End
-------------------*/
