/*------------------------
   0 Title Start
------------------------*/
/*
    Name: Daisy Twisting Vines and Netherwart
    Location: GNC (Greltam Nether Complex) @ 2293, 8099, 2
    Author: Greltam
    Date: 9/15/2025
    
    Description: A Linking of the farm scripts for
        Twisting Vines -> NetherWart -> Twisting Vines
    
    Directions:
        Head to lodestone @ 2293, 8099, 2
        Either
            Activate script
        Or
            Activate vDelayFarm
    
    Collector: Lodestone elevator @ 
*/
/*------------------------
   0 Title End
------------------------*/

/*------------------------
   0.1 Player Requirements Start
------------------------*/
/*
    Pre-Start actions: 
        Check Compactor for health and compact recipe
        Check Slime blocks and redstone
        Load up 20 stacks of crates
    Items Required: Harvest hoe (fortune 3)
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
farmName = "Daisy Chaining GNC Vines and Wart"
regrowthTime = 24 * 3600 //hours multiplied by seconds per hour
harvestDuration = 85 //minutes to run a full harvest

/*------------------------
   2 Global Variables End
------------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("GNC", "red"),
        util.simpleJSONString(" Twisting Wart", "dark_purple"),
        util.simpleJSONString(" Daisy Chain", "white"),
        util.simpleJSONString(", booting...", "gold")
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
        util.simpleJSONString("GNC", "red"),
        util.simpleJSONString(" Twisting Wart", "dark_purple"),
        util.simpleJSONString(" Daisy Chain", "white"),
        util.simpleJSONString(", shutting down...", "red")
    ])
)
    
/*-----------------------
   2.1 Formatted Strings End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/
function getDirectory(){

    rawPath = FS.toRawPath("vDaisyTwistingWart.js")
    path = rawPath.toString()
    
    subPath = path.split("\\Macros\\")
    //subPath[0] should be all the .../.minecraft/config/jsmacros
    //subPath[1] should be the subdirectory(s)/"vDaisyTwistingWart.js"
    
    subSplit = subPath[1].split("vDaisyTwistingWart.js")
    return subSplit[0]
}

function moveToStart(){
//starting at bottom lodestone, head up elevator to start of twisting
    Chat.log("Heading up to Twisting Vines")
    util.simpleMove(lodestoneUpKey,-180, 0, 10)
    util.simpleMove(forwardKey,-180, 0, 1*20)
}

function moveToNetherwart(){
//starting from twisting vines end, head down and over to wart
//then up the lodestone
    Chat.log("Moving to Netherwart")
    util.simpleMove(forwardKey,0, 0, 1*20)
    util.simpleMove(forwardKey,90, 0, 3*20)
    util.simpleMove(forwardKey,-180, 0, 1*20)
    util.simpleMove(lodestoneUpKey,-180, 0, 10)
}

function moveToTwistingVines(){
//starting from wart end, head over and down to vines
//then up the lodestone
    Chat.log("Moving to Twisting Vines")
    util.simpleMove(forwardKey,-180, 0, 2*20)
    util.simpleMove(forwardKey,-90, 0, 3*20)
    util.simpleMove(forwardKey,0, 0, 2*20)
    util.simpleMove(lodestoneUpKey,-180, 0, 10)
    util.simpleMove(forwardKey,-180, 0, 1*20)
}
/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   3.9 Pre-Program Start
-------------------*/
//restart farm on reconnect
GlobalVars.putBoolean("farmRunning",true)
GlobalVars.putBoolean("daisyGNC",true)//for reconnect
GlobalVars.putBoolean("killsnitch", false)

//used to prematurely terminate after the netherwart
//in order to relogin and have last twisting vines regrow
disconnectScript = false

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
/*
    Reset farm completion flag
    Run script
    Wait for script to complete and set farm completion flag
    Move to next farm, then repeat
*/
//Run first farm of Twisting Vines
if(!GlobalVars.getBoolean("farm1")){
    GlobalVars.putBoolean("farmComplete", false)
    
    moveToStart()
    Chat.log("Booting up Twisting Vines")
    JsMacros.runScript(getDirectory() + "McTwistingVines.js")
    while(!GlobalVars.getBoolean("farmComplete")){
        Time.sleep(60000)//check back in 1 minute
    }
    
    moveToNetherwart()
    GlobalVars.putBoolean("farm1", true)
} 

//Run second farm of netherwart
if(!GlobalVars.getBoolean("farm2")){
    GlobalVars.putBoolean("farmComplete", false)
    
    Chat.log("Booting up Netherwart")
    JsMacros.runScript(getDirectory() + "McNetherwart.js")
    while(!GlobalVars.getBoolean("farmComplete")){
        Time.sleep(60000)//check back in 1 minute
    }
    
    moveToTwistingVines()
    GlobalVars.putBoolean("farm2", true)
    GlobalVars.putBoolean("farmRunning",true)
    
    //exit server so vines regrow from RB
    Client.disconnect()
    disconnectScript = true
} 

//Run third farm of twisting vine
if(!disconnectScript){
    if(!GlobalVars.getBoolean("farm3")){
        GlobalVars.putBoolean("farmComplete", false)
        
        Chat.log("Booting up Twisting Vines")
        JsMacros.runScript(getDirectory() + "McTwistingVines.js")
        while(!GlobalVars.getBoolean("farmComplete")){
            Time.sleep(60000)//check back in 1 minute
        }
        GlobalVars.putBoolean("farm3", true) 
    }
}
/*-------------------
   4 Program End
-------------------*/

/*-------------------
   4.1 Shutdown Start
-------------------*/

//Run third farm of twisting vine
if(!disconnectScript){
    //prevent reconnect from restarting farm
    GlobalVars.putBoolean("farmComplete", false)
    GlobalVars.putBoolean("farmRunning", false)
    GlobalVars.putBoolean("daisyGNC",false)
    GlobalVars.putBoolean("farm1", false)
    GlobalVars.putBoolean("farm2", false)
    GlobalVars.putBoolean("farm3", false)
    
    //Reset keybinds to prevent phantom key holds.
    util.resetKeys()
    
    //log script completion
    Chat.log(finishedText)
    
    //logout after daisy chain completion
    GlobalVars.putBoolean("killsnitch", true)
    Chat.say("/logout")
}
/*-------------------
   4.1 Shutdown End
-------------------*/
