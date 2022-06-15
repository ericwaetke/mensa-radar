export const calculateAverage = (array) => {
    let sum = 0
    array.forEach((num) => { sum += num.rating })
    return sum / array.length
}