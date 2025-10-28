// Control logic for commentary pages

export function setUpCommentary(options) {
  const commentaryElements = document.querySelectorAll(".commentary");
  commentaryElements.forEach(el => el.style = 'display: none;');
  const commentaryIds = Array.from(commentaryElements).map(el => el.id);

  var commentaryIndex = 0;
  var commentaryId = commentaryIds[commentaryIndex];

  const prevButtons = document.querySelectorAll('.prev-button');
  const prevLabels = document.querySelectorAll('.prev-label');
  const nextButtons = document.querySelectorAll('.next-button');
  const nextLabels = document.querySelectorAll('.next-label');

  function _update(newIndex) {
    const oldId = commentaryId;
    commentaryIndex = newIndex;
    commentaryId = commentaryIds[commentaryIndex];

    document.querySelector('#' + oldId).style.display = 'none';
    document.querySelector('#' + commentaryId).style.display = '';

    if (commentaryIndex > 0) {
      prevButtons.forEach(el => el.style.display = '');
      prevLabels.forEach(el => el.textContent = document.querySelector(
        '#' + commentaryIds[commentaryIndex - 1]).querySelector('h1').textContent);
    } else {
      prevButtons.forEach(el => el.style.display = 'none');
    }

    if (commentaryIndex + 1 < commentaryIds.length) {
      nextButtons.forEach(el => el.style.display = '');
      nextLabels.forEach(el => el.textContent = document.querySelector(
        '#' + commentaryIds[commentaryIndex + 1]).querySelector('h1').textContent);
    } else {
      nextButtons.forEach(el => el.style.display = 'none');
    }

    if (options.onUpdate) {
      options.onUpdate(oldId, commentaryId);
    }
  }

  function onPrev() {
    _update((commentaryIndex - 1 + commentaryIds.length) % commentaryIds.length);
  }

  function onNext() {
    _update((commentaryIndex + 1) % commentaryIds.length);
  }

  prevButtons.forEach(el => el.addEventListener('click', onPrev));
  nextButtons.forEach(el => el.addEventListener('click', onNext));

  _update(0);

  return {
    update: () => { _update(commentaryIndex); }
  }
}
