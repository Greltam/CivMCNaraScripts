//Zeal Exclave Cocoa Tower Script
/*
    !!! Script starts at 4209, 4, 418 !!!
    Find 1.2 Player Configurables to adjust for script restarts

    Zeal Exclave Cocoa Tower on CivMC @ 4208, 74, 415
    Written by Greltam 5/2/2024
    Updated by Greltam 5/30/2025
    Tab-outable.
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Open trapdoors for each cocoa tower. They should block you
//    from walking forward on the glass panes
//Cocoa is not affected by fortune, so hold anything aside from the stick
//Restarting: butt yourself up into the corner between the trapdoor
//    and ladder next to the cocoa beam/tower

//Collector: Door in the hallway at 4205, 427, 5
//    Main compactor room door at 4205, 443, -10
//
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
//util.setTossItemList(["minecraft:potato","minecraft:poisonous_potato"])
//util.setTossLookVector([90,-25])

//alter the default quitkey from j to whatever you want.
util.setQuitKey("key.keyboard.j") //default: util.setQuitKey("key.keyboard.j") 


secondsToClimb = 77 // 45 // + 32 for expansion
secondsToFall = 62 // 36 // + 26 for expansion
/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
farmName = "Zeal Exclave Cocoa Tower"
regrowthTime = 24 * 3600 //hours multiplied by seconds per hour

//Player starts script at this location
xStartPosition = 4208 
zStartPosition = 416
yStartPosition = 4

//Used for script restarts
towerNumber = 1 //1-4
cocoaBeam = 1 //1-12

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
    
    if(towerNumber != 1 || cocoaBeam != 1){
        restarting = true
    }
    Chat.log("Tower: " + towerNumber)
    Chat.log("Cocoa beam: " + cocoaBeam)
    
}

function flipTrapdoor(xAngle){
    if(util.checkQuit()){
        return
    }
    util.simpleInteract(xAngle,30)
}

//new harvest type, up harvests 2 columns, down harvests 1 column
function newHarvest(xAngle){
    if(util.checkQuit()){
        return
    }
    util.startUse()
    util.simpleMove("key.keyboard.space",
        xAngle - 47,23,secondsToClimb*20)
    util.endUse()
    
    util.startUse()
    util.simpleMove("",xAngle - 90,23,secondsToFall*20)
    util.endUse()
}


function sideHarvest(xAngle){
    if(util.checkQuit()){
        return
    }
    util.simpleMove("key.keyboard.w",xAngle,0,2*20)
    newHarvest(xAngle)
    flipTrapdoor(xAngle)
       
    util.simpleMove("key.keyboard.w",xAngle,0,2*20)
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

setStartingPosition()

//chop all the towers
for(let i = towerNumber; i <= 4; i++){
    for(let j = cocoaBeam; j <= 12; j++){
        if(j <= 3){
            sideHarvest(0)
        }
        else if(j <= 6){
            sideHarvest(-90)            
        }
        else if(j <= 9){
            sideHarvest(180)        
        }
        else if(j <= 12){
            sideHarvest(90)        
        }
    }
    //move to next tower
    //flip trapdoor at end of tower
    flipTrapdoor(90)
    //move out to hallway
    util.simpleMove("key.keyboard.w",90,0,3*20)
    //move to block
    util.simpleMove("key.keyboard.w",0,0,2*20)
    //strafe to wall
    util.simpleMove("key.keyboard.a",0,0,1*20)
    //move to next tower
    util.simpleMove("key.keyboard.w",0,0,5*20)
    //move into tower
    util.simpleMove("key.keyboard.w",-90,0,2*20)
    //move into first cocoa beam
    util.simpleMove("key.keyboard.w",0,0,1*20)
    //align to tower wall
    util.simpleMove("key.keyboard.d",0,0,1*20)

    //reset cocoabeam to 1 for after restarts
    cocoaBeam = 1
}

//Chat.log("Done Cocoa Beaning")


//Reset keybinds to prevent phantom key holds.
util.resetKeys()

Chat.log(finishedText)
util.logScriptEnd(farmName, regrowthTime)

/*-------------------
   4 Program End
-------------------*/
