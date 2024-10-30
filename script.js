const searchButton = document.getElementById('searchButton');
const searchbar = document.getElementById('searchbar');
const searchInput = document.querySelector('#searchbar input');

searchButton.addEventListener('click', () => {
    searchbar.classList.toggle('hidden');
    searchbar.classList.toggle('visible');
    searchInput.focus(); 
});
