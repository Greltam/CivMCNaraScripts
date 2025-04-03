//Zeal Exclave Sugarcane Tower Script
/*
    !!! Script starts at 4225, 416, 80 !!!
    Find 1.2 Player Configurables to adjust for script restarts

    Zeal Exclave Sugarcane Tower Script on CivMC @ 4225, 416, 80
    Written by Greltam 4/3/2025

    Tab-outable.
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Start script while standing on that layers lodestone

//Restarting: Stand directly on the current layer's lodestone

//Collector: Lodestone elevator @ 4224, 416, 80
/*-----------------------
   0.1 Player Requirements to Start End
-----------------------*/


/*------------------------
   1.1 Import Files Start
------------------------*/
const util = require("./McUtilityFile.js")
/*-----------------------
   1.1 Import Files End
-----------------------*/

/*------------------------
   1.2 Player Configurables Start
------------------------*/
//Script likes to get kicked for 180 -> -180 looking
//tell utility not to cross boundary and do full spins
//smoothly to not get kicked
util.setPassLookBoundary(false)

//set item list and look vector for tossing items into collector
util.setTossItemList(["minecraft:sugar_cane"])
util.setTossLookVector([-90,-25])

//alter the default quitkey from j to whatever you want.
util.setQuitKey("key.keyboard.j") //default: util.setQuitKey("key.keyboard.j") 


//Always restart on a lodestone
startingLayer = 1 //default: startingLayer = 1

//total layers in the tree farm
totalLayers = 6 //default: totalLayers = 14
rowsPerLayer = 30 //default: rowsPerLayer = 30
doubleRows = Math.floor(rowsPerLayer/2)
layerHeight = 4 //default: layerHeight = 3

//Time it takes to cross sides
//replace after doing hitech stuff
secondsToHarvest = 6 //or 8

//direction to look at sugarcane to harvest while strafing
harvestLookX = 0
harvestLookY = 0
/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
farmName = "Zeal Exclave Sugarcane Tower"
regrowthTime = 14 * 3600 //hours multiplied by seconds per hour

//Player starts script at this location
xStartPosition = 4224 
zStartPosition = 416
yStartPosition = 80

/*-----------------------
   2 Global Variables End
-----------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("Zeal Exclave", "dark_red"),
        util.simpleJSONString(" Sugarcane", "green"),
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
        util.simpleJSONString("Zeal Exclave", "dark_red"),
        util.simpleJSONString(" Sugarcane", "green"),
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

function harvestDoubleStrip(){
    if(util.checkQuit()){
        return
    }
    //move flush to fence
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //harvest row while strafing left
    util.complexMove(["key.keyboard.a","key.mouse.left"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
        
    util.tossItems()

    //move flush to fence
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //harvest row while strafing right
    util.complexMove(["key.keyboard.d","key.mouse.left"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
}

function moveToNextLayer(){
    //at the end of the right side of the row.
    
    //move flush to forward wall
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
        
    //move back to front of layer
    util.simpleMove("key.keyboard.w", -180, 0, 9 * 20)
    
    //crouch to next floor
    util.simpleMove("key.keyboard.left.shift",harvestLookX,harvestLookY,10)
}

//called at start of script to set layer
//especially for restarts
function setStartingLayer(){
    playerY = util.player.getY()
    //set layer
    startingLayer = ((yStartPosition - playerY) / layerHeight) + 1
    startingLayer = Math.floor(startingLayer)
    //Chat.log("Starting layer = " + startingLayer)
}

/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/
Chat.log(greetingsText)
Chat.log(quitText)
util.logScriptStart(farmName)

//set starting layer in case restarting on another layer
setStartingLayer()

//harvest all the layers
for(let i = startingLayer; i <= totalLayers; i++){
    if(util.checkQuit()){
        break
    }
    
    //harvest all the double rows
    for(let j = 1; j <= doubleRows; j++){
        if(util.checkQuit()){
            break
        }
        harvestDoubleStrip()
    }
    
    //move to the start of the next layer
    moveToNextLayer()
}
    


//Reset keybinds to prevent phantom key holds.
util.resetKeys()

//log script completion
Chat.log(finishedText)
util.logScriptEnd(farmName, regrowthTime)

/*-------------------
   4 Program End
-------------------*/
