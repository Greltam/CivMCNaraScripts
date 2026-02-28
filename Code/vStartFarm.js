/*------------------------
   0 Title Start
------------------------*/
/*
    Name: vStartFarm
    Location: At any of Zeal [located in Nara] farms.
    Author: Greltam
    Date: 2/27/2026
    
    Description: A generic starter script for all the farms
        Saves user from needing to alter macros or have many
    
*/
/*------------------------
   0 Title End
------------------------*/

/*-------------------
   3 Functions Start
-------------------*/
function getDirectory(){

    rawPath = FS.toRawPath("vStartFarm.js")
    path = rawPath.toString()
    
    subPath = []
    subSplit = []
    try{
        //windows path structure
        subPath = path.split("\\Macros\\")
        subSplit = subPath[1].split("vStartFarm.js")
    }catch(error){
        //Linux path structure
        subPath = path.split("/Macros/")
        subSplit = subPath[1].split("vStartFarm.js")
    }
    return subSplit[0]
}

function playerAt(x,z,y){
    playerX = Math.floor(Player.getPlayer().getX())
    playerY = Math.floor(Player.getPlayer().getY())
    playerZ = Math.floor(Player.getPlayer().getZ())
    
    if(playerX == x && playerY == y && playerZ == z){
        return true
    }
    return false
}

function insideOf(x1,z1,x2,z2,x,z){

    if(x >= x1 &&
       x <= x2 &&
       z >= z1 &&
       z <= z2){
       
       return true
    }

    return false
}

function locateFarm(x,z){
    //Daisy chained farm scripts first
    if(GlobalVars.getBoolean("daisyGNC") || playerAt(2293, 8099, 2)){
        GlobalVars.putBoolean("daisyGNC",false)
        return "vDaisyTwistingWart.js"
    }
    
    if(GlobalVars.getBoolean("daisySata") || playerAt(4020, 7376, -62)){
        GlobalVars.putBoolean("daisySata",false)
        return "vDaisyMelonPotato.js"
    }
    
    //**********//
    //GSEZ Farms//
    //**********//
    
    //Coords for Oak farm
    if(insideOf(2863,5114,2959,5203,x,z)){
        return "McOakHiTechChop.js"
    }
    //Coords for Birch farm
    if(insideOf(2966,5152,3055,5248,x,z)){
        return "McBirchHiTechChop.js"
    }
    //Coords for Carrot farm
    if(insideOf(2974,5105,3007,5138,x,z)){
        return "McCarrotTower.js"
    }
    //Coords for Wheat farm
    if(insideOf(3021,5105,3055,5139,x,z)){
        return "McWheatTower.js"
    }
    
    //**********//
    //SaTa Farms//
    //**********//
    
    //Coords for McBeachaEastMelonTower farm
    if(insideOf(3994,7337,4021,7380,x,z)){
        return "McBeachaEastMelonTower.js"
    }
    //Coords for Potato Tower farm
    if(insideOf(3994,7386,4024,7415,x,z)){
        return "McPotatoTower.js"
    }
    //Coords for Sweet berry farm
    if(insideOf(3949,7426,3984,7457,x,z)){
        return "McSweetBerry.js"
    }
    //Coords for Beetroot farm
    if(insideOf(3981,7462,4017,7495,x,z)){
        return "McBeetTower.js"
    }
    //Coords for Zeal Melon farm
    if(insideOf(3952,7372,3988,7390,x,z)){
        return "McZealWestMelonTower.js"
    }
    
    //**********//
    //GSEX Farms//
    //**********//
    
    //Coords for Cocoa Tower farm
    if(insideOf(4208,417,4223,479,x,z)){
        return "McCocoaTower.js"
    }
    
    //**********//
    //GNC Farms//
    //**********//
    
    //Coords for Netherwart Tower farm
    if(insideOf(2270,8095,2290,8145,x,z)){
        return "McNetherwart.js"
    }
    //Coords for Twisting Vines Tower farm
    if(insideOf(2290,8095,2340,8145,x,z)){
        return "McTwistingVines.js"
    }
    //Coords for Nether Stem Tower farm
    if(insideOf(2200,8095,2267,8145,x,z)){
        return "McNetherStemTower.js"
    }
    
    
    //couldn't find a farm
    return "null"
}

/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/

Chat.log("Finding farm at location.")
    
//locate farm
farmName = locateFarm(Player.getPlayer().getX(),
                      Player.getPlayer().getZ())

if(farmName == "null"){
    Chat.log("No Farm found")
}
else{
    Chat.log(farmName + " found, starting...")
    JsMacros.runScript(getDirectory() + farmName)
}

/*-------------------
   4 Program End
-------------------*/
