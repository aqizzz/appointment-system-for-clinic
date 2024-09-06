export async function createFeedback(feedbackData) {
    // creates a new feedback object and saves it into the database.
    try {
        const response = await fetch('/insertFeedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }
        return response.json();
    } catch (error) {
        console.error('Error saving data:', error);
    }
}