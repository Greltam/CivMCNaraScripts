/*------------------------
   0 Title Start
------------------------*/
/*
    Name: GSEZ Wheat Tower
    Location: CivMC @ 3043, 5140, 84
    Author: Greltam
    Date: 9/13/2025
    
    Description: A tower full of wheat!
    
    Directions:
        Enter building, go to the west door into the farm.
        Use lodestone elevator down 1 floor
        Activate farm script.
        
    Collector: Lodestone elevator @ 3026, 5141, 83
*/
/*------------------------
   0 Title End
------------------------*/

/*------------------------
   0.1 Player Requirements Start
------------------------*/
/*
    Pre-Start actions: 
        In entrance room, use lodestone to collector room
        Check collection chests and empty out if needed
        
    Items Required:
        None. Fortune tools will create more seeds than
        the collector can handle.
    
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
lodestoneDownKey = "key.keyboard.space" // default: "key.keyboard.space"
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
farmName = "GSEZ Wheat Tower"
regrowthTime = 43 * 3600 //hours multiplied by seconds per hour
harvestDuration = 85 //minutes to run a full harvest

//Player starts script at this location
xStartPosition = 3024 
zStartPosition = 5137
yStartPosition = 80

//set item list and look vector for tossing items into collector
util.setPassLookBoundary(false)
util.setTossItemList(["minecraft:wheat","minecraft:wheat_seeds"])
util.setTossLookVector([90,-25])

//Allows restarting anywhere in the farm
startingLayer = 1 //default: startingLayer = 1
startingRow = 1 //default: startingRow = 1
restarting = false //default: restarting = false

//total layers in the tree farm
totalLayers = 14 //default: totalLayers = 14
wheatPerRow = 27 //default: wheatPerRow = 27
rowsPerLayer = 30 //default: rowsPerLayer = 30
layerHeight = 3 //default: layerHeight = 3

//Time it takes to cross sides
//replace after doing hitech stuff
secondsToHarvest = 7 //or 8

//direction to look at carrots to harvest while strafing
harvestLookX = 180
harvestLookY = 45
/*------------------------
   2 Global Variables End
------------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("GSEZ", "dark_aqua"),
        util.simpleJSONString(" Wheat", "gold"),
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
        util.simpleJSONString("GSEZ", "dark_aqua"),
        util.simpleJSONString(" Wheat", "gold"),
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

function harvestStarterStrip(){
    if(util.checkQuit()){
        return
    }    
    //harvest row while strafing right
    util.complexMove([rightKey,useKey],
        harvestLookX, 28, secondsToHarvest * 20)

    //harvest row while strafing left
    util.complexMove([leftKey,useKey],
        harvestLookX, 20, secondsToHarvest * 21)
}

function harvestOutStrip(){
    if(util.checkQuit()){
        return
    }
    
    //harvest row while strafing right
    util.complexMove([rightKey,useKey],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
    //move flush to fence
    util.simpleMove(forwardKey, harvestLookX, harvestLookY, 1*20)

}
function harvestReturnStrip(){
    if(util.checkQuit()){
        return
    }
    //harvest row while strafing left
    util.complexMove([leftKey,useKey],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
    //move flush to fence
    util.simpleMove(forwardKey, harvestLookX, harvestLookY, 1*20)
}

function moveToNextLayer(){
    //at the end of the left side of the row.
    
    //move flush to forward wall
    util.simpleMove(forwardKey, harvestLookX, harvestLookY, 1*20)
    
    //move right to return bridge
    util.simpleMove(forwardKey, -90, 0, 8 * 20)
    
    //move back to front of layer
    util.simpleMove(forwardKey, 0, 0, 8 * 20)
    
    //move left to lodestone
    util.simpleMove(forwardKey, 90, 0, 8 * 20)
    
    //jump to next floor
    util.simpleMove(lodestoneUpKey,harvestLookX,harvestLookY,10)
}

//called at start of script to set layer in carrot farm
//especially for restarts
function setStartingPosition(){
    playerY = util.player.getY()
    //set layer
    startingLayer = ((playerY - yStartPosition) / layerHeight) + 1.5
    startingLayer = Math.floor(startingLayer)
    Chat.log("Starting layer = " + startingLayer)
    
    //set row
    startingRow = Math.floor(zStartPosition - util.player.getZ() + 1)
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
visual.fullText("wheat", "Wheat: " 
    + util.getTossedItemAmount("minecraft:wheat"), 0xffff33,0,16)
visual.fullText("timeLeft",
            "Remaining time: " + harvestDuration, 0x999999,0,24)
//restart farm on reconnect
GlobalVars.putBoolean("farmRunning",true)
GlobalVars.putBoolean("killsnitch", false)


Chat.log(greetingsText)
Chat.log(quitText)
    
//output to Discord
if(logDiscord){
    util.logScriptStart(farmName)
}

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
        
        //harvest front 2 strips then move flush to starting fence
        if(j == 0){
            harvestStarterStrip()
            util.simpleMove(forwardKey, harvestLookX, harvestLookY, 1*20)
        }
        else if(j % 2 == 1){
            harvestOutStrip()
        }
        else{
            harvestReturnStrip()
            util.tossItems()
            visual.setText("wheat", "Wheat: " 
                + util.getTossedItemAmount("minecraft:wheat"))
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
        startingRow = 0
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
