// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

export const saveQualityReviewToDB = (offer, review, mensa, sessionId) => {
    postData("/api/qualityReview", {offer, rating: review, mensa, sessionId})
}

export const saveAmountReviewToDB = (offer, amountReview, mensa, sessionId) => {
    postData("/api/amountReview", {offer, rating: amountReview, mensa, sessionId})
}