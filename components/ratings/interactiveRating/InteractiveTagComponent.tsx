export const InteractiveTagComponent = (
    {
        selected,
		handleUserTagSelection
    }: 
    {
        selected: string[],
        handleUserTagSelection: (tag: string) => void
    }) => {

    const defaultTags = [
        "unlgaublich",
        "al dente",
        "überkocht",
        "gut gewürzt",
        "tolle Sauce",
        "süß",
        "zart",
        "zu viel",
        "zu wenig"
    ]


    return (
        <div className="text-center">
            {
                defaultTags.map((tag, index) => {
                    return (
                        <div 
                        className={`px-2 border inline-flex rounded-full m-1 ${selected.includes(tag) ? 'bg-main-green border-main-green' : 'border-main-black'}`} 
                        key={index}
                        onClick={() => handleUserTagSelection(tag)}>
                                {tag}
                        </div>
                    )
                })
            }
        </div>
    )
}