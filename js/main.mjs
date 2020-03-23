'use strict';
import postApi from './api/postApi.js';
import utils from './utils.js';
import anime from '../anime-master/lib/anime.es.js';

const handleCard = (post) => {
  window.location = `post-detail.html?postId=${post.id}`;
};

const handleEditButton = (e, post) => {
  e.stopPropagation();
  window.location = `add-edit-post.html?postId=${post.id}`;
};

const handleRemoveButton = (e, post, postsListElement, postsItemElement) => {
  const confirmMessage = `Are you sure to delete!`;
  if (window.confirm(confirmMessage)) {
    postsListElement.removeChild(postsItemElement);
    postApi.remove(post.id);
    e.stopPropagation();
  }
};

const buildPostsList = (post) => {
  const postItemTemplate = document.querySelector('#postItemTemplate');
  if (!postItemTemplate) return null;

  const postsItemFragment = postItemTemplate.content.cloneNode(true);

  const postsListElement = postsItemFragment.querySelector('li');
  postsListElement.classList.add('animes');
  anime({
    targets: '.animes',
    scale: [0.8, 1],
    opacity: 1,
    delay: function (el, i, l) { return i * 100; },
    direction: 'alternate',
    duration: 1000,
    loop: false,
  });

  if (postsListElement) {

    const postItemImage = postsItemFragment.querySelector('#postItemImage');
    if (postItemImage) {
      postItemImage.src = post.imageUrl;
    };

    const postItemTitle = postsItemFragment.querySelector('#postItemTitle');
    if (postItemImage) {
      postItemTitle.innerText = utils.truncateTextlength(post.title, 25);
    };

    const postItemAuthor = postsItemFragment.querySelector('#postItemAuthor');
    if (postItemAuthor) {
      postItemAuthor.innerText = post.author;
    };

    const postItemDescription = postsItemFragment.querySelector('#postItemDescription');
    if (postItemDescription) {
      postItemDescription.innerText = utils.truncateTextlength(post.description, 90);

    };

    const postItemTimeSpan = postsItemFragment.querySelector('#postItemTimeSpan');
    if (postItemTimeSpan) {
      const dateString = utils.formatDate(post.createdAt);
      postItemTimeSpan.innerText = dateString;
    };

    const postItem = postsItemFragment.querySelector('#postItem');
    if (postItem) {
      postItem.addEventListener('click', () => handleCard(post));
    }

    const postItemEdit = postsItemFragment.querySelector('#postItemEdit');
    if (postItemEdit) {
      postItemEdit.addEventListener('click', (e) => handleEditButton(e, post));
    }

    const postItemRemove = postsItemFragment.querySelector('#postItemRemove');
    if (postItemRemove) {
      postItemRemove.addEventListener('click', (e) => handleRemoveButton(e, post, postsListElement, postsItemFragment));
    }
  }
  return postsListElement;
};


const removeAttrClass = (liPaginationList) => {
  for (const liElement of liPaginationList) {
    liElement.classList.remove('active');
  }
}

const activeCurPage = (liPaginationList, maxPage) => {
  const params = new URLSearchParams(window.location.search);
  const curPage = Number(params.get('_page'));
  if (curPage === 1 || !curPage) {
    liPaginationList[1].classList.add('active');
  } else if (curPage === maxPage) {
    if (curPage > 2) {
      liPaginationList[3].classList.add('active');
    } else {
      liPaginationList[2].classList.add('active');
    }
  }
  else {
    liPaginationList[2].classList.add('active');
  }
}

const setHrefNotCurPage = (aPaginationList, liPaginationList, objValidate) => {
  const page = 1;
  if (objValidate.maxPage > 0) {
    aPaginationList[1].href = `index.html?_page=${page}&_limit=6`;
    aPaginationList[1].removeAttribute('hidden');
    aPaginationList[1].innerText = page;
  }

  if (objValidate.maxPage > 1) {
    aPaginationList[2].href = `index.html?_page=${page + 1}&_limit=6`;
    aPaginationList[2].removeAttribute('hidden');
    aPaginationList[2].innerText = page + 1;

    aPaginationList[3].href = `index.html?_page=${page + 1}&_limit=6`;
    liPaginationList[4].classList.remove('disabled');
  }

  if (objValidate.maxPage > 2) {
    aPaginationList[3].href = `index.html?_page=${page + 2}&_limit=6`;
    aPaginationList[3].removeAttribute('hidden');
    aPaginationList[3].innerText = page + 2;

    aPaginationList[4].href = `index.html?_page=${page + 1}&_limit=6`;
    liPaginationList[4].classList.remove('disabled');
  }
}

const setHrefAtMaxPage = (aPaginationList, liPaginationList, objValidate) => {
  const page = objValidate.curPage;

  if (objValidate.maxPage > 1) {
    aPaginationList[2].href = `index.html?_page=${page}&_limit=6`;
    aPaginationList[2].removeAttribute('hidden');
    aPaginationList[2].innerText = page;

    aPaginationList[0].href = `index.html?_page=${page - 1}&_limit=6`;
    liPaginationList[0].classList.remove('disabled');

    liPaginationList[4].classList.add('disabled');
  }

  if (objValidate.maxPage > 2) {
    aPaginationList[3].href = `index.html?_page=${page}&_limit=6`;
    aPaginationList[3].removeAttribute('hidden');
    aPaginationList[3].innerText = page;

    aPaginationList[2].href = `index.html?_page=${page - 1}&_limit=6`;
    aPaginationList[2].removeAttribute('hidden');
    aPaginationList[2].innerText = page - 1;

    aPaginationList[1].href = `index.html?_page=${page - 2}&_limit=6`;
    aPaginationList[1].removeAttribute('hidden');
    aPaginationList[1].innerText = page - 2;

    aPaginationList[0].href = `index.html?_page=${page - 1}&_limit=6`;
    liPaginationList[0].classList.remove('disabled');
    liPaginationList[4].classList.add('disabled');
  }
};

const setHrefMidMaxPage = (aPaginationList, liPaginationList, objValidate) => {
  const page = objValidate.curPage;

  aPaginationList[3].href = `index.html?_page=${page + 1}&_limit=6`;
  aPaginationList[3].removeAttribute('hidden');
  aPaginationList[3].innerText = page + 1;

  aPaginationList[2].href = `index.html?_page=${page}&_limit=6`;
  aPaginationList[2].removeAttribute('hidden');
  aPaginationList[2].innerText = page;

  aPaginationList[1].href = `index.html?_page=${page - 1}&_limit=6`;
  aPaginationList[1].removeAttribute('hidden');
  aPaginationList[1].innerText = page - 1;

  aPaginationList[0].href = `index.html?_page=${page - 1}&_limit=6`;
  aPaginationList[4].href = `index.html?_page=${page + 1}&_limit=6`;

  liPaginationList[0].classList.remove('disabled');
  liPaginationList[4].classList.remove('disabled');
}

const renderPagination = async (maxPage) => {
  try {
    let newPostList = null;
    const params = new URLSearchParams(window.location.search);
    const curPage = Number(params.get('_page'));
    const aPaginationList = document.querySelectorAll('a.page-link');
    const liPaginationList = document.querySelectorAll('li.page-item');
    const objValidate = {
      curPage: curPage,
      maxPage: maxPage,
    };

    if (maxPage < 1) return;
    else {
      if (!curPage || curPage === 1) {
        removeAttrClass(liPaginationList);
        setHrefNotCurPage(aPaginationList, liPaginationList, objValidate);
        newPostList = (await postApi.getAll({ _page: 1, _limit: 6 })).data;
        activeCurPage(liPaginationList, maxPage);
      }
      else if (curPage === maxPage) {
        removeAttrClass(liPaginationList);
        setHrefAtMaxPage(aPaginationList, liPaginationList, objValidate);
        const params = new URLSearchParams(window.location.search);
        const page = Number(params.get('_page'));
        newPostList = (await postApi.getAll({ _page: page, _limit: 6 })).data;
        activeCurPage(liPaginationList, maxPage);
      }
      else {
        removeAttrClass(liPaginationList);
        setHrefMidMaxPage(aPaginationList, liPaginationList, objValidate);
        const params = new URLSearchParams(window.location.search);
        const page = Number(params.get('_page'));
        newPostList = (await postApi.getAll({ _page: page, _limit: 6 })).data;
        activeCurPage(liPaginationList, maxPage);
      }
    }
    return newPostList;
  } catch (error) {
    throw error;
  }
};

const showPostsPagination = () => {
  const postsPaginationElement = document.querySelector('#postsPagination');
  if (postsPagination) {
    postsPaginationElement.removeAttribute('hidden');
  }
};

// -----------------------
// MAIN LOGIC
// -----------------------

const init = async () => {
  try {
    const postList = await postApi.getAll({ _page: '', _limit: '' });
    const maxPage = Math.ceil(postList.length / 6);
    const newPostList = await renderPagination(maxPage);

    const postsListElement = document.getElementById('postsList');
    if (postsListElement) {
      for (let post of newPostList) {
        const postsItemElement = buildPostsList(post);
        postsListElement.appendChild(postsItemElement);
      }
    }

    showPostsPagination();
  } catch (error) {
    console.log(error);
  }
}
init();
