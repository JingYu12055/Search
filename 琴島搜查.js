document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.search-box');
    const input = form.querySelector('input[type="search"]');
    const resultsContainer = document.querySelector('.results');
    const resultsCounter = document.querySelector('header p');

    // 這裡換成你的 Google CSE 資訊
    const apiKey = 'AIzaSyD9A4YhuBUa4C0H-qgIBp7xwhJF46HVEqo';
    const cx = '7195047f108cc4312';

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchTerm = input.value.trim();
        if (searchTerm) {
            searchGoogle(searchTerm);
        }
    });

    function searchGoogle(searchTerm) {
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(searchTerm)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayResults(data.items || []);
            })
            .catch(error => {
                resultsContainer.innerHTML = `<p style="color:red;">搜尋時發生錯誤：${error}</p>`;
            });
    }

    function displayResults(results) {
        resultsContainer.innerHTML = '';
        resultsCounter.textContent = `搜尋結果數量：${results.length}`;

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result';
            resultElement.innerHTML = `
                <h3>${result.title}</h3>
                <p>${result.snippet || ''}</p>
                <a href="${result.link}" target="_blank">前往該網站</a>
            `;
            resultsContainer.appendChild(resultElement);
        });
    }
});
