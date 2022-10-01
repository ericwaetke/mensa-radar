export const Pill = ({children}) => {

    return (
        <div className="capitalize font-medium text-sm bg-main-white rounded-full py-1 px-4 flex items-center gap-1 min-w-max">
            {children}
        </div>
    )
}