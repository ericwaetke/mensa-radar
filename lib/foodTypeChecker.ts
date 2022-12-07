function foodTypeChecker(label){
    const foodTypes = {
        SCHWEIN: "Schwein",
        GEFLUEGEL: "Gefluegel",
        LAMM: "Lamm",
        RIND: "Rind",
        FISCH: "Fisch",
        VEGETARISCH: "vegetarisch",
        VEGAN: "vegan"
    }
    
    const filterTypes = {
        VEGETARISCH: "Vegetarisch",
        VEGAN: "Vegan",
        PESCETARISCH: "Pescetarisch",
        ALL: "all"
    }
    
    switch (label) {
        case foodTypes.SCHWEIN:
        return {foodType: foodTypes.SCHWEIN, filter: filterTypes.ALL}
    
        case foodTypes.GEFLUEGEL:
        return {foodType: foodTypes.GEFLUEGEL, filter: filterTypes.ALL}
    
        case foodTypes.LAMM:
        return {foodType: foodTypes.LAMM, filter: filterTypes.ALL}
        
        case foodTypes.RIND:
        return {foodType: foodTypes.RIND, filter: filterTypes.ALL}
        
        case foodTypes.FISCH:
        return {foodType: foodTypes.FISCH, filter: filterTypes.PESCETARISCH}
        
        case foodTypes.VEGETARISCH:
        return {foodType: foodTypes.VEGETARISCH, filter: filterTypes.VEGETARISCH}
        
        case foodTypes.VEGAN:
        return {foodType: foodTypes.VEGAN, filter: filterTypes.VEGAN}
        
        default:
        return {foodType: "", filter: filterTypes.ALL};
    }
}

export default foodTypeChecker