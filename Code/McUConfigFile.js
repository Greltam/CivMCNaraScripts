/*
    Config File for Greltam's JSMacro Scripts on CivMC
    Written on 8/28/2025 by Greltam
*/

/*
    //add this line at the top of a program file to access these functions
    const config = require("./McUConfigFile.js")
    config.initialize()
    
    //Usage would be as such
    config.setValue("quitKey", "key.keyboard.j")
    config.getValue("quitKey")
    if(config.hasKey("quitKey"){ stuff here}
*/
configFileName = "playerSettings.txt"
keyValueSeparator = "="
configList = []

const NULL = "null"

function initialize(){
//Loads a config file and retrieves the key values

    configFile = ""
    //Open playerSettings file
    if(FS.exists("./" + configFileName)){
        configFile = FS.open("./" + configFileName)
    }
    else{
        configFile = FS.createFile("./", configFileName)
        configFile = FS.open("./" + configFileName)
    }
    //get an iterator to read each line in the file
    configIterator = configFile.readLines()
    
    //for each line, get a key/value pair
    while(configIterator.hasNext()){
        configLine = configIterator.next()
        
        //separate the key value pair and put in configList
        //Not a Key/Value or Comment
        if(configLine.indexOf(keyValueSeparator) == -1){
            configList.push([configLine,NULL])
        
        }
        else{
            keyValueSplit = configLine.split(keyValueSeparator)
            configList.push([keyValueSplit[0],keyValueSplit[1]])
        }
    }
    configIterator.close()
    
}

function saveSettings(){
//save the current configuration settings to permanent file

    //Open playerSettings file
    configFile = FS.open("./" + configFileName)
    
    //clear config file
    configFile.write("")
    
    //iterate over config list
    for(let i = 0; i < configList.length; i++){
        keyValueString = configList[i][0]
        if(configList[i][1] != NULL){
            keyValueString = keyValueString
                           + keyValueSeparator 
                           + configList[i][1]
        }
        //write each key value pair
        configFile.append(keyValueString)
        
        //add newline unless at the last setting
        if( i + 1 != configList.length){
            configFile.append("\n")
        }
    }
}

//use only in emergencies
function deleteConfig(){
//save the current configuration settings to permanent file

    //Open playerSettings file
    configFile = FS.open("./" + configFileName)
    
    //clear config file
    configFile.write("")
    configList = []
}

function hasKey(keyName){
//checks for the given key from configList
    
    //iterate over config list
    for(let i = 0; i < configList.length; i++){
        
        //found a key name
        if(configList[i][0] == keyName){
            return true
        }
    }
    
    //did not find a key name
    return false
}
function get(keyName){
    //iterate over config list
    for(let i = 0; i < configList.length; i++){
        
        //found a key name
        if(configList[i][0] == keyName){
            return configList[i][1]
        }
    }
    return NULL
}

function getString(keyName){
//returns a value for the given key from configList
    return get(keyName)
}

function getString(keyName, defaultValue){
//returns a String for the given key from configList
//or adds key and defaultValue to config file if not found
    
    value = get(keyName)
    if(value != NULL){
        return value
    }
    
    //did not find a key name
    setKey(keyName, defaultValue)
    saveSettings()
    //did not find a key name
    return defaultValue
}
function getValue(keyName){
//returns a value for the given key from configList 
    return Number(get(keyName))
}

function getValue(keyName, defaultValue){
//returns a value for the given key from configList
//or adds key and defaultValue to config file if not found
    
    value = get(keyName)
    if(value != NULL){
        return Number(value)
    }
    
    //did not find a key name
    setKey(keyName, defaultValue)
    saveSettings()
    //did not find a key name
    return defaultValue
}
function getBool(keyName){
//returns a value for the given key from configList
    
    value = get(keyName)
    if(value != NULL){
        if(value == "true")
            return true
        else if(value == "false")
            return false
    }
    
    //did not find a key name
    return NULL
}

function getBool(keyName, defaultValue){
//returns a value for the given key from configList
//or adds key and defaultValue to config file if not found
    
    value = get(keyName)
    if(value != NULL){
        if(value == "true")
            return true
        else if(value == "false")
            return false
    }
    
    //did not find a key name
    setKey(keyName, defaultValue)
    saveSettings()
    return defaultValue
}

function setKey(keyName, value){
//add or update a value in the config list
    
    //iterate over config list
    for(let i = 0; i < configList.length; i++){
        
        //found a key name
        if(configList[i][0] == keyName){
        
            //update the value
            configList[i][1] = value
            return
        }
    }
    
    //did not find a key name
    configList.push([keyName,value])
}

function removeKey(keyName){
//remove a value in the config list
    
    //iterate over config list
    for(let i = 0; i < configList.length; i++){
        
        //found a key name
        if(configList[i][0] == keyName){
        
            //remove from list
            configList.splice(i,1)
            return
        }
    }
}




//You can alias this files functions with a different name while exporting
//We don't do this because we are not pepega.
module.exports = {
//exporting variables
    initialize   : initialize,
    saveSettings : saveSettings,
    deleteConfig : deleteConfig,
    hasKey    : hasKey,
    get       : get,
    getString : getString,
    getValue  : getValue,
    getBool   : getBool,
    setKey    : setKey,
    removeKey : removeKey
}
