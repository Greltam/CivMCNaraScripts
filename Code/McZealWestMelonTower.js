//Zeal River Savannah Melon script
/*
    !!! Script starts at 3987, 7374, 104 !!!
    Find 1.2 Player Configurables to adjust for script restarts

    Savanna Melon Tower Script on CivMC @ 2958, 5202, 67
    Written by Greltam 4/9/2024

    Tab-outable.
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Start script while standing on that layers lodestone
//Start with Axe in mainhand
//Add 1-2 extra axes in inventory, script will replace at 10 durability.

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
util.setTossItemList(["minecraft:melon", "minecraft:melon_slice"])
util.setTossLookVector([-90,-30])

//alter the default quitkey from j to whatever you want.
util.setQuitKey("key.keyboard.j") //default: util.setQuitKey("key.keyboard.j") 
//In case of needing to restart mid melon chop
//Always restart on a lodestone
//UNUSED //restarting = false //default: restarting = false
startingLayer = 1 //default: startingLayer = 1

//total layers in the tree farm
totalLayers = 54 //default: totalLayers = 54
melonsPerRow = 28 //default: treesPerRow = 28
rowsPerLayer = 6 //default: rowsPerLayer = 16
layerHeight = 3 //default: layerHeight = 12
rowWidth = 5 //default: rowWidth = 5 //space between start of a sides row and next row
endLengths = 5 //default: treeBridgeLength = 5


//UNUSED //usingST = true
/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
farmName = "SaTa Zeal West Melon Tower"
regrowthTime = 18.5 * 3600 //hours multiplied by seconds per hour

//Player starts script at this location
xStartPosition = 3987 
zStartPosition = 7374
yStartPosition = 104


//Time it takes for e5 diamond axe to cross sides
//replace after doing hitech stuff
secondsToHarvest = 9

/*-----------------------
   2 Global Variables End
-----------------------*/

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

function harvestDoubleStrip(){
    if(util.checkQuit()){
        return
    }
    util.simpleMove("key.keyboard.a",90,0,2*20)
    util.complexMove(["key.keyboard.w","key.mouse.left"],90,27,secondsToHarvest * 20)

    
    util.simpleMove("key.keyboard.d",-90,0,2*20)
    util.complexMove(["key.keyboard.w","key.mouse.left"],-90,27,secondsToHarvest * 20)
}

function harvestLayer(){
    if(util.checkQuit()){
        return
    }
    harvestDoubleStrip()
    harvestDoubleStrip()
    harvestDoubleStrip()
    util.simpleMove("key.keyboard.d",90,0,5*20)
    util.simpleMove("key.keyboard.s",90,0,2*20)
}

function moveToNextLayer(){
    util.simpleMove("key.keyboard.left.shift",90,0,20)
}

//called at start of script to set position in tree farm
//especially for restarts
function setStartingLayer(){
    playerY = util.player.getY()
    //set layer
    startingLayer = ((yStartPosition - playerY) / layerHeight) + 1
    startingLayer = Math.floor(startingLayer)
    //Chat.log("starting layer = " + startingLayer)
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

//set starting layer if restarting on another layer
setStartingLayer()

//chop all the layers
for(let i = startingLayer; i <= totalLayers; i++){
    if(util.checkQuit()){
        break
    }
    harvestLayer()
    util.tossItems()
    moveToNextLayer()
    util.checkHunger()
}
    


//Reset keybinds to prevent phantom key holds.
util.resetKeys()

Chat.log(finishedText)
util.logScriptEnd(farmName, regrowthTime)
/*-------------------
   4 Program End
-------------------*/
