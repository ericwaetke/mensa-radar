export const InteractiveAmountRatingComponent = ({amount, setAmount, className}: {amount: number, setAmount: (amount: number) => void, className: string}) => {

    return (
        <div>
            <input type={"range"} min={0} max={10} step={0.1} value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} className={className}/>
        </div>
    )
}