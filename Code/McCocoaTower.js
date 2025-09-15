/*------------------------
   0 Title Start
------------------------*/
/*
    Name: Zeal Exclave Cocoa Tower Script
    Location: CivMC @ 4208, 74, 415
    Author: Greltam
    Date: 9/14/2025
    
    Description: A tower full of cocoa!
    
    Directions: 
        Travel down lodestone 
        Flip all glass walkway trapdoors vertical
        Flip entrance wall trapdoor horizontal
        Stand @ 4209, 4, 418 nestled into the trapdoor/ladder
        Activate script
        
    Collector: 
        Go down doorway @ 4205, 5, 427
        Collector room entrance @ 4205, -10, 433
        
*/
/*------------------------
   0 Title End
------------------------*/

/*------------------------
   0.1 Player Requirements Start
------------------------*/
/*
    Pre-Start actions:
        Flip all trapdoors to prevent walkthrough
        Go to collector room and check compactor health
        Repair if necessary and return recipe to compact.
        Remove items if repair keeps stopping.
    Items Required:
        Hold a non-stick anything in hand
    
    Restarting: Nestled in any of the trapdoor/ladders

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
jumpKey = "key.keyboard.space" // default: "key.keyboard.space"
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
jumpKey = config.getString("jumpKey", jumpKey)
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
farmName = "Zeal Exclave Cocoa Tower"
regrowthTime = 24 * 3600 //hours multiplied by seconds per hour
harvestDuration = 120 //minutes to run a full harvest

//Player starts script at this location
xStartPosition = 4208 
zStartPosition = 416
yStartPosition = 4

util.setTossItemList(["minecraft:cocoa_beans"])

//Used for script restarts
towerNumber = 1 //1-4
cocoaBeam = 1 //1-12
midTower = false

totalTowers = 4
beamsPerTower = 12

secondsToClimb = 77 // 45 // + 32 for expansion
secondsToFall = 62 // 36 // + 26 for expansion
/*-----------------------
   2 Global Variables End
-----------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("GSExclave", "dark_red"),
        util.simpleJSONString(" Cocoa", "red"),
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
        util.simpleJSONString("GSExclave", "dark_red"),
        util.simpleJSONString(" Cocoa", "red"),
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

//called at start of script to set position in tree farm
//especially for restarts
function setStartingPosition(){
    playerX = Math.floor(util.player.getX())
    playerY = Math.floor(util.player.getY())
    playerZ = Math.floor(util.player.getZ())
    
    // get Tower Position
    towerNumber = Math.floor((playerZ - zStartPosition) / 16) + 1
    
    playerZOffset = Math.floor(playerZ - zStartPosition)
    playerXOffset = Math.floor(playerX - xStartPosition) 
    towerZOffset = (towerNumber - 1) * 16
    
    //Chat.log("playerZOffset: " + playerZOffset)
    //Chat.log("playerXOffset: " + playerXOffset)
    //Chat.log("towerZOffset: " + towerZOffset)
    //get Cocoa Beam position
    
    //west side of tower
    if(playerX == 4209){
        if(playerZOffset - towerZOffset <= 2 ){
            cocoaBeam = 1
        }
        else if(playerZOffset - towerZOffset <= 5 ){
            cocoaBeam = 2
        }
        else if(playerZOffset - towerZOffset <= 8 ){
            cocoaBeam = 3
        }
    }
    
    //south side of tower
    else if(playerZOffset == towerZOffset + 14 ){
        if (playerXOffset <= 2){
            cocoaBeam = 4
        }
        else if (playerXOffset <= 5){
            cocoaBeam = 5
        }
        else if (playerXOffset <= 8){
            cocoaBeam = 6
        }
    }
    //east side of tower
    else if(playerX == 4222){
        if(playerZOffset - towerZOffset >= 13 ){
            cocoaBeam = 7
        }
        else if(playerZOffset - towerZOffset >= 10 ){
            cocoaBeam = 8
        }
        else if(playerZOffset - towerZOffset >= 7 ){
            cocoaBeam = 9
        }
        
    }
    
    //north side of tower
    else if(playerZOffset == towerZOffset + 1){
        if (playerXOffset >= 13){
            cocoaBeam = 10
        }
        else if (playerXOffset >= 10){
            cocoaBeam = 11
        }
        else if (playerXOffset >= 7){
            cocoaBeam = 12
        }
    }
    
    //check if in midair
    if(playerY != yStartPosition){
        midTower = true
    }
    
    if(towerNumber != 1 || cocoaBeam != 1 || midTower){
        restarting = true
    }
    Chat.log("Tower: " + towerNumber)
    Chat.log("Cocoa Beam: " + cocoaBeam)
    Chat.log("Mid Tower: " + midTower)
    
}

function tossCocoa(xAngle){
    //Chat.log("Tossing items")
    xLook = xAngle - 90
    yLook = 45
    
    util.setTossLookVector([xLook,yLook])
    util.tossItems()
}

function flipTrapdoor(xAngle){
    if(util.checkQuit()){
        return
    }
    util.simpleInteract(xAngle,60)
}

//new harvest type, up harvests 2 columns, down harvests 1 column
function newHarvest(xAngle){
    if(util.checkQuit()){
        return
    }
    util.complexMove([jumpKey,useKey],
        xAngle - 43, 23, secondsToClimb * 20)
        
    util.simpleMove(useKey,xAngle - 86,23,secondsToFall*20)
}

function sideHarvest(xAngle){
    if(util.checkQuit()){
        return
    }
    //don't move forward if already up the ladder
    if(!midTower){
        util.simpleMove(forwardKey,xAngle,0,2*20)
    }
    newHarvest(xAngle)
    flipTrapdoor(xAngle)
       
    util.simpleMove(forwardKey,xAngle,0,2*20)
}

function moveToNextTower(){
    //move to next tower
    //flip trapdoor at end of tower
    flipTrapdoor(90)
    //move out to hallway
    util.simpleMove(forwardKey,90,0,3*20)
    //move to block
    util.simpleMove(forwardKey,0,0,2*20)
    //strafe to wall
    util.simpleMove(leftKey,0,0,1*20)
    //move to next tower
    util.simpleMove(forwardKey,0,0,5*20)
    //move into tower
    util.simpleMove(forwardKey,-90,0,2*20)
    //move into first cocoa beam
    util.simpleMove(forwardKey,0,0,1*20)
    //align to tower wall
    util.simpleMove(rightKey,0,0,1*20)
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
Client.grabMouse()

/*-------------------
   3.9 Pre-Program End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/
setStartingPosition()

//harvest all the towers
for(let i = towerNumber; i <= 4; i++){

    //harvest all the beams
    for(let j = cocoaBeam; j <= 12; j++){
        //west side
        if(j <= 3){
            sideHarvest(0)
            tossCocoa(0)
        }
        //south side
        else if(j <= 6){
            sideHarvest(-90)
            tossCocoa(-90)
        }
        //east side
        else if(j <= 9){
            sideHarvest(180)
            tossCocoa(180)
        }
        //north side
        else if(j <= 12){
            sideHarvest(90)
            tossCocoa(90)
        }
        visual.setText("timeLeft", "Remaining time: " 
                + util.remainingMinutes(
                i,j,totalTowers, beamsPerTower,harvestDuration))
    }
    
    moveToNextTower()

    //reset flags after restarts
    cocoaBeam = 1
    midTower = false
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
