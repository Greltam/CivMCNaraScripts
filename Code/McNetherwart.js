//Zeal Nether Netherwart Tower Script
/*
    !!! Script starts at 2289, 8144, 7 !!!
    Find 1.2 Player Configurables to adjust for script restarts

    Zeal Nether Netherwart Tower Script @ 2289, 8144, 7
    Written by Greltam 5/11/2024

    Tab-outable.
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Start script while standing on that layers lodestone
//Start with Fortune 3 or ST tool in mainhand(Any, golden forge to get a cheap one)

//Restarting: 

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

//alter the default quitkey from j to whatever you want.
util.setQuitKey("key.keyboard.j") //default: util.setQuitKey("key.keyboard.j") 


//Always restart on a lodestone
startingLayer = 1 //default: startingLayer = 1

//total layers in the tree farm
totalLayers = 2 //default: totalLayers = 16
carrotsPerRow = 24 //default: treesPerRow = 24
rowsPerLayer = 24 //default: rowsPerLayer = 24
doubleRows = Math.floor(rowsPerLayer/2)
layerHeight = 4 //default: layerHeight = 3

//Time it takes to cross sides
//replace after doing hitech stuff
secondsToHarvest = 7

//direction to look at netherwart to harvest while strafing
harvestLookX = 180
harvestLookY = 42

//First row we look forward and return same row
firstRowBackupX = 45
firstRowLookX = 90

strafeLeft = "key.keyboard.a"
strafeRight = "key.keyboard.d"



//direction to look when tossing netherwart into water collector
tossLookX = -90
tossLookY = -25
/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
farmName = "Zeal Nether Netherwart"
regrowthTime = 16 * 3600 //hours multiplied by seconds per hour

//Player starts script at this location
xStartPosition = 2289 
zStartPosition = 8144
yStartPosition = 7

cellsPerLayer = 8
/*-----------------------
   2 Global Variables End
-----------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("Zeal", "dark_aqua"),
        util.simpleJSONString(" Netherwart", "red"),
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
        util.simpleJSONString(" Netherwart", "red"),
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

function setEvenLayer(){
harvestLookX = 0
harvestLookY = 42

firstRowBackupX = 135
firstRowLookX = 90

strafeLeft = "key.keyboard.d"
strafeRight = "key.keyboard.a"

}

function setOddLayer(){
harvestLookX = 180
harvestLookY = 42

firstRowBackupX = 45
firstRowLookX = 90

strafeLeft = "key.keyboard.a"
strafeRight = "key.keyboard.d"

}

function harvestCell(){
    if(util.checkQuit()){
        return
    }
    //move flush to start block
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    
    //move back a little to start of first row
    util.complexMove(["key.keyboard.w","key.mouse.right"],
        firstRowBackupX, harvestLookY, 1 * 20)
        
    //harvest first row moving forward
    util.complexMove(["key.keyboard.w","key.mouse.right"],
        firstRowLookX, harvestLookY, secondsToHarvest * 20)
    //harvest second row strafing back
    util.complexMove([strafeRight,"key.mouse.right"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
        
    //move flush to fencing
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //harvest third row
    util.complexMove([strafeLeft,"key.mouse.right"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
        
    //move flush to fencing
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //harvest fourth row
    util.complexMove([strafeRight,"key.mouse.right"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
        
    //move flush to fencing
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //harvest fifth row
    util.complexMove([strafeLeft,"key.mouse.right"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
        
    //move flush to wall
    util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
    //return to collector
    util.complexMove([strafeRight,"key.mouse.right"],
        harvestLookX, harvestLookY, secondsToHarvest * 20)    
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

function tossItems(){
    //Chat.log("Tossing items")
    util.tossAllSpecificItems(
        ["minecraft:nether_wart"],
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

Chat.log(greetingsText)
Chat.log(quitText)
//util.logScriptStart(farmName)

//set starting layer in case restarting on another layer
setStartingLayer()

//harvest all the layers
for(let i = startingLayer; i >= 1; i--){
    if(util.checkQuit()){
        break
    }

    //harvest all the cells
    for(let j = 1; j <= cellsPerLayer; j++){
        if(util.checkQuit()){
            break
        }
        
        if(i%2 == 1){
            setOddLayer()
            harvestCell()
            tossItems()
        }
        else{
            setEvenLayer()
            tossItems()
            harvestCell()
            if(j != cellsPerLayer){ //don't extra move at last spot
                //move flush to start block
                util.simpleMove("key.keyboard.w", harvestLookX, harvestLookY, 1*20)
                util.simpleMove("key.keyboard.w", firstRowBackupX, harvestLookY, 1*20)
                util.simpleMove("key.keyboard.w", tossLookX, harvestLookY, 1*20)
            }
        }
    }

    //move to the start of the next layer
    //moveToNextLayer()
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


Chat.log(finishedText)
//util.logScriptEnd(farmName, regrowthTime)

/*-------------------
   4 Program End
-------------------*/
