// Delayed until after server restart
// AFK time
/*
    !!! Script starts wherever !!!

    Delay script written by Greltam 8/12/2025
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/
//Edit:
//    GlobalVars.putInt("delayStartHour",3)
//where 3 is the hour you want the bot to start up.

//Player must have McUReconnect and McUKillSnitchEngage
//installed and enabled

//Directions: 
//    1 Run vDelayAFK.js once.
//    2 /logout after seeing "AFK delayed start activated"
//    3 Click button to go back to main server list
//    4 Alter power settings so screen turns off in 1 minute
//        but PC never sleeps
//    5 Keep the minecraft program maximized and in focus
//        *not necessary if just afking*
//        *scripts only "attack" while the window is in focus
//        *without focus we would not be able to break logs
//    6 Sleep
//    7 Wake up
//    8 Profit!
/*-----------------------
   0.1 Player Requirements to Start End
-----------------------*/
GlobalVars.putInt("delayStartHour",3)
GlobalVars.putBoolean("delayFarm",true)
Chat.log("AFK delayed start activated")
