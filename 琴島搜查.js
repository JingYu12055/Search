document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.search-box');
    const input = form.querySelector('input[type="search"]');
    const resultsContainer = document.querySelector('.results');
    const resultsCounter = document.querySelector('header p');

    // 🔑 填入你的 Google Custom Search API Key & CX
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
        resultsContainer.innerHTML = `<p>正在搜尋「${searchTerm}」中...</p>`;
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(searchTerm)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    displayResults(data.items);
                } else {
                    resultsContainer.innerHTML = `<p>沒有找到相關結果。</p>`;
                    resultsCounter.textContent = `資料數量 : 0`;
                }
            })
            .catch(error => {
                resultsContainer.innerHTML = `<p style="color:red;">搜尋發生錯誤：${error}</p>`;
            });
    }

    function displayResults(results) {
        resultsContainer.innerHTML = '';
        resultsCounter.textContent = `資料數量 : ${results.length}`;
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
