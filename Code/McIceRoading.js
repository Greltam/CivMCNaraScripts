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

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("Zeal", "dark_aqua"),
        util.simpleJSONString(" Ice Roader, boosting Nitro!!", "aqua")
        ])
)
    
quitText =  Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("To Quit, Press: ", "red"),
        util.simpleJSONString(util.getQuitKey(), "white")
        ])
)

finishedText =  Chat.createTextHelperFromJSON(
    util.simpleJSONString("Out of Nitro.", "aqua")
)
/*-----------------------
   2.1 Formatted Strings End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/
function snapToCardinal(){
    playerYaw = Player.getPlayer().getYaw()
    if(playerYaw < 45 && playerYaw > -45){
        util.simpleLook(0,0,1)
    }
    else if(playerYaw < -45 && playerYaw > -135){
        util.simpleLook(-90,0,1)
    }
    else if(playerYaw < 135 && playerYaw > 45){
        util.simpleLook(90,0,1)
    }
    else{
        util.simpleLook(180,0,1)    
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
    
    util.key(sprintKey, true)
    util.key(forwardKey, true)
    util.key(useKey, true)
    
    util.key(jumpKey, true)
    util.spinTicks(1)
    util.key(jumpKey, false)
    util.spinTicks(1)
}

util.resetKeys()

Chat.log(finishedText)

/*-------------------
   4 Program End
-------------------*/
