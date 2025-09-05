document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultContainer = document.querySelector('.result-container');
    const errorContainer = document.querySelector('.error-container');
    const loader = document.querySelector('.loader');
    
    const wordElement = document.getElementById('word');
    const partOfSpeechElement = document.getElementById('part-of-speech');
    const phoneticElement = document.getElementById('phonetic');
    const definitionElement = document.getElementById('definition');
    const exampleElement = document.getElementById('example');
    const audioBtn = document.getElementById('audio-btn');
    const errorMessageElement = document.getElementById('error-message');
    
    let audioURL = '';
    
    // Function to search for a word
    async function searchWord() {
        const word = searchInput.value.trim();
        
        if (!word) {
            showError('Please enter a word to search.');
            return;
        }
        
        // Show loader, hide previous results and errors
        loader.style.display = 'block';
        resultContainer.style.display = 'none';
        errorContainer.style.display = 'none';
        
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            
            if (!response.ok) {
                throw new Error('Word not found. Please try another word.');
            }
            
            const data = await response.json();
            displayResult(data[0]);
        } catch (error) {
            showError(error.message);
        } finally {
            loader.style.display = 'none';
        }
    }
    
    // Function to display the result
    function displayResult(data) {
        const { word, phonetic, meanings } = data;
        
        // Set basic word information
        wordElement.textContent = word;
        phoneticElement.textContent = phonetic || '';
        
        // Get the first meaning
        const firstMeaning = meanings[0];
        partOfSpeechElement.textContent = firstMeaning.partOfSpeech || '';
        
        // Get definition and example
        const definition = firstMeaning.definitions[0]?.definition || 'No definition available.';
        const example = firstMeaning.definitions[0]?.example || 'No example available.';
        
        definitionElement.textContent = definition;
        exampleElement.textContent = example;
        
        // Check for audio pronunciation
        if (data.phonetics && data.phonetics.length > 0) {
            const phoneticsWithAudio = data.phonetics.filter(phonetic => phonetic.audio);
            if (phoneticsWithAudio.length > 0) {
                audioURL = phoneticsWithAudio[0].audio;
                audioBtn.style.display = 'block';
            } else {
                audioBtn.style.display = 'none';
            }
        } else {
            audioBtn.style.display = 'none';
        }
        
        // Show result container
        resultContainer.style.display = 'block';
    }
    
    // Function to show error message
    function showError(message) {
        errorMessageElement.textContent = message;
        errorContainer.style.display = 'block';
    }
    
    // Function to play audio pronunciation
    function playAudio() {
        if (audioURL) {
            const audio = new Audio(audioURL);
            audio.play();
        }
    }
    
    // Event listeners
    searchBtn.addEventListener('click', searchWord);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchWord();
        }
    });
    
    audioBtn.addEventListener('click', playAudio);
});