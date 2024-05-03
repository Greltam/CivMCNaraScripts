//Zeal Ice Roading Script
/*

    Zeal Ice Roading Script on CivMC
    ReWritten by Greltam 5/3/2024
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Look in the general direction you wish to iceroad
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
util.setQuitKey("key.keyboard.s") //default: util.setQuitKey("key.keyboard.s")

//default movement keys
sprintKey = "key.keyboard.left.control"   //default: "key.keyboard.left.control" 
forwardKey = "key.keyboard.w"             //default: "key.keyboard.w"
useKey = "key.mouse.right"                //default: "key.mouse.right" 
jumpKey = "key.keyboard.space"            //default: "key.keyboard.space"

/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/

/*-----------------------
   2 Global Variables End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/
function snapToCardinal(){
    playerYaw = Player.getPlayer().getYaw()
    if(playerYaw < 45 && playerYaw > -45){
        player.lookAt(0,0)
    }
    else if(playerYaw < -45 && playerYaw > -135){
        player.lookAt(-90,0)
    }
    else if(playerYaw < 135 && playerYaw > 45){
        player.lookAt(90,0)
    }
    else{
        player.lookAt(180,0)    
    }
}
/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/

Chat.log("Zeal Ice Roader, boosting Nitro!!")
Chat.log("Press: " + util.getQuitKey() + " to end script")

snapToCardinal()

while(!util.checkQuit()){
    
    KeyBind.key(sprintKey, true)
    KeyBind.key(forwardKey, true)
    KeyBind.key(useKey, true)
    
    KeyBind.key(jumpKey, true)
    util.spinTicks(1)
    KeyBind.key(jumpKey, false)
    util.spinTicks(1)
}

//util.resetKeyBinds()
    KeyBind.key(sprintKey, false)
    KeyBind.key(forwardKey, false)
    KeyBind.key(useKey, false)
    KeyBind.key(jumpKey, false)

Chat.log("Out of Nitro. ")

/*-------------------
   4 Program End
-------------------*/
