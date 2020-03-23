import utils from "./utils.js";
import postApi from "./api/postApi.js";

const randomNumber = () => {
  const temp = Math.trunc(Math.random() * (2000 - 100));
  return 100 + temp;
};

const randomBannerImage = () => {
  const randomId = randomNumber();
  const bannerUrl = `https://picsum.photos/id/${randomId}/1368/400`;
  utils.setBackgroundImageByElementId('postHeroImage', bannerUrl);
}

const getPostFormValues = () => {
  return {
    title: utils.getValueByElementId('postTitle'),
    author: utils.getValueByElementId('postAuthor'),
    description: utils.getValueByElementId('postDescription'),
    imageUrl: utils.getBackgroundImageByElementId('postHeroImage'),
  }
}

const setPostFormValues = (getData) => {
  utils.setBackgroundImageByElementId('postHeroImage', getData.imageUrl);
  utils.setValueByElementId('postTitle', getData.title);
  utils.setValueByElementId('postAuthor', getData.author);
  utils.setValueByElementId('postDescription', getData.description);
};

const validatePostForm = (formValues) => {
  let isValid = true;

  if (formValues.title.trim() === '') {
    isValid = false;
    utils.addClassByElementId('postTitle', ['is-invalid']);
  }

  if (formValues.author.trim() === '') {
    isValid = false;
    utils.addClassByElementId('postAuthor', ['is-invalid']);
  }

  return isValid;
};

const resetValidatetionErrors = () => {
  utils.removeClassByElementId('postTitle', ['is-invalid']);
  utils.removeClassByElementId('postAuthor', ['is-invalid']);
};

const updatePost = (getData, formValues) => {
  getData.title = formValues.title;
  getData.author = formValues.author;
  getData.description = formValues.description;
  getData.imageUrl = formValues.imageUrl;
}

const handlePostFormSubmit = async (e, postId) => {
  e.preventDefault();

  resetValidatetionErrors();

  const formValues = getPostFormValues();

  // Required: title + author
  if (!postId) {
    const isValid = validatePostForm(formValues);
    if (!isValid) return;

    try {
      // Call API  to create a new post
      const post = await postApi.add(formValues);

      // Inform user: post created
      alert('Add new post successfully');

      // Redirect edit mode
      const editPostUrl = `add-edit-post.html?postId=${post.id}`;
      window.location = editPostUrl;
    } catch (error) {
      alert(`Failed to add new post: ${error}`);
    }
  } else {
    try {
      const getData = await postApi.getDetail(postId);
      if (getData.title !== formValues.title || getData.author !== formValues.author) {
        const isValid = validatePostForm(formValues);
        if (!isValid) return;

        updatePost(getData, formValues);
        await postApi.update(getData);

        alert('Update new post successfully');
      }
    } catch (error) {
      throw error;
    }
  }
}

const goToDetailPageLink = (getData) => {
  const goToDetailPageLinkElement = document.querySelector('#goToDetailPageLink');
  if (goToDetailPageLinkElement) {
    goToDetailPageLinkElement.innerHTML = `<i class="fas fa-eye mr-1"></i> View post detail`;
    goToDetailPageLinkElement.href = `post-detail.html?postId=${getData.id}`;
  };
}
// MAIN LOGIC
const init = async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');

    const mode = postId ? 'edit' : 'add';
    if (mode === 'add') {
      randomBannerImage();
    } else {
      const getData = await postApi.getDetail(postId);
      setPostFormValues(getData);
      goToDetailPageLink(getData);
    }

    // Bind events: form submit + change banner img
    const postForm = document.querySelector('#postForm');
    if (postForm) {
      postForm.addEventListener('submit', (e) => handlePostFormSubmit(e, postId));
    }

    const changePostBannerButton = document.querySelector('#postChangeImage');
    if (changePostBannerButton) {
      changePostBannerButton.addEventListener('click', randomBannerImage);
    }
  } catch (error) {
    throw error;
  }
};
init();
