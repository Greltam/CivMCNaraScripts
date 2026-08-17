
//Zeal Rail Cleaning Script
/*

    Zeal Rail Cleaning Script on CivMC
    Written by Greltam 8/17/2026
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

/*
//    Directions: 
//    Fill inventory with axes
//    Hop on minecart and start
//    Activate script
//
//    Player will automatically change direction to clean rails
//    in front using the clean by attacking mechanic
//
//    Any axes will work, but script will only switch between the
//    same type of axe (diamonds to diamonds or stone to stone)
//
//    Alter attackClean in 1.2 Player Configurables to false
//    if you want to rightclick clean to prevent block breakage.
*/

/*-----------------------
   0.1 Player Requirements to Start End
-----------------------*/

/*------------------------
   1.1 Import Files Start
------------------------*/
const util = require("./McUtilityFile.js")

const config = require("./McUConfigFile.js")
config.initialize()
/*-----------------------
   1.1 Import Files End
-----------------------*/

/*------------------------
   1.2 Player Configurables Start
------------------------*/

//use attack for cleaning, much faster than use cleaning
//set to false to prevent collateral block damage/breaking
attackClean = true

quitKey = config.getString("quitKey", "key.keyboard.s")
useKey = config.getString("useKey", "key.mouse.right")
attackKey = config.getString("attackKey", "key.mouse.left")

//alter the default quitkey from s to whatever you want.
util.setQuitKey(quitKey) //default: util.setQuitKey("key.keyboard.j") 
util.setSaveTool(true)
/*------------------------
   1.2 Player Configurables End
------------------------*/
/*------------------------
   2 Global Variables Start
------------------------*/

//Increase frames to check for player position/direction
lastXZ = [[1,1],[2,2],[3,3]]
counter = 0 //used to make sure lastXZ is filled with valid positions

yaw = 0 //changes based on calculated direction
pitch = 35 //aim at the rails in front/below to clean

//directions player is moving
north = false
east = false
south = false
west = false

/*------------------------
   2 Global Variables End
------------------------*/
/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("Zeal", "dark_aqua"),
        util.simpleJSONString(" Clean Rails, Activating!"
        , "aqua")
        ])
)
    
quitText =  Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("To Quit, Press: ", "red"),
        util.simpleJSONString(util.getQuitKey(), "white")
        ])
)

finishedText =  Chat.createTextHelperFromJSON(
    util.simpleJSONString("Ran out of Rails.", "aqua")
)

/*------------------------
   2.1 Formatted Strings End
------------------------*/

/*-------------------
   3 Functions Start
-------------------*/
function updateLastFrames(){
    //update positional frames
    for(let i = 1; i < lastXZ.length; i++){
        lastXZ[i-1] = lastXZ[i]
    }
    lastXZ[lastXZ.length - 1] = [player.getX(),player.getZ()] //player is stuck
}

function setDirection(){
    xDif = Player.getPlayer().getX() - lastXZ[0][0]
    zDif = Player.getPlayer().getZ() - lastXZ[0][1]
    
    //x is changing
    if(Math.abs(xDif) - 0.1 > 0){
        //current x is smaller than earlier x, moving west
        if(xDif < 0){
            east = false
            west = true
        }
        //current x is bigger than earlier x, moving east
        else{
            east = true
            west = false
        }
    }
    else{    
        east = false
        west = false
    }
    
    if(Math.abs(zDif) - 0.1 > 0){
        //current x is smaller than earlier z, moving north
        if(zDif < 0){
            north = true
            south = false
        }
        //current x is bigger than earlier z, moving south
        else{
            north = false
            south = true
        }
    }
    else{
        north = false
        south = false
    }
}

function setClean(bool){
    if(attackClean){ 
        util.key(attackKey, bool)
    }
    else{ 
        util.key(useKey, bool) 
    }
}
/*-------------------
   3 Functions End
-------------------*/
/*-------------------
   4 Program Start
-------------------*/
Chat.log(greetingsText)
Chat.log(quitText)

setClean(true)

while(!util.checkQuit()){
    util.spinTicks(1)
    updateLastFrames()
    
    //fill last frames with valid player data
    counter = counter + 1
    if(counter > lastXZ.length){
        setDirection()
        stall = false
        
             if(north && east){ yaw = -135}
        else if(south && east){ yaw = -45}
        else if(south && west){ yaw = 45}
        else if(north && west){ yaw = 135}
        else if(north){ yaw = -180}
        else if(east) { yaw = -90}
        else if(south){ yaw = 0}
        else if(west) { yaw = 90}
        else{
            //we are not currently moving, pause attacking to prevent
            //block breaks
            stall = true
        }
        util.smoothLookAt(yaw,pitch)
        
        if(stall){
            setClean(false)
        }
        else{
            setClean(true)
        }
    }
}

//Reset keybinds to prevent phantom key holds.
util.resetKeys()

Chat.log(finishedText)

/*-------------------
   4 Program End
-------------------*/
