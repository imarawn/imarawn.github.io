let searchTimeout;


async function loadAndFetchEmoticons() {
    const fileInput = document.getElementById('file-input');
    const resultsDiv = document.getElementById('results');
    if (fileInput.files.length === 0) {
        alert('please choose a file');
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
        alert('please enter a keyword');
        return;
    }
    const response = await fetch(`https://emote.highwebmedia.com/autocomplete?slug=${slug}`);
    const data = await response.json();
    resultsDiv.innerHTML = '';
    for (const emote of data.emoticons) {
        displayEmote(emote, resultsDiv);
    }
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
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

    img.addEventListener('click', () => {
        copyToClipboard(':' + emote.slug);
        alert('Emote-Slug kopiert: :' + emote.slug);
    });
    
    const label = document.createElement('div');
    label.textContent = emote.slug;
    
    emoteBox.appendChild(img);
    emoteBox.appendChild(label);
    
    parentElement.appendChild(emoteBox);
}

function performSearch() {
    clearTimeout(searchTimeout); // Löscht das vorherige Timeout

    searchTimeout = setTimeout(async () => {
        const manualInput = document.getElementById('manual-slug-input');
        const resultsDiv = document.getElementById('results');
        const slug = manualInput.value.trim();
        if (!slug) {
            resultsDiv.innerHTML = ''; // Löscht die Ergebnisse, wenn das Eingabefeld leer ist
            return;
        }
        const response = await fetch(`https://emote.highwebmedia.com/autocomplete?slug=${slug}`);
        const data = await response.json();
        resultsDiv.innerHTML = '';
        for (const emote of data.emoticons) {
            displayEmote(emote, resultsDiv);
        }
    }, 500); // Wartet 500ms nach dem letzten Tastenanschlag, bevor die Suche ausgeführt wird
}

// Event-Listener hinzufügen, um die Suche bei jeder Eingabe auszuführen
document.getElementById('manual-slug-input').addEventListener('input', performSearch);
