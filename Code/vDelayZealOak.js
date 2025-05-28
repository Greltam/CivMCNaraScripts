// Delayed until after server restart
// GSEZ Oak Tree Script
/*
    !!! Script starts at 2958, 5202, 67 !!!

    Hi Tech Oak Tree Chopper on CivMC @ 2958, 5202, 67
    Delay script written by Greltam 5/28/2025
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/
//Edit:
//    GlobalVars.putInt("delayStartHour",3)
//where 3 is the hour you want the bot to start up.

//Player must stand at script start: 2958, 5202, 67
//Player must have 3 diamond axes(>=e4u3) 
//    and 2 diamond hoes(>=u3) in inventory
//Player must place axe in the rightmost hotbar(9)
//Player must place hoe in the next rightmost hotbar(8)

//Player must have McUReconnect and McUKillSnitchEngage
//installed and enabled

//Directions: 
//    1 Run vDelayZealOak.js once.
//    2 /logout after seeing "GSEZ oak farm delayed start"
//    3 Click button to go back to main server list
//    4 Alter power settings so screen turns off in 1 minute
//        but PC never sleeps
//    5 Keep the minecraft program maximized and in focus
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
GlobalVars.putBoolean("delayZealOak",true)
Chat.log("GSEZ oak farm delayed start")
