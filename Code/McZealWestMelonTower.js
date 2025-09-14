
/*------------------------
   0 Title Start
------------------------*/
/*
    Name: Zeal SaTa West Melon Tower script
    Location: CivMC @ 3987, 7394, 104
    Author: Greltam
    Date: 9/13/2025
    
    Description: A tower full of carrots!
    
    Directions: 
        Enter building, go to the north to lodestone
        Stand on lodestone @ 3987, 7374, 104
        Activate farm script.
             
    Collector: Lodestone elevator @ 3986, 7374, 104
        Go down twice
        Go through door to the southeast
        Auto-Compactor @ 3996, 7376, -60
*/
/*------------------------
   0 Title End
------------------------*/

/*------------------------
   0.1 Player Requirements Start
------------------------*/
/*
    Pre-Start actions: 
        Use lodestone to collector room
        Open trapdoors to check compactor for health.
        Repair if necessary and return recipe to compact.
        Remove items if repair is stopping
        
        Check for Haste 2 Beacon effect.
        Use lodestone to collector room and look north
        
    Items Required:
        3x Silk Touch Efficiency 4 or 5 axes 
        Tool held in mainhand
    
    Restarting: On Lodestone

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
    // default: "key.keyboard.left.shift"
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
farmName = "SaTa Zeal West Melon Tower"
regrowthTime = 18.5 * 3600 //hours multiplied by seconds per hour
harvestDuration = 77 //minutes to run a full harvest

//Player starts script at this location
xStartPosition = 3987 
zStartPosition = 7374
yStartPosition = 104


//set item list and look vector for tossing items into collector
//util.setPassLookBoundary(false)
util.setTossItemList(["minecraft:melon", "minecraft:melon_slice"])
util.setTossLookVector([-90,-30])

//Allows restarting anywhere in the farm
startingLayer = 1 //default: startingLayer = 1
startingRow = 1 //default: startingRow = 1
restarting = false //default: restarting = false

//total layers in the tree farm
totalLayers = 54 //default: totalLayers = 54
melonsPerRow = 28 //default: treesPerRow = 28
rowsPerLayer = 6 //default: rowsPerLayer = 16
layerHeight = 3 //default: layerHeight = 12
rowWidth = 5 //default: rowWidth = 5 //space between start of a sides row and next row
endLengths = 5 //default: treeBridgeLength = 5

//Time it takes for e5 diamond axe to cross sides
//replace after doing hitech stuff
secondsToHarvest = 9

//direction to look at carrots to harvest while strafing
harvestOutLookX = 90
harvestReturnLookX = -90
harvestLookY = 13


/*------------------------
   2 Global Variables End
------------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("SaTa West", "yellow"),
        util.simpleJSONString(" Melon", "dark_green"),
        util.simpleJSONString(" Tower", "gray"),
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
        util.simpleJSONString("SaTa West", "yellow"),
        util.simpleJSONString(" Melon", "dark_green"),
        util.simpleJSONString(" Tower", "gray"),
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
    //move to trapdoor at start of next row
    util.simpleMove(leftKey,harvestOutLookX,0,2*20)
    
    //Chop out to end of row
    util.complexMove([forwardKey,attackKey],
        harvestOutLookX,harvestLookY,secondsToHarvest * 20)
    
    //move to trapdoor at start of next row
    util.simpleMove(rightKey,harvestReturnLookX,0,2*20)
}

function harvestReturnStrip(){
    if(util.checkQuit()){
        return
    }
    //Chop back to beginning of row
    util.complexMove([forwardKey,attackKey],
        harvestReturnLookX,harvestLookY,secondsToHarvest * 20)
}


function moveToNextLayer(){
    util.simpleMove(rightKey,90,0,5*20)
    util.simpleMove(backwardKey,90,0,2*20)
    util.simpleMove(lodestoneDownKey,90,0,20)
}

function getRow(offset){
    if(offset >= 0 && offset <= 2){
        return 1
    }
    if(offset == 3){
        return 2
    }
    if(offset >= 4 && offset <= 7){
        return 3
    }
    if(offset == 8){
        return 4
    }
    if(offset >= 9 && offset <= 12){
        return 5
    }
    if(offset == 13){
        return 6
    }
    return 1
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
    zOffset = Math.floor(util.player.getZ() - zStartPosition)
    startingRow = getRow(zOffset)
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
visual.fullText("melons","Melons: " 
    + util.getTossedItemAmount("minecraft:melon"), 0xffa500,0,16)
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
        }
           
    }
    
    //move to the start of the next layer
    //toss melons to collectors
    //then update overlay
    moveToNextLayer() 
    util.tossItems()
    visual.setText("melons", "Melons: " 
        + util.getTossedItemAmount("minecraft:melon"))
    visual.setText("timeLeft", "Remaining time: " 
        + util.remainingMinutes(
        i,rowsPerLayer,totalLayers, rowsPerLayer,harvestDuration))
    
    //eat food if hungry
    util.checkHunger()
    
    
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
