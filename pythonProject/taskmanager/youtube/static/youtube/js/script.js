function saveSearchResultsToBackend(phrase) {
    // Надcилаеться запит AJAX до серверної частини Django, щоб зберегти пошукову фразу
    axios.post('/save_search_phrase/', {
        phrase: phrase,
    })
    .then(response => {
        console.log('Пошуковий запис збреженно в базу данних:', response.data);
    })
    .catch(error => {
        console.error('Помилка збереження пошукового запиту:', error);
    });
}

function sendSearchRequest() {
    const searchQuery = document.getElementById('searchInput').value;
    const maxResults = 10;

    axios.get(`/youtube_search/?q=${searchQuery}&maxResults=${maxResults}`)
        .then(response => {
            displaySearchResults(response.data.items);
            // Зберігаеться лише пошукова фраза у серверній частині
            saveSearchResultsToBackend(searchQuery);
        })
        .catch(error => {
            console.error('Помилка при виклику back-end API:', error);
        });
}






const favoriteVideos = new Set();

function toggleFavorite(videoId, title, thumbnailUrl, publishedAt) {
    if (favoriteVideos.has(videoId)) {
        favoriteVideos.delete(videoId);
        removeFavoriteVideoBackend(videoId);
    } else {
        favoriteVideos.add(videoId);
        saveFavoriteVideoBackend(videoId, title, thumbnailUrl, publishedAt);
    }

    // Передайться тільки улюблені відео, а не всі результати
    displaySearchResults([...favoriteVideos]);
}


function getVideoInfoById(videoId) {
    const videoInfo = {
        title: 'Назва відео',
        thumbnailUrl: 'URL зображення відео',
        publishedAt: 'Дата публікації',
    };

    return videoInfo;
}


function saveToFavorites() {
    const videoId = 'your_video_id';
    const title = 'your_video_title';
    const thumbnailUrl = 'your_thumbnail_url';
    const publishedAt = 'your_published_at';

    saveFavoriteVideoBackend(videoId, title, thumbnailUrl, publishedAt);
}


function saveFavoriteVideoBackend(videoId, title, thumbnailUrl, publishedAt) {
    axios.post('/toggle_favorite_video/', {
        video_id: videoId,
        title: title,
        thumbnail_url: thumbnailUrl,
        published_at: publishedAt
    })
    .then(response => {
        console.log('Відповідь від сервера:', response.data);
        console.log('Відео успішно збережено в обраному:', response.data);
    })
    .catch(error => {
        console.error('Помилка збереження обраного відео:', error);
    });
}

function removeFavoriteVideoBackend(videoId) {
    axios.post('/toggle_favorite_video/', {
        video_id: videoId
    })
    .then(response => {
        console.log('Відео успішно видалено з обраного:', response.data);
    })
    .catch(error => {
        console.error('Помилка видалення обраного відео:', error);
    });
}




function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('searchResults');

    searchResultsContainer.innerHTML = '';

    results.forEach(result => {
        const title = result.snippet.title;
        const videoId = result.id.videoId;
        const thumbnailUrl = result.snippet.thumbnails.medium.url;
        const publishedAt = result.snippet.publishedAt;

        const isFavorite = favoriteVideos.has(videoId);

        const resultElement = document.createElement('div');
        resultElement.innerHTML = `
            <div class="contserresult">
                <div class="serrusultimg">
                    <img src="${thumbnailUrl}" alt="${title}">
                </div>
                <div class="serresulttext">
                    <p><strong>Назва відео:</strong> ${title}</p>
                    <p><strong>Дата публікації:</strong> ${formatPublishedDate(publishedAt)}</p>
                    <button class="saveToFavoritesButton" onclick="saveToFavorites('${videoId}', '${title}', '${thumbnailUrl}', '${publishedAt}')">
    ${isFavorite ? 'Видалити з вподобаних' : 'Додати до вподобаних'}
</button>
                </div>
            </div>
        `;

        searchResultsContainer.appendChild(resultElement);
    });
}

function saveToFavorites(videoId, title, thumbnailUrl, publishedAt) {
    if (favoriteVideos.has(videoId)) {
        favoriteVideos.delete(videoId);
        removeFavoriteVideoBackend(videoId);
    } else {
        favoriteVideos.add(videoId);
        saveFavoriteVideoBackend(videoId, title, thumbnailUrl, publishedAt);
    }

    // Оновлюеться відображення результатів пошуку
    displaySearchResults(results);

    // Оновлюеться відображення списку вподобаних відео
    displayFavoriteVideos();
}



function formatPublishedDate(publishedAt) {
    const publicationDate = new Date(publishedAt);
    const formattedDate = `${publicationDate.getFullYear()}-${(publicationDate.getMonth() + 1).toString().padStart(2, '0')}-${publicationDate.getDate().toString().padStart(2, '0')} ${publicationDate.getHours().toString().padStart(2, '0')}:${publicationDate.getMinutes().toString().padStart(2, '0')}:${publicationDate.getSeconds().toString().padStart(2, '0')}`;

    return formattedDate;
}