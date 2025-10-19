

export function setUp() {
  var sections = document.getElementsByClassName('commentary');
  for (const el of sections) {
    el.addEventListener('click', function (e) {
      console.log('click', el.id);
    });
  }
}