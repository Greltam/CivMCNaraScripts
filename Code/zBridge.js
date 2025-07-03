//Zeal Bridging Script
/*

    Zeal Bridging Script on CivMC
    Written by Greltam 4/9/2025
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions:
//    Set Options -> Accessibility -> Sneak -> Toggle
//    Get into sneak position
//    Look in the general direction at the block face
//        you wish to bridge from
//Player will snap to a cardinal looking position
//Have food in mainhand

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

//alter the default quitkey from s to whatever you want.
util.setQuitKey("key.keyboard.j") //default: util.setQuitKey("key.keyboard.s")

//default movement keys
directionKey = "key.keyboard.a"    //default: "key.keyboard.left.control" 
backwardKey = "key.keyboard.s"     //default: "key.keyboard.w"
useKey = "key.mouse.right"         //default: "key.mouse.right" 
//jumpKey = "key.keyboard.space"   //default: "key.keyboard.space"

/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
bridgeYaw = 0 //placeholder before snapping
bridgePitch = 63 //best guess to center of block after snapping
/*-----------------------
   2 Global Variables End
-----------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("Zeal", "dark_aqua"),
        util.simpleJSONString(" Bridger Activating!", "aqua")
        ])
)
    
quitText =  Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("To Quit, Press: ", "red"),
        util.simpleJSONString(util.getQuitKey(), "white")
        ])
)

finishedText =  Chat.createTextHelperFromJSON(
    util.simpleJSONString("Bridging Canceled.", "aqua")
)
/*-----------------------
   2.1 Formatted Strings End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/
//direction to bridge - player looks one way, bridging goes opposite
function snapToCardinal(){
    playerYaw = Player.getPlayer().getYaw()
    
    if(playerYaw > 0 && playerYaw < 45){
        bridgeYaw = 22.5
        directionKey = "key.keyboard.a"
    }
    else if(playerYaw > 45 && playerYaw < 90){
        bridgeYaw = 67.5
        directionKey = "key.keyboard.d"
    }
    else if(playerYaw > 90 && playerYaw < 135){
        bridgeYaw = 112.5
        directionKey = "key.keyboard.a"
    }
    else if(playerYaw > 135 && playerYaw < 180){
        bridgeYaw = 157.5
        directionKey = "key.keyboard.d"
    }
    
    else if(playerYaw < 0 && playerYaw > -45){
        bridgeYaw = -22.5
        directionKey = "key.keyboard.d"
    }
    else if(playerYaw < -45 && playerYaw > -90){
        bridgeYaw = -67.5
        directionKey = "key.keyboard.a"
    }
    else if(playerYaw < -90 && playerYaw > -135){
        bridgeYaw = -112.5
        directionKey = "key.keyboard.d"
    }
    else{
        bridgeYaw = -157.5
        directionKey = "key.keyboard.a"
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

snapToCardinal()

while(!util.checkQuit()){
    util.simpleLook(bridgeYaw,bridgePitch,1)
    util.key(directionKey, true)
    util.key(backwardKey, true)
    util.key(useKey, true)
}

util.resetKeys()

Chat.log(finishedText)

/*-------------------
   4 Program End
-------------------*/