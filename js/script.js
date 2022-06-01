AOS.init(); //AnimateOnScroll

function goToSearch() {
    document.getElementById('searchInput').addEventListener("click", () => {
        window.location = './search.html';
    })
}

// Navbar
const menuToggleBtn = document.getElementById('toggleMenu');
const searchDrawer = document.querySelector('.searchDrawer');
const logo = document.querySelector('.logo');
const header = document.getElementById('header');

menuToggleBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    searchDrawer.classList.toggle('active');
    logo.classList.toggle('active');
});

var lastScrollTop = 0;
window.addEventListener("scroll", function() {
    var scrollTop = window.pageYOffset || this.document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        header.style.top = '-100px';
    } else {
        header.style.top = '0';
    }
    lastScrollTop = scrollTop;
});

//Slider
document.addEventListener("click", e => {
    let handle;
    if (e.target.matches(".handle")) {
        handle = e.target;
    } else {
        handle = e.target.closest(".handle");
    }
    if (handle != null) onHandleClick(handle);
});

document.querySelectorAll('.progressBar').forEach(calculateProgressBar);

function calculateProgressBar(progressBar) {
    progressBar.innerHTML = '';
    const slider = progressBar.closest(".row").querySelector('.slider');
    const itemCount = slider.children.length;
    const itemPerScreen = parseInt(
        getComputedStyle(slider).getPropertyValue("--image-per-screen")
    );
    const progressBarItemCount = Math.ceil(itemCount / itemPerScreen);
    const sliderIndex = parseInt(
        getComputedStyle(slider).getPropertyValue("--slider-index")
    );

    for (let i = 0; i < progressBarItemCount; i++) {
        const barItem = document.createElement('div');
        barItem.classList.add('progressItem');
        if (i === sliderIndex) {
            barItem.classList.add('active');
        }
        progressBar.append(barItem);
    }
}

function onHandleClick(handle) {
    const progressBar = handle.closest(".row").querySelector('.progressBar');
    const slider = handle.closest(".sliderContainer").querySelector(".slider");
    const sliderIndex = parseInt(
        getComputedStyle(slider).getPropertyValue("--slider-index")
    );

    const progressBarItemCount = progressBar.children.length;

    if (handle.classList.contains("left-handle")) {
        if (sliderIndex - 1 < 0) {
            slider.style.setProperty('--slider-index', progressBarItemCount - 1);
            progressBar.children[sliderIndex].classList.remove('active');
            progressBar.children[progressBarItemCount - 1].classList.add('active');
        } else {
            slider.style.setProperty('--slider-index', sliderIndex - 1);
            progressBar.children[sliderIndex].classList.remove('active');
            progressBar.children[sliderIndex - 1].classList.add('active');
        }
    }

    if (handle.classList.contains("right-handle")) {
        if (sliderIndex + 1 >= progressBarItemCount) {
            slider.style.setProperty('--slider-index', 0);
            progressBar.children[sliderIndex].classList.remove('active');
            progressBar.children[0].classList.add('active');
        } else {
            slider.style.setProperty('--slider-index', sliderIndex + 1);
            progressBar.children[sliderIndex].classList.remove('active');
            progressBar.children[sliderIndex + 1].classList.add('active');
        }
    }
}

// Search
const cardTemplate = document.querySelector('[data-card-template]');
const allCards = document.querySelector('[data-all-card-container]');
const cardLink = document.querySelector('[data-card-link]');
const searchInput = document.getElementById('search');
const textResult = document.querySelector('.textResult');

let posts = [];

searchInput.addEventListener('input', e => {
    const value = e.target.value.toLowerCase();
    this.addEventListener('keypress', (e) => {
        if (e.key === "Enter" || e.key === "enter") {
            posts.forEach(user => {
                textResult.innerHTML = `Results for "${searchInput.value}"`
                const isVisible = user.title.toLowerCase().includes(value) || user.tag.toLowerCase().includes(value);
                user.element.classList.toggle("hide", !isVisible);
            });
        }
    });
});

fetch('data.json')
.then(res => res.json())
.then(data => {
    posts = data.map(user => {
        const card = cardTemplate.content.cloneNode(true).children[0];
        const header = card.querySelector('[data-header]');
        const tag = card.querySelector('[data-card-tag]');
        const link = card.querySelector('[data-card-link]');
        header.textContent = user.title;
        tag.textContent = user.tag;
        link.href = user.url;
        allCards.append(card);

        return { title: user.title, tag: user.searchTag, element: card }
    });
});