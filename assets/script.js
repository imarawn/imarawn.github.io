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
    
    // Load the image and get its natural dimensions
    img.onload = function() {
        const width = this.naturalWidth;
        const height = this.naturalHeight;

        // Set background color for larger images
        if (width > 250 || height > 80) {
            emoteBox.style.backgroundColor = '#eb0c0c'; // Color for larger images
        }

        // Create a label for dimensions
        const dimensionsLabel = document.createElement('div');
        dimensionsLabel.textContent = `Dimensions: ${width}x${height}`;
        emoteBox.appendChild(dimensionsLabel);
    };

    // Fetch the file size using a HEAD request
    fetch(emote.url, { method: 'HEAD' })
        .then(response => {
            const fileSize = response.headers.get('Content-Length');
            if (fileSize) {
                const sizeLabel = document.createElement('div');
                sizeLabel.textContent = `Size: ${formatBytes(fileSize)}`;
                emoteBox.appendChild(sizeLabel);
            }
        })
        .catch(error => console.error('Error fetching file size:', error));

    // Function to format bytes to a readable string
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Copy emote slug to clipboard on click
    img.addEventListener('click', () => {
        copyToClipboard(':' + emote.slug);
    });
    
    const label = document.createElement('div');
    label.textContent = ':' + emote.slug;
    
    emoteBox.appendChild(img);
    emoteBox.appendChild(label);
    parentElement.appendChild(emoteBox);
}


function performSearch() {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
        const manualInput = document.getElementById('manual-slug-input');
        const resultsDiv = document.getElementById('results');
        const slug = manualInput.value.trim();
        if (!slug) {
            resultsDiv.innerHTML = '';
            return;
        }
        const response = await fetch(`https://emote.highwebmedia.com/autocomplete?slug=${slug}`);
        const data = await response.json();
        resultsDiv.innerHTML = '';
        for (const emote of data.emoticons) {
            displayEmote(emote, resultsDiv);
        }
    }, 500);
}

document.getElementById('manual-slug-input').addEventListener('input', performSearch);
