/*------------------------
   0 Title Start
------------------------*/
/*
    Name: Zeal Nether Twisting Vines Tower Script
    Location: CivMC @ 2285, 8113, 2
    Author: Greltam
    Date: 9/13/2025
    
    Description: A tower full of twisting vines!
    
    Directions: 
        Use lodestone @ 2285, 8113, 2
        Go down trapdoor @ 2290, 8100, 79 to y67
        Stand in well @ 2293, 8098, 67
        Hold Fortune 3 or ST hoe, picks will destroy the farm
        Activate farm script.
        
    Collector: Auto-Compactor at 2289, 8117, 2
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
        Repair if necessary and return recipe to compact.
        Remove items from compactor if repair is stopping.
        
    Items Required:
        A fortune 3 or ST tool, I use a golden "harvest" hoe
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
farmName = "Zeal Nether Twisting Vines"
//Normally 12 hours full full growth but cells are 1/2 height
regrowthTime = 6 * 3600 //hours multiplied by seconds per hour
harvestDuration = 60 //minutes to run a full harvest

//Player starts script at this location
xStartPosition = 2293
zStartPosition = 8098
yStartPosition = 67


//Script likes to get kicked for 180 -> -180 looking
//tell utility not to cross boundary and do full spins
//smoothly to not get kicked
util.setPassLookBoundary(false)
util.setTossItemList(["minecraft:twisting_vines"])
util.setTossLookVector([90,0])


//Allows restarting anywhere in the farm
startingLayer = 1 //default: startingLayer = 1
startingCell = 1 //default: startingCell = 1
startingRow = 1 //default: startingRow = 1
restarting = false //default: restarting = false

//total layers in the tree farm
totalLayers = 6 //default: totalLayers = 6
vinesPerRow = 24 //default: treesPerRow = 24
cellsPerLayer = 8 //default: rowsPerLayer = 24
cellWidth = 6 //default: rowsPerLayer = 6
rowsPerCell = 6
layerHeight = 12 //default: layerHeight = 3

//Time it takes to cross sides
//replace after doing hitech stuff
secondsToHarvest = 14

//direction to look at carrots to harvest while strafing
harvestLookX = 180
harvestLookY = 0
/*------------------------
   2 Global Variables End
------------------------*/

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

function harvestEvenCell(rowStart){
    if(util.checkQuit()){
        return
    }
    
    harvestLookX = 180
    harvestLookY = 0
    if(rowStart <= 1){
        //break vines while strafing right
        util.complexMove([rightKey,attackKey],
            harvestLookX, harvestLookY, secondsToHarvest * 20)
        //break vines moving back to start while strafing left
        util.complexMove([leftKey,attackKey],
            harvestLookX, harvestLookY, secondsToHarvest * 20)
    }
    if(rowStart <= 2){
        //move up to second row
        util.simpleMove(forwardKey, 
            harvestLookX, harvestLookY, 1*20)
    }
    if(rowStart <= 3){
        //collect second row
        util.simpleMove(rightKey,
            harvestLookX, harvestLookY, (secondsToHarvest + 2) * 20)
    }
    if(rowStart <= 4){        
        //move up to third row
        util.simpleMove(forwardKey,
            harvestLookX, harvestLookY, 1*20)
    }
    if(rowStart <= 5){
        //collect third row    
        util.simpleMove(leftKey, 
            harvestLookX, harvestLookY, secondsToHarvest * 20)
    }
    
    if(rowStart <= 6){
        
        util.tossItems()
        visual.setText("vines", "Vines: "
            + util.getTossedItemAmount("minecraft:twisting_vines"))
        //open door if server bugs
        util.simpleMove(useKey, 
            harvestLookX, harvestLookY, 5)
        //move flush to start block
        util.simpleMove(forwardKey,
         harvestLookX, harvestLookY, 1*20)
    }
}

function harvestOddCell(rowStart){
    if(util.checkQuit()){
        return
    }
    
    harvestLookX = 0
    harvestLookY = 0
    if(rowStart <= 1){
        util.tossItems()
        visual.setText("vines", "Vines: "
            + util.getTossedItemAmount("minecraft:twisting_vines"))
        //break vines while strafing left
        util.complexMove([leftKey,attackKey],
            harvestLookX, harvestLookY, secondsToHarvest * 20)
        //break vines moving back to start while strafing left
        util.complexMove([rightKey,attackKey],
            harvestLookX, harvestLookY, secondsToHarvest * 20)
    }
    if(rowStart <= 2){
        //move flush to start block
        util.simpleMove(forwardKey, 
            harvestLookX, harvestLookY, 1*20)
    
    }
    if(rowStart <= 3){ 
        util.simpleMove(leftKey,
            harvestLookX, harvestLookY, (secondsToHarvest + 2) * 20)
    }
    if(rowStart <= 4){
        //move up to third row
        util.simpleMove(forwardKey, harvestLookX, harvestLookY, 1*20)
    }
    if(rowStart <= 5){ 
        //collect third row
        util.simpleMove(rightKey, 
        harvestLookX, harvestLookY, secondsToHarvest * 20)
    }
    if(rowStart <= 6){
        //open door if server bugs
        util.simpleMove(useKey, 
        harvestLookX, harvestLookY, 5)
        //move flush to start block
        util.simpleMove(forwardKey, 
        harvestLookX, harvestLookY, 1*20)
    }
}

//called at start of script to set layer in carrot farm
//especially for restarts
function setStartingPosition(){
    //set layer
    startingLayer = Math.floor(
                        ((yStartPosition - util.player.getY())
                        / layerHeight) + 1.5)    
    
    //set cell
    if(startingLayer % 2 == 1){
        startingCell = Math.floor(
            (util.player.getZ() - zStartPosition)/cellWidth) + 1
    }
    else{
        startingCell = Math.floor(
            ((zStartPosition + cellWidth*cellsPerLayer) 
                - util.player.getZ())
                / cellWidth) + 1
    }
    
    //set row
    if(startingLayer % 2 == 1){
        zOffset = Math.floor(util.player.getZ() - zStartPosition)
        startingRow = (zOffset % 6) + 1
    }
    else{
        zOffset = Math.floor(
            (zStartPosition + cellWidth*cellsPerLayer) 
                - util.player.getZ())
        startingRow = (zOffset % 6)
    }
    
    Chat.log("Starting layer = " + startingLayer)
    Chat.log("Starting cell = " + startingCell)
    Chat.log("Starting row = " + startingRow)
    
    if(startingLayer > 1 || startingCell > 1 || startingRow > 1){
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
visual.fullText("vines","Vines: " 
    + util.getTossedItemAmount("minecraft:twisting_vines"), 0xff4444,0,16)
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

//protect from tabbed out dysfunction
try{
    Client.grabMouse()
}catch(error){
    Chat.log("Could not grab mouse.")
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
    
    //harvest all the cells
    for(let j = startingCell; j <= cellsPerLayer; j++){
        if(util.checkQuit()){
            break
        }
        
        if(i % 2 == 1){
            harvestOddCell(startingRow)
        }
        else{ 
            harvestEvenCell(startingRow)            
        }
        
        visual.setText("timeLeft", "Remaining time: " 
                + util.remainingMinutes(
                i,j,totalLayers, cellsPerLayer,harvestDuration))
                
        //if restarting, set restart to false and change 
        //starting back to defaults
        if(restarting){
            restarting = false
            startingCell = 1
            startingRow = 1
        }
    }//done harvesting all the cells
    
    //Onto next layer    
    util.checkHunger() //eat food if hungry
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
    if(GlobalVars.getBoolean("daisyGNC")){
        //don't logout actually. need to run next farm of daisy chain
    }
    else{
        GlobalVars.putBoolean("delayFarm", false)
        GlobalVars.putBoolean("killsnitch", true)
        Chat.say("/logout")
    }
}

//For daisy chaining farms together
    GlobalVars.putBoolean("farmComplete", true)
/*-------------------
   4.1 Shutdown End
-------------------*/
