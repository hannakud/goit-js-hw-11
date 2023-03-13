import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchArticles } from './partials/js/pixabay';

const searchForm = document.querySelector('#search-form');
const searchText = document.querySelector('input');
const searchBtn = document.querySelector('.search-btn');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let search = '';
let images = [];

searchForm.addEventListener('submit', async () => {
  event.preventDefault();
  cleanGallery();
  search = event.target[0].value;
  if (!search) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  try {
    const response = await fetchArticles(search, page);
    if (!response.data.hits.length) {
      throw new Error(
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        )
      );
    } else {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }
    console.log(response);
    images = response.data.hits;
    appendItems(response.data.hits);
    showBtn(response.data.totalHits);
  } catch (error) {
    console.log(error.message);
  }
});

function showBtn(totalHits) {
  if (images.length < totalHits) {
    loadMoreBtn.removeAttribute('hidden');
  } else {
    loadMoreBtn.setAttribute('hidden', true);
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function appendItems(hits) {
  const markup = hits
    .map(
      item =>
        `<a class="photo-link" href="${item.largeImageURL}">
            <div class="photo-card">
            <div class="photo">
            <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
            </div>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            ${item.likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${item.views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${item.comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${item.downloads}
                        </p>
                    </div>
            </div>
        </a>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightBox.refresh();
}

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

loadMoreBtn.addEventListener('click', onLoadMore);

async function onLoadMore() {
  page += 1;
  try {
    const response = await fetchArticles(search, page);
    images = [...images, ...response.data.hits];
    appendItems(response.data.hits);
    scroll();
    showBtn(response.data.totalHits);
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function cleanGallery() {
  gallery.innerHTML = '';
  page = 1;
  loadMoreBtn.setAttribute('hidden', true);
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
