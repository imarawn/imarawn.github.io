async function loadAndFetchEmoticons() {
    const fileInput = document.getElementById('file-input');
    const resultsDiv = document.getElementById('results');
    if (fileInput.files.length === 0) {
        alert('Bitte wählen Sie eine Datei aus.');
        return;
    }
    const file = fileInput.files[0];
    const text = await file.text();
    const slugs = text.split('\n').filter(slug => slug.trim() !== '');
    resultsDiv.innerHTML = '';
    for (const slug of slugs) {
        const response = await fetch(`https://emote.highwebmedia.com/autocomplete?slug=${slug}`);
        const data = await response.json();
        const exactEmote = data.emoticons.find(emote => emote.slug === slug);
        if (exactEmote) {
            displayEmote(exactEmote, resultsDiv);
        }
    }
}

async function fetchManualSlug() {
    const manualInput = document.getElementById('manual-slug-input');
    const resultsDiv = document.getElementById('results');
    const slug = manualInput.value.trim();
    if (!slug) {
        alert('Bitte geben Sie einen Slug ein.');
        return;
    }
    const response = await fetch(`https://emote.highwebmedia.com/autocomplete?slug=${slug}`);
    const data = await response.json();
    resultsDiv.innerHTML = '';
    for (const emote of data.emoticons) {
        displayEmote(emote, resultsDiv);
    }
}

function displayEmote(emote, parentElement) {
    const emoteBox = document.createElement('div');
    emoteBox.className = 'emote-box';

    const img = document.createElement('img');
    img.src = emote.url;
    img.alt = emote.slug;
    img.onload = function() {
        if (this.naturalWidth > 250 || this.naturalHeight > 80) {
            emoteBox.style.backgroundColor = '#eb0c0c'; // Farbe für größere Bilder
        }
    };
    
    const label = document.createElement('div');
    label.textContent = emote.slug;
    
    emoteBox.appendChild(img);
    emoteBox.appendChild(label);
    
    parentElement.appendChild(emoteBox);
}
