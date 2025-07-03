
//Zeal Crouch Mining Script
/*

    Zeal Crouch Mining Script on CivMC
    Written by Greltam 4/9/2025
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Look in the direction you wish to crouch mine
//    No snapping in cardinal directions currently

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
util.setQuitKey("key.keyboard.s") //default: util.setQuitKey("key.keyboard.j") 

attackKey = "key.mouse.left"
sneakKey = "key.keyboard.left.shift"
forwardKey = "key.keyboard.w"

util.setSaveTool(false)
/*------------------------
   1.2 Player Configurables End
------------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("Zeal", "dark_aqua"),
        util.simpleJSONString(" Crouch Miner, Crouching!"
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
    util.simpleJSONString("Standing up.", "aqua")
)

/*------------------------
   2.1 Formatted Strings End
------------------------*/

/*-------------------
   4 Program Start
-------------------*/
Chat.log(greetingsText)
Chat.log(quitText)

util.key(attackKey, true)
util.key(sneakKey, true)
util.key(forwardKey, true)

while(!util.checkQuit()){
    util.spinTicks(200)
}

//Reset keybinds to prevent phantom key holds.
util.resetKeys()


Chat.log(finishedText)

/*-------------------
   4 Program End
-------------------*/