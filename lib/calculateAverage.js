export const calculateAverage = (array) => {
    let sum = 0
    array.forEach((num) => { sum += num.rating })
    return Math.round((sum / array.length) * 10) / 10
}