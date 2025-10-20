document.addEventListener('DOMContentLoaded', function () {

    // 📜 檢查是否在搜尋紀錄頁
    const historyList = document.querySelector('.history-list');
    const clearBtn = document.querySelector('.clear-history');

    const apiKey = 'AIzaSyD9A4YhuBUa4C0H-qgIBp7xwhJF46HVEqo';
    const cx = '7195047f108cc4312';


    if (historyList && clearBtn) {
        // ✅ 這部分只在 history.html 執行
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        renderHistory();

        function renderHistory() {
            historyList.innerHTML = '';
            if (searchHistory.length === 0) {
                historyList.innerHTML = '<li class="no-history">目前沒有搜尋紀錄</li>';
                return;
            }
            searchHistory.forEach(term => {
                const li = document.createElement('li');
                li.textContent = term;
                li.title = '點擊以返回搜尋該關鍵字';
                li.addEventListener('click', () => {
                    window.location.href = `index.html?search=${encodeURIComponent(term)}`;
                });

                const delBtn = document.createElement('button');
                delBtn.textContent = '✖';
                delBtn.className = 'delete-btn';
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    searchHistory = searchHistory.filter(t => t !== term);
                    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                    renderHistory();
                });

                li.appendChild(delBtn);
                historyList.appendChild(li);
            });
        }

        clearBtn.addEventListener('click', () => {
            if (confirm('確定要清除所有搜尋紀錄嗎？')) {
                searchHistory = [];
                localStorage.removeItem('searchHistory');
                renderHistory();
            }
        });
    }

    // ✅ 以下是主搜尋頁 index.html 的程式
    const form = document.querySelector('.search-box');
    const input = form?.querySelector('input[type="search"]');
    const resultsContainer = document.querySelector('.results');
    const resultsCounter = document.querySelector('header p');

    if (!form) return; // 🧱 若不是搜尋頁，直接跳過

    const apiKey = 'YOUR_GOOGLE_API_KEY';
    const cx = 'YOUR_SEARCH_ENGINE_ID';
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchTerm = input.value.trim();
        if (searchTerm) {
            saveHistory(searchTerm);
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

    function saveHistory(term) {
        searchHistory = searchHistory.filter(t => t !== term);
        searchHistory.unshift(term);
        if (searchHistory.length > 20) searchHistory.pop();
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
});
