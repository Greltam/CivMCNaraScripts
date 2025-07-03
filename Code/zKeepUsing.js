//Zeal Keep Using Script
/*

    Zeal Keep Using Script on CivMC
    ReWritten by Greltam 5/3/2024
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Look in the general direction you wish to use

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

useKey = "key.mouse.right"
jumpKey = "key.keyboard.space"
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
        util.simpleJSONString(" Auto User, Activating!"
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
    util.simpleJSONString("Finished Using.", "aqua")
)

/*------------------------
   2.1 Formatted Strings End
------------------------*/

/*-------------------
   4 Program Start
-------------------*/
Chat.log(greetingsText)
Chat.log(quitText)

util.key(useKey, true)

while(!util.checkQuit()){
    util.spinTicks(200)
}

//Reset keybinds to prevent phantom key holds.
util.resetKeys()


Chat.log(finishedText)

/*-------------------
   4 Program End
-------------------*/