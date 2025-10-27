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
    
    Restarting:
        Aligned on top of the trapdoor of 
        the current side to harvest

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
xStartPosition = 4211
zStartPosition = 419
yStartPosition = 183

util.setTossItemList(["minecraft:cocoa_beans"])

//Used for script restarts
towerNumber = 1 //1-4

cocoaBeam = 1 //1-12

northDone = false
southDone = false
eastDone = false
westDone = false

midTower = false
restarting = false

totalTowers = 4
beamsPerTower = 12

secondsToHarvest = 35
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
function insideOf(x1,z1,x2,z2,x,z){

    if(x >= x1 &&
       x <= x2 &&
       z >= z1 &&
       z <= z2){
       
       return true
    }

    return false
}
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
    relXPos = playerXOffset
    relZPos = playerZOffset - towerZOffset
    
    if(insideOf(-1,-1,1,1,relXPos,relZPos)){
        cocoaBeam = 1
        if(relXPos == 1){
            northDone = true
        }
        if(relZPos == 1){
            northDone = true
            eastDone = true
        }
        if(relXPos == -1){
            northDone = true
            eastDone = true
            southDone = true
        }
    }
    else if(insideOf(-1,2,1,4,relXPos,relZPos)){
        cocoaBeam = 2
        if(relXPos == 1){
            northDone = true
        }
        if(relZPos == 4){
            northDone = true
            eastDone = true
        }
        if(relXPos == -1){
            northDone = true
            eastDone = true
            southDone = true
        }
    }
    else if(insideOf(-1,5,1,7,relXPos,relZPos)){
        cocoaBeam = 3
        if(relXPos == 1){
            northDone = true
        }
        if(relZPos == 7){
            northDone = true
            eastDone = true
        }
        if(relXPos == -1){
            northDone = true
            eastDone = true
            southDone = true
        }
    }
    else if(insideOf(-1,8,1,10,relXPos,relZPos)){
        cocoaBeam = 4
        if(relXPos == 1){
            northDone = true
        }
        if(relZPos == 10){
            northDone = true
            eastDone = true
        }
        if(relXPos == -1){
            northDone = true
            eastDone = true
            southDone = true
        }
    }
    else if(insideOf(2,8,4,10,relXPos,relZPos)){
        cocoaBeam = 5
        if(relXPos == 4){
            northDone = true
        }
        if(relZPos == 10){
            northDone = true
            eastDone = true
        }
        if(relXPos == 2){
            northDone = true
            eastDone = true
            southDone = true
        }
    }
    else if(insideOf(5,8,7,10,relXPos,relZPos)){
        cocoaBeam = 6
        if(relXPos == 7){
            northDone = true
        }
        if(relZPos == 10){
            northDone = true
            eastDone = true
        }
        if(relXPos == 5){
            northDone = true
            eastDone = true
            southDone = true
        }
    }
    else if(insideOf(8,8,10,10,relXPos,relZPos)){
        cocoaBeam = 7
        if(relXPos == 10){
            northDone = true
        }
        if(relZPos == 10){
            northDone = true
            eastDone = true
        }
        if(relXPos == 8){
            northDone = true
            eastDone = true
            southDone = true
        }
    }
    else if(insideOf(8,5,10,7,relXPos,relZPos)){
        cocoaBeam = 8
        if(relXPos == 10){
            northDone = true
        }
        if(relZPos == 7){
            northDone = true
            eastDone = true
        }
        if(relXPos == 8){
            northDone = true
            eastDone = true
            southDone = true
        }
    }
    else if(insideOf(8,2,10,4,relXPos,relZPos)){
        cocoaBeam = 9
        if(relXPos == 10){
            northDone = true
        }
        if(relZPos == 4){
            northDone = true
            eastDone = true
        }
        if(relXPos == 8){
            northDone = true
            eastDone = true
            southDone = true
        }
    }
    else if(insideOf(8,-1,10,1,relXPos,relZPos)){
        cocoaBeam = 10
        if(relXPos == 10){
            northDone = true
        }
        if(relZPos == 1){
            northDone = true
            eastDone = true
        }
        if(relXPos == 8){
            northDone = true
            eastDone = true
            southDone = true
        }
    }
    else if(insideOf(5,-1,7,1,relXPos,relZPos)){
        cocoaBeam = 11
        if(relXPos == 7){
            northDone = true
        }
        if(relZPos == 1){
            northDone = true
            eastDone = true
        }
        if(relXPos == 5){
            northDone = true
            eastDone = true
            southDone = true
        }
    }
    else if(insideOf(2,-1,4,1,relXPos,relZPos)){
        cocoaBeam = 12
        if(relXPos == 4){
            northDone = true
        }
        if(relZPos == 1){
            northDone = true
            eastDone = true
        }
        if(relXPos == 2){
            northDone = true
            eastDone = true
            southDone = true
        }
    }
    
    
    //cocoaBeam = GlobalVars.getInt("cocoaBeam")
    
    //check if in midair
    if(playerY != yStartPosition){
        midTower = true
    }
    
    if(towerNumber != 1 || cocoaBeam != 1 || midTower
        || northDone){
        restarting = true
    }
    Chat.log("Tower: " + towerNumber)
    Chat.log("Cocoa Beam: " + cocoaBeam)
    Chat.log("Mid Tower: " + midTower)
    Chat.log("North Done: " + northDone)
    Chat.log("East Done: " + eastDone)
    Chat.log("South Done: " + southDone)
    Chat.log("West Done: " + westDone)
}

function tossCocoa(beamNumber){
    if(util.checkQuit()){return}
    //Chat.log("Tossing items")
    xLook = -45
    yLook = 22
    
    if(beamNumber == 1 || beamNumber == 2 || beamNumber == 12){
        xLook = -45
    }
    if(beamNumber == 3 || beamNumber == 4 || beamNumber == 5){
        xLook = -135
    }
    if(beamNumber == 6 || beamNumber == 7 || beamNumber == 8){
        xLook = 135
    }
    if(beamNumber == 9 || beamNumber == 10 || beamNumber == 11){
        xLook = 45
    }
    
    util.setTossLookVector([xLook,yLook])
    util.tossItems()
}

//alignment functions to check for needing to flip trapdoors
//at the top of the cocoa tower to align between cocoa beams
function alignWest(beamNumber){
    if(beamNumber == 5 || beamNumber == 6 || beamNumber == 7 ||
       beamNumber == 10 || beamNumber == 11 || beamNumber == 12){
        return true
    }
    return false
}
function alignEast(beamNumber){
    if(beamNumber == 1 || beamNumber == 4 || beamNumber == 5 ||
       beamNumber == 6 || beamNumber == 11 || beamNumber == 12){
        return true
    }
    return false
}
function alignNorth(beamNumber){
    if(beamNumber == 2 || beamNumber == 3 || beamNumber == 4 ||
       beamNumber == 7 || beamNumber == 8 || beamNumber == 9){
        return true
    }
    return false
}
function alignSouth(beamNumber){
    if(beamNumber == 1 || beamNumber == 2 || beamNumber == 3 ||
       beamNumber == 8 || beamNumber == 9 || beamNumber == 10){
        return true
    }
    return false
}

function moveIntoAlignment(xAngle){
    util.smoothLookAt(xAngle,-5)           //look at the overhead trapdoor
    util.simpleMove(useKey,xAngle,-5,2)    //lower trapdoor to block body
    util.simpleMove(forwardKey,xAngle,0,20)//move into trapdoor
    util.simpleMove(useKey,xAngle,0,10)    //raise trapdoor back up
}

//starting from the lodestone at the top, move into cocoa stack
//harvest, and then lodestone back up
function harvestNorth(beamNumber){
    if(util.checkQuit()){return}
    Chat.log("Harvesting north")

    if(midTower == false && !restarting){
        if(alignNorth(beamNumber)){
            moveIntoAlignment(180)
        }
        else{
            util.simpleMove(forwardKey,180,0,20)
        }
    }
    restarting = false
    midTower = false
    
    //flip trapdoor to go into cocoa
    util.simpleMove(useKey,0,80,secondsToHarvest * 20)
    while(Player.getPlayer().getY() > 4){
        if(util.checkQuit()){break}
        util.simpleMove(useKey,0,80, 1 * 20)
    }
        
    //move into lower lodestone elevator
    util.simpleMove(forwardKey,0,0,20)
    //use elevator back up to the top
    util.simpleMove(lodestoneUpKey,0,0,20)
}
function harvestSouth(beamNumber){
    if(util.checkQuit()){return}
    Chat.log("Harvesting south")
    
    if(midTower == false && !restarting){
        if(alignSouth(beamNumber)){
            moveIntoAlignment(0)
        }
        else{
            util.simpleMove(forwardKey,0,0,20)
        }
    }
    restarting = false
    midTower = false
    
    //flip trapdoor to go into cocoa
    util.simpleMove(useKey,-180,80,secondsToHarvest * 20)
    while(Player.getPlayer().getY() > 4){
        if(util.checkQuit()){break}
        util.simpleMove(useKey,-180,80, 1 * 20)
    }
        
    //move into lower lodestone elevator
    util.simpleMove(forwardKey,-180,0,20)
    //use elevator back up to the top
    util.simpleMove(lodestoneUpKey,-180,0,20)
}
function harvestEast(beamNumber){
    if(util.checkQuit()){return}
    Chat.log("Harvesting east")
    
    if(midTower == false && !restarting){
        if(alignEast(beamNumber)){
            moveIntoAlignment(-90)
        }
        else{
            util.simpleMove(forwardKey,-90,0,20)
        }
    }
    restarting = false
    midTower = false
    
    //flip trapdoor to go into cocoa
    util.simpleMove(useKey,90,80,secondsToHarvest * 20)
    while(Player.getPlayer().getY() > 4){
        if(util.checkQuit()){break}
        util.simpleMove(useKey,90,80, 1 * 20)
    }
    //move into lower lodestone elevator
    util.simpleMove(forwardKey,90,0,20)
    //use elevator back up to the top
    util.simpleMove(lodestoneUpKey,90,0,20)
}
function harvestWest(beamNumber){
    if(util.checkQuit()){return}
    Chat.log("Harvesting west")
    
    if(midTower == false && !restarting){
        if(alignWest(beamNumber)){
            moveIntoAlignment(90)
        }
        else{
            util.simpleMove(forwardKey,90,0,20)
        }
    }
    restarting = false
    midTower = false
    
    //flip trapdoor to go into cocoa
    util.simpleMove(useKey,-90,80,secondsToHarvest * 20)
    while(Player.getPlayer().getY() > 4){
        if(util.checkQuit()){break}
        util.simpleMove(useKey,-90,80, 1 * 20)
    }
    
    //move into lower lodestone elevator
    util.simpleMove(forwardKey,-90,0,20)
    //use elevator back up to the top
    util.simpleMove(lodestoneUpKey,-90,0,20)
}

//
function harvestBeam(beamNumber){
    if(util.checkQuit()){return}
    //useful for restarting
    GlobalVars.putInt("cocoaBeam",Number(beamNumber))
    
    if(northDone){ Chat.log("Already did north")
    }else{ harvestNorth(beamNumber)}
    
    if(eastDone){ Chat.log("Already did east")
    }else{ harvestEast(beamNumber)}
    
    if(southDone){ Chat.log("Already did south")
    }else{ harvestSouth(beamNumber)}
    
    if(westDone){ Chat.log("Already did west")
    }else{ harvestWest(beamNumber)}
    
    //Currently at the top of the beam
    //use button on lodestone
    //to reset the important trapdoor to get to next tower
    util.simpleMove(useKey,90,90,4)
    northDone = false
    southDone = false
    eastDone = false
    westDone = false

}

function moveToNextBeam(towerNumber,beamNumber){
    if(util.checkQuit()){return}
    //default starting position
    xDestination = 4211
    zDestination = 419
    yDestination = 183
    tolerance = 0.3
    
    //give offsets for each beam
    if(beamNumber == 1){
        xDestination = xDestination + 0
        zDestination = zDestination + 0
    }
    if(beamNumber == 2){
        zDestination = zDestination + 3
    }
    if(beamNumber == 3){
        zDestination = zDestination + 6
    }
    if(beamNumber == 4){
        zDestination = zDestination + 9
    }
    if(beamNumber == 5){
        xDestination = xDestination + 3
        zDestination = zDestination + 9
    }
    if(beamNumber == 6){
        xDestination = xDestination + 6
        zDestination = zDestination + 9
    }
    if(beamNumber == 7){
        xDestination = xDestination + 9
        zDestination = zDestination + 9
    }
    if(beamNumber == 8){
        xDestination = xDestination + 9
        zDestination = zDestination + 6
    }
    if(beamNumber == 9){
        xDestination = xDestination + 9
        zDestination = zDestination + 3
    }
    if(beamNumber == 10){
        xDestination = xDestination + 9
    }
    if(beamNumber == 11){
        xDestination = xDestination + 6
    }
    if(beamNumber == 12){
        xDestination = xDestination + 3
    }
    if(beamNumber == 13){
        //end of the tower, don't move, let another
        //function go to next tower
        return
    }
    
    //add z offset for subsequent towers
    zDestination = zDestination + ((towerNumber - 1) * 16)
    

    util.complexMoveToLocation([],
        xDestination, 
        zDestination, 
        yDestination, tolerance)
}
function moveToNextTower(){
    //travel west
    util.complexMove([forwardKey,jumpKey],0,0,8*20)
    //move north to trapdoor at start of next tower
    util.simpleMove(forwardKey,90,0,3*20)
    //flip trapdoor to fall down
    util.simpleMove(useKey,90,90,4)
    //reset trapdoor for next run
    util.simpleMove(useKey,-90,-50,4)
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

/*-------------------
   3.9 Pre-Program End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/
setStartingPosition()

//harvest all the towers
for(let i = towerNumber; i <= 4; i++){
    if(util.checkQuit()){break}
    Chat.log("Tower #" + i)

    //harvest all the beams
    for(let j = cocoaBeam; j <= 12; j++){
        if(util.checkQuit()){break}
        Chat.log("CocoaBeam #" + j)
        
        //harvest the beam
        harvestBeam(j)
        tossCocoa(j)
        //eat food if hungry
        util.checkHunger()
        
        //move to next beam
        moveToNextBeam(i,j+1)
        
        /*visual.setText("timeLeft", "Remaining time: " 
                + util.remainingMinutes(
                i,j,totalTowers, beamsPerTower,harvestDuration))*/
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
