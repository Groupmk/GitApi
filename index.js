function getRepositoryGitHub(keyword) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.github.com/search/repositories?q=${keyword}&per_page=5`)
            .then(response => response.json())
            .then(data => {
                const repositories = data.items;
                console.log(repositories);
                resolve(repositories);
            })
            .catch(error => reject(error));
    });
}

function createAutocompleteMenu(repositories) {
    const autocompleteMenu = document.getElementById('autocompleteMenu');

    autocompleteMenu.innerHTML = '';

    repositories.forEach(repository => {
        const menuItem = document.createElement('li');
        menuItem.textContent = repository.name;
        menuItem.addEventListener('click', () => {
            addRepository(repository);
            autocompleteMenu.innerHTML = '';
        });
        autocompleteMenu.appendChild(menuItem);
    });
}

function addRepository(repository) {
    const addedRepositories = document.getElementById('addedRepositories');

    const listItem = document.createElement('li');
    listItem.insertAdjacentHTML('beforeend', `
    <img class="avatar-user" src="${repository.owner.avatar_url}" alt="AvatarUser">
        <div class="listItem-inner">
            <span>Name: ${repository.name}</span>
            <span>Owner: ${repository.owner.login}</span>
            <span>Stars: ${repository.stargazers_count} stars</span>
        </div>
        <button class="removeButton"></button>`);

    const removeButton = listItem.querySelector('.removeButton');
    removeButton.addEventListener('click', () => {
        listItem.remove();
    });

    addedRepositories.appendChild(listItem);
}

function debounce(func, delay) {
    let timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, arguments);
        }, delay);
    };
}

const debouncedSearch = debounce((keyword) => {
    if (keyword !== '') {
        getRepositoryGitHub(keyword)
            .then(repositories => createAutocompleteMenu(repositories))
            .catch(error => console.error(error));
    } else {
        const autocompleteMenu = document.getElementById('autocompleteMenu');
        autocompleteMenu.innerHTML = '';
    }
}, 500);

document.getElementById('searchInput').addEventListener('input', event => {
    const keyword = event.target.value.trim();
    debouncedSearch(keyword);
});
