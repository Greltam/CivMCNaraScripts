// Delayed until after server restart
// Nether Stem Tower Script
/*
    !!! Script starts at 2264, 8097, 34 !!!

    Nether Stem Chopper on CivMC @ 2265, 8143, 7-40
    Delay script written by Greltam 5/28/2025
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Edit:
//    GlobalVars.putInt("delayStartHour",3)
//where 3 is the hour you want the bot to start up.

//Player must stand at script start: 2264, 8097, 34

//!!!IMPORTANT!!!
//Clear any stray wart blocks present in front of all doors
//on each row of each layer. (East side only)
//!!!IMPORTANT!!!

//Player must place axe in the rightmost hotbar(9)
//Player must place hoe in the next rightmost hotbar(8)
//Hoe should be high durability
//Player must place fungus in next rightmost hotbar(7)
//Player must place bonemeal in next rightmost hotbar(6)
//Player must place sticks in the next rightmost hotbar(5)

//Inventory will be filled with:
//20 stacks of warped fungus
//2 stacks of bone blocks
//3 stacks of bonemeal
//2 e(4/5)u3 diamond axes
//1 e5u3 diamond hoe
//1 stack of sticks


//Player must have McUReconnect and McUKillSnitchEngage
//installed and enabled

//Directions: 
//    1 Run vDelayNetherStems.js once.
//    2 /logout after seeing "Nether stem farm delayed start"
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
GlobalVars.putBoolean("delayNetherStem",true)
Chat.log("Nether stem farm delayed start")
