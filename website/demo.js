/* The demo card, and nothing else.
 *
 * Two behaviours, both of them the app's: pointing at a French word finds its
 * counterpart in the translation, and the pill in the card head swaps which
 * translation is on show. Neither one rewrites any text — both halves of the
 * card are already in the markup, and CSS decides what is visible.
 *
 * Written the way the parent site writes its client code: no modules, no
 * build, runs off file:// as happily as off a server. */

(function () {
  'use strict';

  var demo = document.getElementById('demo');
  if (!demo) return;

  /* A word held by a click, so the card still works on a touch screen, where
     there is no hover to speak of. Null means the highlight is only following
     a pointer. */
  var pinned = null;

  function clear() {
    var lit = demo.querySelectorAll('.word-group-highlight');
    for (var i = 0; i < lit.length; i++) lit[i].classList.remove('word-group-highlight');
  }

  /* Both halves of a pair carry the same data-wid, so lighting a pair is just
     asking for every span with that id — however the two languages happen to
     have ordered their words. */
  function highlight(wid) {
    clear();
    var pair = demo.querySelectorAll('.word-group[data-wid="' + wid + '"]');
    for (var i = 0; i < pair.length; i++) pair[i].classList.add('word-group-highlight');
  }

  function wordAt(node) {
    return node && node.closest ? node.closest('.word-group[data-wid]') : null;
  }

  demo.addEventListener('mouseover', function (e) {
    if (pinned) return;
    var word = wordAt(e.target);
    if (word) highlight(word.getAttribute('data-wid'));
  });

  /* Only let go once the pointer has actually left the word. Crossing from one
     span to the next inside the same group would otherwise flicker. */
  demo.addEventListener('mouseout', function (e) {
    if (pinned) return;
    var from = wordAt(e.target);
    if (from && wordAt(e.relatedTarget) !== from) clear();
  });

  /* Tab through the verse and the pairs light up the same way. */
  demo.addEventListener('focusin', function (e) {
    var word = wordAt(e.target);
    if (!word) return;
    pinned = null;
    highlight(word.getAttribute('data-wid'));
  });

  demo.addEventListener('click', function (e) {
    var word = wordAt(e.target);
    if (!word) return;
    var wid = word.getAttribute('data-wid');
    if (pinned === wid) {
      pinned = null;
      clear();
    } else {
      pinned = wid;
      highlight(wid);
    }
  });

  /* A tap anywhere else lets go of the pinned word. */
  document.addEventListener('click', function (e) {
    if (pinned && !demo.contains(e.target)) {
      pinned = null;
      clear();
    }
  });

  /* The language pill. A French word's counterpart differs between the two
     translations, so whatever was lit is dropped on the way over. */
  var buttons = document.querySelectorAll('.lang[data-lang]');
  for (var b = 0; b < buttons.length; b++) {
    buttons[b].addEventListener('click', function () {
      document.body.setAttribute('data-lang', this.getAttribute('data-lang'));
      for (var j = 0; j < buttons.length; j++) {
        buttons[j].setAttribute('aria-pressed', buttons[j] === this ? 'true' : 'false');
      }
      pinned = null;
      clear();
    });
  }
})();
