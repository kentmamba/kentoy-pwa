// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope: ', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed: ', error);
            });
    });
}

// Fetch Data from the Dictionary API and Display Results
document.getElementById('searchWordBtn').addEventListener('click', () => {
    const word = document.getElementById('wordInput').value.trim(); // Get value from input
    if (!word) {
        alert("Please enter a word to search.");
        return;
    }
    
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    document.getElementById('result-container').innerHTML = ''; // Clear previous results
    document.getElementById('backBtn').style.display = 'block'; // Show back button

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Word not found or API failed');
            }
            return response.json();
        })
        .then(data => {
            const wordData = data[0]; // Access the first word object
            const wordMeaning = wordData.meanings[0].definitions[0].definition;
            const wordPronunciation = wordData.phonetics[0]?.text || "N/A";

            const resultContainer = document.getElementById('result-container');
            resultContainer.innerHTML = `
                <div class="result">
                    <h2 class="word-title">${wordData.word}</h2>
                    <p><strong>Pronunciation:</strong> ${wordPronunciation}</p>
                    <p><strong>Meaning:</strong> ${wordMeaning}</p>
                    <p><strong>Part of Speech:</strong> ${wordData.meanings[0].partOfSpeech}</p>
                    <a href="https://www.google.com/search?q=${word}" target="_blank" class="more-info-btn">More Info</a>
                </div>
            `;
        })
        .catch(error => {
            console.log('Error fetching word:', error);
            document.getElementById('result-container').innerHTML = `<p style="color: red;">Oops! Word not found or something went wrong.</p>`;
        });
});

// Back Button Action
document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('wordInput').value = ''; // Clear the input field
    document.getElementById('result-container').innerHTML = ''; // Clear result
    document.getElementById('backBtn').style.display = 'none'; // Hide the back button
});
