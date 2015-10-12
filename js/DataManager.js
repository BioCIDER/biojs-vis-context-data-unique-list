function DataManager (options) {
    var consts = {
           
    };
   
    var default_options_values = {      
    };
    for(var key in options){
     this[key] = options[key];
    }
   
    for(var key in consts){
     this[key] = consts[key];
    }
}


DataManager.prototype = {
    constructor: DataManager,
    sourceField: 'source',
    
    getSourceField : function(jsonEntry){
        console.log(jsonEntry);
        if (jsonEntry !== null && jsonEntry !== undefined) {
            return jsonEntry[this.sourceField];
        }else return null;
    },
        
    getDataEntity : function (jsonEntry){
        var sourceFieldValue = this.getSourceField(jsonEntry);
        var commonData = null;
        switch(sourceFieldValue){
            case new ElixirRegistryData(null).SOURCE_FIELD_VALUE:
                commonData = new ElixirRegistryData(jsonEntry);
                break;
            case new ElixirTrainingData(null).SOURCE_FIELD_VALUE:
                commonData = new ElixirTrainingData(jsonEntry);
                break;
            case new ElixirEventData(null).SOURCE_FIELD_VALUE:
                commonData = new ElixirEventData(jsonEntry);
                break;
            default:
                console.log("ERROR: Unknown source field value: " + sourceFieldValue);
        }
        return commonData;
    
    }

}



  
