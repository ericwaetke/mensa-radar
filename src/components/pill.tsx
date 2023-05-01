export const Pill = ({children, col = "", icon = "", className = ""}) => {

    let colString;
    switch(col) {
        case "vegan": 
            colString = "bg-main-green";
            break;
        case "vegeterian": 
            colString = "bg-vegeterian-yellow";
            break;
        case "fish": 
            colString = "bg-fish-blue";
            break;
        case "meat":
            colString = "bg-meat-red";
            break;
        case "transparent":
            colString = "";
            break;
        case "black":
            colString = "bg-gray/70 text-white";
            break;
        default: {
            colString = "bg-gray/20";
        }
    }

    return (
        <div className={`inline-flex flex-row h-full mt-1 gap-x-1 py-1 px-2.5 ${icon ? "pl-2" : null} ${colString} items-center rounded-full text-sm font-sans-reg ${className}`}>
            { icon ? <img  width="16" src={icon} /> : null } {children}
        </div>
    )
}

export const PillOnWhiteBG = ({children}) => {

    return (
        <div className="inline-flex flex-row space-x-1 px-2.5 pl-2  bg-vegeterian-yellow items-center rounded-full text-sm">
            {children}
        </div>
    )
}
