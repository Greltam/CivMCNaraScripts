//Zeal Ore Breaker Script
/*

    Zeal Ore Breaker Script on CivMC
    ReWritten by Greltam 5/3/2024
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Player will use and attack at the same Time
//Hold ore to break in off hand
//Hold pick in mainhand

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
useKey = "key.mouse.right"
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
        util.simpleJSONString(" Ore Breaker, Revving up!"
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
    util.simpleJSONString("Done Smashing.", "aqua")
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