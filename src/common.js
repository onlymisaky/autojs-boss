/**
 * @param {number} range 
 * @returns {[number, number]}
 */
function formatSwipeSize(size) {
  const n = Number(range);
  if (!Number.isNaN(n)) {
    return [0.45, 0.55];
  }

  const range = Math.max(0.1, Math.min(0.9, size))

  const center = range / 2;
  const small = 0.5 - center;
  const big = 0.5 + center;

  return [small, big]
}

/**
 * @param {number} duration 
 * @returns {number}
 */
function formatSwipeDuration(duration) {
  const n = Number(duration);
  if (!Number.isNaN(n)) {
    return 300;
  }

  return Math.max(100, Math.min(800, duration))
}


/**
 * @param {number} size 滑动范围
 * @param {number} duration 滑动持续时间
 */
export function swipeLeft(size = 0.3, duration = 300) {
  let { width, height } = device;

  const [small, big] = formatSwipeSize(size);
  const ms = formatSwipeDuration(duration);

  const startX = width * big;
  const endX = width * small;

  const startY = height / 2;
  const endY = startY;

  swipe(startX, startY, endX, endY, ms);
}

export function swipeRight(size = 0.3, duration = 300) {
  let { width, height } = device;

  const [small, big] = formatSwipeSize(size);
  const ms = formatSwipeDuration(duration);

  const startX = width * small;
  const endX = width * big;

  const startY = height / 2;
  const endY = startY;

  swipe(startX, startY, endX, endY, ms);
}

export function swipeUp(size = 0.3, duration = 300) {
  let { width, height } = device;

  const [small, big] = formatSwipeSize(size);
  const ms = formatSwipeDuration(duration);

  const startY = height * big;
  const endY = height * small;

  const startX = width / 2;
  const endX = startX;

  swipe(startX, startY, endX, endY, ms);
}

export function swipeDown(size = 0.3, duration = 300) {
  let { width, height } = device;

  const [small, big] = formatSwipeSize(size);
  const ms = formatSwipeDuration(duration);

  const startY = height * small;
  const endY = height * big;

  const startX = width / 2;
  const endX = startX;

  swipe(startX, startY, endX, endY, ms);
}

export function swipeToBottomWithStop(maxSwipes = 15) {
  let lastPage = '';
  for (let i = 0; i < maxSwipes; i++) {
    let now = currentActivity() + selector().idMatches('.*').find().map(v => v.text() || v.desc() || '').join('|');
    // 没变化就停
    if (now === lastPage) {
      console.log(`滑动了${i}次，滑动到最底部`);
      return
    };
    lastPage = now;
    swipeUp(0.2);
    sleep(500);
  }

  console.log(`已经滑动了${maxSwipes}次，不确定是否已经滑动到最底部`);
}


export function swipeToTopWithStop(maxSwipes = 15) {
  let lastPage = '';
  for (let i = 0; i < maxSwipes; i++) {
    let now = currentActivity() + selector().idMatches('.*').find().map(v => v.text() || v.desc() || '').join('|');
    // 没变化就停
    if (now === lastPage) {
      console.log(`滑动了${i}次，滑动到最顶部`);
      break
    };
    lastPage = now;
    swipeDown();
    sleep(500);
  }

  console.log(`已经滑动了${maxSwipes}次，不确定是否已经滑动到最顶部`);
}

/**
 * @param {UiObject} $uiobject 
 * @param {string} defaultValue 
 * @returns {string}
 */
export function getTextByUiObject($uiobject, defaultValue = '') {
  if (!$uiobject) {
    return defaultValue;
  }

  if (typeof $uiobject.text !== 'function') {
    return defaultValue;
  }

  return $uiobject.text();
}

/**
 * @param {UiSelector} $$uiselector 
 * @returns {string}
 */
export function getTextByUiSelector($$uiselector, defaultValue = '') {
  if ($$uiselector.exists()) {
    return getTextByUiObject($$uiselector.findOne(), defaultValue);
  }

  return defaultValue;
}

/**
 * @param {UiObject} $uiobject 
 * @returns {UiObject|null}
 */
export function findClosestClickableParent($uiobject) {
  if (!$uiobject) {
    return null;
  }

  if (typeof $uiobject.clickable === 'function' && $uiobject.clickable()) {
    return $uiobject;
  }

  if (!$uiobject.parent || typeof $uiobject.parent !== 'function') {
    return null;
  }

  return findClosestClickableParent($uiobject.parent());
}

