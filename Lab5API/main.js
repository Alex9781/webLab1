"use strict";

function createUpvotesElement(num) {
    let upvotesElement = document.createElement("div");
    upvotesElement.classList.add("upvotes");
    upvotesElement.textContent = num;
    return upvotesElement;
}

function createAuthorElement(user) {
    user = user || { name: { first: "", last: "" } };
    let authorElement = document.createElement("div");
    authorElement.classList.add("author-name");
    authorElement.textContent = user.name.first + " " + user.name.last;
    return authorElement;
}

function createFooterElement(record) {
    let footerElement = document.createElement("footer");
    footerElement.classList.add("item-footer");
    footerElement.append(createAuthorElement(record.user));
    footerElement.append(createUpvotesElement(record.upvotes));
    return footerElement;
}

function createContentElement(record) {
    let contentElement = document.createElement("div");
    contentElement.classList.add("item-content");
    contentElement.innerHTML = record.text;
    return contentElement;
}

function createListItemElement(record) {
    let itemElement = document.createElement("div");
    itemElement.classList.add("facts-list-item");
    itemElement.append(createContentElement(record));
    itemElement.append(createFooterElement(record));
    return itemElement;
}

function renderRecords(records) {
    let factsList = document.querySelector(".facts-list");
    factsList.innerHTML = "";
    for (let record of records) {
        factsList.append(createListItemElement(record));
    }
}

function setPaginationInfo(info) {
    document.querySelector(".total-count").innerHTML = info.total_count;
    let start = info.total_count > 0 ? (info.current_page - 1) * info.per_page + 1 : 0;
    document.querySelector(".current-iterval-start").innerHTML = start;
    let end = Math.min(info.total_count, start + info.per_page - 1);
    document.querySelector(".current-iterval-end").innerHTML = end;
}

function createPageBtn(page, classes = []) {
    let btn = document.createElement('button');
    classes.push('btn');
    btn.classList.add(...classes);
    btn.dataset.page = page;
    btn.innerHTML = page;
    return btn;
}

function renderPaginationElement(info) {
    let btn;
    let paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    if (info.total_count == 0) return;

    btn = createPageBtn(1, ['first-page-btn']);
    btn.innerHTML = 'Первая страница';
    if (info.current_page == 1) {
        btn.style.visibility = 'hiden';
    }
    paginationContainer.append(btn);

    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('pages-btns');
    paginationContainer.append(buttonsContainer);

    let start = Math.max(info.current_page - 2, 1);
    let end = Math.min(info.current_page + 2, info.total_pages);
    for (let i = start; i <= end; i++) {
        buttonsContainer.append(createPageBtn(i, i == info.current_page ? ['active'] : []));
    }

    btn = createPageBtn(info.total_pages, ['last-page-btn']);
    btn.innerHTML = 'Последняя страница';
    if (info.current_page == info.total_pages) {
        btn.style.visibility = 'hiden';
    }
    paginationContainer.append(btn);
}

function downloadData(page = 1, search = "") {
    let factsList = document.querySelector(".facts-list");
    let perPage = document.querySelector(".per-page-btn").value;
    let url = new URL(factsList.dataset.url);
    url.searchParams.append("page", page);
    url.searchParams.append("per-page", perPage);
    url.searchParams.append("q", search);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onload = function () {
        renderRecords(this.response.records);
        setPaginationInfo(this.response["_pagination"]);
        renderPaginationElement(this.response["_pagination"]);
    };
    xhr.send();
}

function pageBtnHandler(event) {
    if (event.target.dataset.page) {
        downloadData(event.target.dataset.page, document.querySelector("#search-field").value);
        window.scrollTo(0, 0);
    }
}

function getSuggestion(search) {
    let url = new URL("http://cat-facts-api.std-900.ist.mospolytech.ru/autocomplete");
    url.searchParams.append("q", search);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onload = function () {
        renderSuggestions(this.response);
    };
    xhr.send();
}

function renderSuggestions(response) {
    let suggestions = document.querySelector("#search-suggestions");
    
    while (suggestions.firstChild) suggestions.removeChild(suggestions.firstChild);

    for (const i of response) {
        let option = document.createElement("option");
        option.value = i; 
        suggestions.append(option);
    }
}

window.onload = function () {
    downloadData();
    document.querySelector(".pagination").onclick = pageBtnHandler;
    document.querySelector(".per-page-btn").onchange = () => { downloadData(1, document.querySelector("#search-field").value) };
    document.querySelector(".search-btn").onclick = () => { downloadData(1, document.querySelector("#search-field").value) };
    document.querySelector("#search-field").oninput = () => { getSuggestion(document.querySelector("#search-field").value) };
}