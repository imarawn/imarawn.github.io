let searchTimeout;

        // The URL of the Discord webhook


        async function loadAndFetchEmoticons() {
            const fileInput = document.getElementById('file-input');
            const resultsDiv = document.getElementById('results');
            if (fileInput.files.length === 0) {
                alert('Please choose a file');
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
                alert('Please enter a keyword');
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
                const width = this.naturalWidth;
                const height = this.naturalHeight;

                if (width > 250 || height > 80) {
                    emoteBox.style.backgroundColor = '#eb0c0c';
                }

                const dimensionsLabel = document.createElement('div');
                dimensionsLabel.textContent = `Dimensions: ${width}x${height}`;
                emoteBox.appendChild(dimensionsLabel);
            };

            img.addEventListener('click', async () => {
                copyToClipboard(':' + emote.slug); // Copy the emote name when clicking on the image
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
