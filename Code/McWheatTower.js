//Zeal GSEZ Wheat Tower Script
/*
    !!! Script starts at 3024, 5137, 80 !!!
    Find 1.2 Player Configurables to adjust for script restarts

    GSEZ Wheat Tower Script on CivMC @ 3043, 5140, 84
    Written by Greltam 1/12/2025

    Tab-outable.
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Start script while standing on that layers lodestone
//Start with Fortune 3 tool in mainhand
//(Any, use golden forge factory to get a cheap one)

//Restarting: Stand directly on the current layer's lodestone

//Collector: Lodestone elevator @ 3026, 5141, 83
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
//set item list and look vector for tossing items into collector
util.setTossItemList(["minecraft:wheat","minecraft:wheat_seeds"])
util.setTossLookVector([90,-25])

//alter the default quitkey from j to whatever you want.
util.setQuitKey("key.keyboard.j") //default: util.setQuitKey("key.keyboard.j") 

//Always restart on a lodestone
startingLayer = 1 //default: startingLayer = 1

//total layers in the tree farm
totalLayers = 14 //default: totalLayers = 14
carrotsPerRow = 27 //default: treesPerRow = 27
rowsPerLayer = 30 //default: rowsPerLayer = 30
doubleRows = Math.floor(rowsPerLayer/2)
layerHeight = 3 //default: layerHeight = 3

//Time it takes to cross sides
//replace after doing hitech stuff
secondsToHarvest = 7 //or 8

//direction to look at carrots to harvest while strafing
harvestLookX = 180
harvestLookY = 45


/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
farmName = "GSEZ Wheat Tower"
regrowthTime = 43 * 3600 //hours multiplied by seconds per hour

//Player starts script at this location
xStartPosition = 3024 
zStartPosition = 5137
yStartPosition = 80

/*-----------------------
   2 Global Variables End
-----------------------*/

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
//new 
function harvestDoubleStrip(){
    if(util.checkQuit()){
        return
    }
    //move flush to fence
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //harvest row while strafing right
    util.complexMove(["key.keyboard.d","key.mouse.right"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)

    //move flush to fence
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //harvest row while strafing left
    util.complexMove(["key.keyboard.a","key.mouse.right"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
}

function moveToNextLayer(){
    //at the end of the left side of the row.
    
    //move flush to forward wall
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    
    //move right to return bridge
    util.simpleMove("key.keyboard.w", -90, 0, 8 * 20)
    
    //move back to front of layer
    util.simpleMove("key.keyboard.w", 0, 0, 8 * 20)
    
    //move left to lodestone
    util.simpleMove("key.keyboard.w", 90, 0, 8 * 20)
    
    //jump to next floor
    util.simpleMove("key.keyboard.space",harvestLookX,harvestLookY,10)
}

//called at start of script to set layer in carrot farm
//especially for restarts
function setStartingLayer(){
    playerY = util.player.getY()
    //set layer
    startingLayer = ((playerY - yStartPosition) / layerHeight) + 1
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
        util.tossItems()
    }
    
    //move to the start of the next layer
    moveToNextLayer()
}
    


//Reset keybinds to prevent phantom key holds.
util.resetKeys()

//Log script finish
Chat.log(finishedText)
util.logScriptEnd(farmName, regrowthTime)

/*-------------------
   4 Program End
-------------------*/
