export const Pill = ({children, className = ""}) => {

    return (
        <div className={`${className} font-medium text-sm bg-main-white rounded-full py-0.5 px-3 inline-flex items-center gap-1 min-w-max`}>
            {children}
        </div>
    )
}

export const PillOnWhiteBG = ({children}) => {

    return (
        <div className="font-medium text-sm border border-black bg-main-white rounded-full py-0.5 px-3 inline-flex items-center gap-1 min-w-max">
            {children}
        </div>
    )
}
