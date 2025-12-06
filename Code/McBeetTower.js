/*------------------------
   0 Title Start
------------------------*/
/*
    Name: Zeal SaTa Beet Tower Script
    Location: CivMC @ 3985, 7460, 103
    Author: Greltam
    Date: 12/4/2025
    
    Description: A tower full of beets!
    
    Directions: 
        Enter building, stand on lodestone @ 3984, 7463, 103
        Hold fortune tool in hand
        Activate farm script.
        
    Collector:     
        Lodestone elevator @ 3982, 7421, 103
        Head South to Obby Box @ y = -61
        Auto-Compactor @ 3981, 7460, -62
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
        Open door to check compactor for health.
        Repair if necessary and return recipe to compact.
        Remove items from compactor if repair is stopping.
        Add 10 stacks of crates
        
    Items Required:
        A fortune 3 tool, I use a golden "harvest" hoe
        Tool held in mainhand
        Not necessary, fortune only increases seed output
        which is used for composting into bonemeal
    
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
farmName = "SaTa Beet Tower"
regrowthTime = 42.5 * 3600 //hours multiplied by seconds per hour
harvestDuration = 360 //minutes to run a full harvest

//Player starts script at this location
xStartPosition = 3984
zStartPosition = 7463
yStartPosition = 103

//set item list and look vector for tossing items into collector
//util.setPassLookBoundary(false)
//Will need to switch between beet and seeds for either side
util.setTossItemList(["minecraft:beetroot","minecraft:beetroot_seeds"])
util.setTossLookVector([90,-25])

//Allows restarting anywhere in the farm
startingLayer = 1 //default: startingLayer = 1
startingRow = 0 //default: startingRow = 1
restarting = false //default: restarting = false

//total layers in the tree farm
totalLayers = 35 //default: totalLayers = 14
potatoesPerRow = 30 //default: potatoesPerRow = 27
rowsPerLayer = 30 //default: rowsPerLayer = 30
layerHeight = 3 //default: layerHeight = 3

//Time it takes to cross sides
//replace after doing hitech stuff
secondsToHarvest = 8 

//direction to look at beets to harvest while strafing
harvestLookX = 0
harvestLookY = 20

/*------------------------
   2 Global Variables End
------------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("SaTa", "yellow"),
        util.simpleJSONString(" Beet", "red"),
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
        util.simpleJSONString("SaTa", "yellow"),
        util.simpleJSONString(" Beet", "red"),
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

function tossBeets(){
    util.setTossItemList(["minecraft:beetroot"])
    util.setTossLookVector([90,-25])
    util.tossItems()
}

function tossSeeds(){
    util.setTossItemList(["minecraft:beetroot_seeds"])
    util.setTossLookVector([-90,-25])
    util.tossItems()
}

function harvestStarterStrip(){
    if(util.checkQuit()){
        return
    }    
    //harvest row while strafing left
    util.complexMove([leftKey,useKey],
        harvestLookX, 28, secondsToHarvest * 20)

    //harvest row while strafing right
    util.complexMove([rightKey,useKey],
        harvestLookX, 20, secondsToHarvest * 21)
}

function harvestOutStrip(){
    if(util.checkQuit()){
        return
    }
    
    //harvest row while strafing left
    util.complexMove([leftKey,useKey],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
    //move flush to fence
    util.simpleMove(forwardKey, harvestLookX, harvestLookY, 1*20)

}
function harvestReturnStrip(){
    if(util.checkQuit()){
        return
    }
    //harvest row while strafing left
    util.complexMove([rightKey,useKey],
        harvestLookX, harvestLookY, secondsToHarvest * 20)
    //move flush to fence
    util.simpleMove(forwardKey, harvestLookX, harvestLookY, 1*20)
}

function moveToNextLayer(){
    //at the end of the left side of the row.
    
    //move flush to forward wall
    util.simpleMove(forwardKey, harvestLookX, harvestLookY, 1*20)
    
    //move left to return bridge
    util.simpleMove(forwardKey, -90, 0, 9 * 20)
    
    //move back to front of layer
    util.simpleMove(forwardKey, 180, 0, 9 * 20)
    
    //move right to lodestone
    util.simpleMove(forwardKey, 90, 0, 9 * 20)
    
    //jump to next floor
    util.simpleMove(lodestoneDownKey,harvestLookX,harvestLookY,10)
}

//called at start of script to set layer in carrot farm
//especially for restarts
function setStartingPosition(){
    playerY = util.player.getY()
    //set layer
    startingLayer = ((yStartPosition - playerY ) / layerHeight) + 1.5
    startingLayer = Math.floor(startingLayer)
    Chat.log("Starting layer = " + startingLayer)
    
    //set row
    startingRow = Math.floor(util.player.getZ() - zStartPosition)
    Chat.log("Starting row = " + startingRow)
    if(startingLayer > 1 || startingRow > 0){
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
visual.fullText("beet","Beets: " 
    + util.getTossedItemAmount("minecraft:beetroot"), 0xff8822,0,16)
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
            if(j % 4 == 3){tossSeeds()}
        }
        else{
            harvestReturnStrip()
            if(j % 6 == 0){tossBeets()}
            
            visual.setText("beet", "Beets: " 
                + util.getTossedItemAmount("minecraft:beetroot"))
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

//For daisy chaining farms together
    GlobalVars.putBoolean("farmComplete", true)
/*-------------------
   4.1 Shutdown End
-------------------*/
