//Zeal Nether Twisting Vines Tower Script
/*
    !!! Script starts at 2293, 8144, 31 !!!
    Find 1.2 Player Configurables to adjust for script restarts

    Zeal Nether Twisting Vines Tower Script @ 2292, 8144, 7
    Written by Greltam 5/2/2024

    Tab-outable.
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Start on the layers starting spot
//Layer start: Odd Layer Southmost 2293x, 8144z; Even Layer 2293x, 8098
//Start with Fortune 3 or ST tool in mainhand(Any, golden forge to get a cheap one)

//Restarting: Start on the layers starting spot

//Collector: 
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
util.setTossItemList(["minecraft:twisting_vines"])
util.setTossLookVector([90,0])

//alter the default quitkey from j to whatever you want.
util.setQuitKey("key.keyboard.j") //default: util.setQuitKey("key.keyboard.j") 


//Always restart on a lodestone
startingLayer = 1 //default: startingLayer = 1

//total layers in the tree farm
totalLayers = 1 //default: totalLayers = 16
carrotsPerRow = 24 //default: treesPerRow = 24
rowsPerLayer = 24 //default: rowsPerLayer = 24
doubleRows = Math.floor(rowsPerLayer/2)
layerHeight = 12 //default: layerHeight = 3

//Time it takes to cross sides
//replace after doing hitech stuff
secondsToHarvest = 14

//direction to look at carrots to harvest while strafing
harvestLookX = 180
harvestLookY = 0
/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
farmName = "Zeal Nether Twisting Vines"
//Normally 12 hours full full growth but cells are 1/2 height
regrowthTime = 6 * 3600 //hours multiplied by seconds per hour

//Player starts script at this location
xStartPosition = 2292 
zStartPosition = 8144
yStartPosition = 7

twistingCells = 8
/*-----------------------
   2 Global Variables End
-----------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("Zeal", "dark_aqua"),
        util.simpleJSONString(" Twisting Vines", "aqua"),
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
        util.simpleJSONString("Zeal", "dark_aqua"),
        util.simpleJSONString(" Twisting Vines", "aqua"),
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
//
function harvestOddCell(){
    harvestLookX = 180
    harvestLookY = 0
    if(util.checkQuit()){
        return
    }
    //move flush to start block
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    
    //break vines while strafing right
    util.complexMove(["key.keyboard.d","key.mouse.left"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
    //break vines moving back to start while strafing left
    util.complexMove(["key.keyboard.a","key.mouse.left"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)

    //move up to second row
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //collect second row
    util.simpleMove("key.keyboard.d",
        harvestLookX, harvestLookY, (secondsToHarvest + 2) * 20)
    //move up to third row
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //collect third row
    util.simpleMove("key.keyboard.a", harvestLookX, harvestLookY, secondsToHarvest * 20)
    //open door if server bugs
    util.simpleMove("key.mouse.right", harvestLookX, harvestLookY, 5)
    }
//
function harvestEvenCell(){
    harvestLookX = 0
    harvestLookY = 0
    if(util.checkQuit()){
        return
    }
    //move flush to start block
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    
    //break vines while strafing left
    util.complexMove(["key.keyboard.a","key.mouse.left"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
    //break vines moving back to start while strafing left
    util.complexMove(["key.keyboard.d","key.mouse.left"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
    //move flush to start block
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)

    //move up to second row
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //collect second row
    util.simpleMove("key.keyboard.a",
        harvestLookX, harvestLookY, (secondsToHarvest + 2) * 20)
    //move up to third row
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //collect third row
    util.simpleMove("key.keyboard.d", harvestLookX, harvestLookY, secondsToHarvest * 20)
    //open door if server bugs
    util.simpleMove("key.mouse.right", harvestLookX, harvestLookY, 5)
    //move flush to start block
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
}
function moveToNextLayer(){
    //at the end of the left side of the row.
    
    //move flush to forward wall
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    
    //move left to return bridge
    util.simpleMove("key.keyboard.w", -90, 0, 8 * 20)
    
    //move back to front of layer
    util.simpleMove("key.keyboard.w", 180, 0, 8 * 20)
    
    //move right to lodestone
    util.simpleMove("key.keyboard.w", 90, 0, 8 * 20)
    
    //jump to next floor
    util.simpleMove("key.keyboard.left.shift",harvestLookX,harvestLookY,10)
}

//called at start of script to set layer in carrot farm
//especially for restarts
function setStartingLayer(){
    playerY = util.player.getY()
    //set layer
    startingLayer = (( playerY - yStartPosition) / layerHeight) + 1
    startingLayer = Math.floor(startingLayer)
    Chat.log("Starting layer = " + startingLayer)
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
for(let i = startingLayer; i >= 1; i--){
    if(util.checkQuit()){
        break
    }

    //harvest all the double rows
    for(let j = 1; j <= twistingCells; j++){
        if(util.checkQuit()){
            break
        }
        if(i % 2 == 1){
            harvestOddCell()
            util.tossItems()
        }
        else{
            util.tossItems()
            harvestEvenCell()
        }
    }

    //move to the start of the next layer
    //moveToNextLayer()
}

//Reset keybinds to prevent phantom key holds.
util.resetKeys()

Chat.log(finishedText)
util.logScriptEnd(farmName, regrowthTime)

/*-------------------
   4 Program End
-------------------*/
