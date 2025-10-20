document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.search-box');
    const input = form.querySelector('input[type="search"]');
    const resultsContainer = document.querySelector('.results');
    const resultsCounter = document.querySelector('header p');
    const historyList = document.querySelector('.history-list');
    const clearBtn = document.querySelector('.clear-history');

    const apiKey = 'AIzaSyD9A4YhuBUa4C0H-qgIBp7xwhJF46HVEqo';
    const cx = '7195047f108cc4312';

    // 讀取本地紀錄
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    renderHistory();

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchTerm = input.value.trim();
        if (searchTerm) {
            addToHistory(searchTerm);
            searchGoogle(searchTerm);
        }
    });

    // Google 搜尋
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

    // 顯示結果
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

    // 加入紀錄
    function addToHistory(term) {
        // 如果已有相同紀錄則先移除舊的
        searchHistory = searchHistory.filter(item => item !== term);
        // 把新的放最前面
        searchHistory.unshift(term);
        // 限制最多 10 筆
        if (searchHistory.length > 10) searchHistory.pop();
        // 儲存到 localStorage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderHistory();
    }

    // 顯示搜尋紀錄
    function renderHistory() {
        historyList.innerHTML = '';
        if (searchHistory.length === 0) {
            historyList.innerHTML = '<li class="no-history">目前沒有搜尋紀錄</li>';
            return;
        }

        searchHistory.forEach(term => {
            const li = document.createElement('li');
            li.textContent = term;
            li.title = '點擊以重新搜尋';
            li.addEventListener('click', () => {
                input.value = term;
                searchGoogle(term);
            });

            const delBtn = document.createElement('button');
            delBtn.textContent = '✖';
            delBtn.className = 'delete-btn';
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止觸發點擊搜尋
                searchHistory = searchHistory.filter(item => item !== term);
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                renderHistory();
            });

            li.appendChild(delBtn);
            historyList.appendChild(li);
        });
    }

    // 清除全部紀錄
    clearBtn.addEventListener('click', () => {
        if (confirm('確定要清除所有搜尋紀錄嗎？')) {
            searchHistory = [];
            localStorage.removeItem('searchHistory');
            renderHistory();
        }
    });
});
