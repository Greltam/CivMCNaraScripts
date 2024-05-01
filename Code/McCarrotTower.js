//Zeal GSEZ Carrot Tower Script
/*
    !!! Script starts at 2977, 5137, 80 !!!
    Find 1.2 Player Configurables to adjust for script restarts

    GSEZ Carrot Tower Script on CivMC @ 2990, 5140, 84
    Written by Greltam 4/30/2024

    Tab-outable.
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Start script while standing on that layers lodestone
//Start with Fortune 3 tool in mainhand(Any, golden forge to get a cheap one)

//Restarting: Stand directly on the current layer's lodestone

//Collector: Lodestone elevator @ 2979, 5140
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

//direction to look when tossing carrots into water collector
tossLookX = 90
tossLookY = -25
/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/

//Player starts script at this location
xStartPosition = 2977 
zStartPosition = 5137
yStartPosition = 80

/*-----------------------
   2 Global Variables End
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

function tossCarrots(){
    //Chat.log("Tossing items")
    util.tossAllSpecificItems(
        ["minecraft:carrot"],
        tossLookX, tossLookY)
}

//called at start of script to set layer in carrot farm
//especially for restarts
function setStartingLayer(){
    playerY = util.player.getY()
    //set layer
    startingLayer = ((playerY - yStartPosition) / layerHeight) + 1
    startingLayer = Math.floor(startingLayer)
    Chat.log("Starting layer = " + startingLayer)
}

/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/

Chat.log("Zeal Carrot Engines Revving Up")
Chat.log("Press: " + util.getQuitKey() + " to end script")

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
        tossCarrots()
    }
    
    //move to the start of the next layer
    moveToNextLayer()
}
    


//Reset keybinds to prevent phantom key holds.
KeyBind.key("key.keyboard.w", false)
KeyBind.key("key.keyboard.a", false)
KeyBind.key("key.keyboard.s", false)
KeyBind.key("key.keyboard.d", false)
KeyBind.key("key.keyboard.left.control", false)
KeyBind.key("key.keyboard.space", false)
KeyBind.key("key.mouse.right", false)
KeyBind.key("key.mouse.left", false)


Chat.log("Praise his name, for he has blessed us with bountiful carrots.")

/*-------------------
   4 Program End
-------------------*/
