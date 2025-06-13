/**
 * @param {number} size
 * @returns {[number, number]} 滑动区间
 */
function formatSwipeSize(size) {
  const n = Number(size);
  if (Number.isNaN(n)) {
    return [0.45, 0.55];
  }

  const range = Math.max(0.1, Math.min(0.9, size));

  const center = range / 2;
  const small = 0.5 - center;
  const big = 0.5 + center;

  return [small, big];
}

/**
 * @param {number} duration
 */
function formatSwipeDuration(duration) {
  const n = Number(duration);
  if (Number.isNaN(n)) {
    return 300;
  }

  return Math.max(100, Math.min(800, duration));
}

/**
 * @param {number} duration
 */
function formatSwipeSleep(duration, sleepMs) {
  const n = Number(sleepMs);
  if (Number.isNaN(n)) {
    return duration + 100;
  }

  return Math.min(duration, sleepMs);
}

/**
 * @param {number} size 滑动范围
 * @param {number} duration 滑动持续时间
 */
export function swipeLeft(size = 0.3, duration = 300, sleepMs = duration) {
  const { width, height } = device;

  const [small, big] = formatSwipeSize(size);
  const ms = formatSwipeDuration(duration);

  const startX = width * big;
  const endX = width * small;

  const startY = height / 2;
  const endY = startY;

  swipe(startX, startY, endX, endY, ms);

  const sleepTime = formatSwipeSleep(ms, sleepMs);
  sleep(sleepTime);
}

export function swipeRight(size = 0.3, duration = 300, sleepMs = duration) {
  const { width, height } = device;

  const [small, big] = formatSwipeSize(size);
  const ms = formatSwipeDuration(duration);

  const startX = width * small;
  const endX = width * big;

  const startY = height / 2;
  const endY = startY;

  swipe(startX, startY, endX, endY, ms);

  const sleepTime = formatSwipeSleep(ms, sleepMs);
  sleep(sleepTime);
}

export function swipeUp(size = 0.3, duration = 300, sleepMs = duration) {
  const { width, height } = device;

  const [small, big] = formatSwipeSize(size);
  const ms = formatSwipeDuration(duration);

  const startY = height * big;
  const endY = height * small;

  const startX = width / 2;
  const endX = startX;

  swipe(startX, startY, endX, endY, ms);

  const sleepTime = formatSwipeSleep(ms, sleepMs);
  sleep(sleepTime);
}

export function swipeDown(size = 0.3, duration = 300, sleepMs = duration) {
  const { width, height } = device;

  const [small, big] = formatSwipeSize(size);
  const ms = formatSwipeDuration(duration);

  const startY = height * small;
  const endY = height * big;

  const startX = width / 2;
  const endX = startX;

  swipe(startX, startY, endX, endY, ms);

  const sleepTime = formatSwipeSleep(ms, sleepMs);
  sleep(sleepTime);
}

/**
 * @param {number} maxSwipes
 * @param {'fast'|'slow'|'middle'} speed
 */
export function swipeToBottomWithStop(maxSwipes = 15, speed = 'fast') {
  let lastPage = '';
  for (let i = 0; i < maxSwipes; i++) {
    const now = currentActivity() + selector().idMatches('.*').find().map(v => v.text() || v.desc() || '').join('|');
    // 没变化就停
    if (now === lastPage) {
      return;
    }
    lastPage = now;
    const size = { fast: 0.8, slow: 0.2, middle: 0.5 }[speed] || 0.5;
    swipeUp(size);
  }

  console.log(`已经滑动了${maxSwipes}次，不确定是否已经滑动到最底部`);
}

/**
 * @param {number} maxSwipes
 * @param {'fast'|'slow'|'middle'} speed
 */
export function swipeToTopWithStop(maxSwipes = 15, speed = 'fast') {
  let lastPage = '';
  for (let i = 0; i < maxSwipes; i++) {
    const now = currentActivity() + selector().idMatches('.*').find().map(v => v.text() || v.desc() || '').join('|');
    // 没变化就停
    if (now === lastPage) {
      return;
    }
    lastPage = now;
    const size = { fast: 0.8, slow: 0.2, middle: 0.5 }[speed] || 0.5;
    swipeDown(size);
  }

  console.log(`已经滑动了${maxSwipes}次，不确定是否已经滑动到最顶部`);
}

/**
 * @param {UiObject} $uiobject
 * @param {string} defaultValue
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
 */
export function getTextByUiSelector($$uiselector, defaultValue = '') {
  if ($$uiselector.exists()) {
    return getTextByUiObject($$uiselector.findOne(), defaultValue);
  }

  return defaultValue;
}

/**
 * @param {UiObject} $uiobject
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

/**
 * @param {string} activityName
 * @param {number} period
 * @returns {boolean} 是否成功离开指定 Activity
 */
export function waitForLeaveActivity(activityName, period = 200) {
  const now = Date.now();

  const maxWaitMs = Infinity;

  try {
    while (currentActivity() === activityName) {
      if (Date.now() - now > maxWaitMs) {
        console.log(`等待离开 ${activityName} 超时`);
        return false;
      }
      sleep(period);
    }
    return true;
  }
  catch (error) {
    console.error(`等待离开 ${activityName} 时发生错误:`, error);
    return false;
  }
}
