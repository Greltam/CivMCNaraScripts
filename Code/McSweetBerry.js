//Zeal SaTa Sweet Berry Tower Script
/*
    !!! Script starts at 3980, 7427, 106 !!!
    Find 1.2 Player Configurables to adjust for script restarts

    Zeal SaTa Sweet Berry Tower Script on CivMC @ 3980, 7420, 106
    Written by Greltam 4/16/2025

    Tab-outable.
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Start script while standing on that layers lodestone
//Hold something in hands such as a fortune hoe to prevent sitting
//(fortune does not affect berries) 

//Restarting: Stand directly on the current layer's lodestone

//Collector: Lodestone elevator @ 3982, 7421, 103
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
util.setTossItemList(["minecraft:sweet_berries"])
util.setTossLookVector([-90,0])

//alter the default quitkey from j to whatever you want.
util.setQuitKey("key.keyboard.j") //default: util.setQuitKey("key.keyboard.j") 


//Always restart on a lodestone
startingLayer = 1 //default: startingLayer = 1

//total layers in the tree farm
totalLayers = 54 //default: totalLayers = 14
carrotsPerRow = 25 //default: treesPerRow = 27
rowsPerLayer = 14 //default: rowsPerLayer = 30
doubleRows = Math.floor(rowsPerLayer/2)
layerHeight = 3 //default: layerHeight = 3

//Time it takes to cross sides
//replace after doing hitech stuff
secondsToHarvest = 7 //or 8

//direction to look at carrots to harvest while strafing
harvestLookX = 82
harvestLookY = 27
/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
farmName = "SaTa Sweet Berry Tower"
regrowthTime = 29 * 3600 //hours multiplied by seconds per hour

//Player starts script at this location
xStartPosition = 3980 
zStartPosition = 7427
yStartPosition = 106

/*-----------------------
   2 Global Variables End
-----------------------*/

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
//new 
function harvestDoubleStrip(){
    if(util.checkQuit()){
        return
    }
    //move flush to fence
    //util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //harvest row while strafing right
    util.complexMove(["key.keyboard.w","key.mouse.right"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)

    
    //move to next row
    util.simpleMove("key.keyboard.w", 0, 0, 1*20)

    //move flush to fence
    //util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //harvest row while strafing left
    util.complexMove(["key.keyboard.w","key.mouse.right"],
        -harvestLookX, harvestLookY, secondsToHarvest * 20)
}

function moveToNextLayer(){
    //at the end of the left side of the row.
    
    //move flush to the stairs
    util.simpleMove("key.keyboard.w", -45, 0, 1*20)
    
    //walk to the lodestone
    util.simpleMove("key.keyboard.w", -180, 0, 7*20)
        
    //crouch to next floor
    util.simpleMove("key.keyboard.left.shift",-180,0,10)
    
    //move off the lodestone onto the floor
    util.simpleMove("key.keyboard.w", 90, 0, 10)
}

//called at start of script to set layer in carrot farm
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
        util.tossItems()
        //move to next row
        util.simpleMove("key.keyboard.w", 0, 0, 1*20)
        
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
