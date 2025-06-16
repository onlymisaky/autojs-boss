auto.waitFor();
console.show();

function getCurrentPanel() {
  const $rv_list_collection = selector().id('rv_list').untilFind();
  const bottom = $rv_list_collection.get(0).bounds().bottom;
  const $rv_list = $rv_list_collection.findOne(selector().boundsContains(0, 0, device.width, bottom));
  return $rv_list;
}

/**
 * @param {UiCollection} collection
 */
function findOneInCollectionById(collection, selectorId) {
  const $uiobject = collection.findOne(selector().id(selectorId));
  return $uiobject;
}

/**
 * @param {UiCollection} collection
 */
function findInCollectionById(collection, selectorId) {
  const $uicollection = collection.find(selector().id(selectorId));
  return $uicollection;
}

setInterval(() => {
  // home_tip_vf
  // tv_title
  const $uiobject = findInCollectionById(getCurrentPanel().children(), 'tv_title');
  console.log($uiobject.text());
}, 1000);
