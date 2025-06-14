export function isLogout() {
  return (selector().id('cl_item').exists() && selector().id('checkbox').exists());
}

export function waitForLoginOut() {
  selector().id('cl_item').waitFor();
  selector().id('checkbox').waitFor();
}

export function login() {
  selector().id('cl_item').findOne().click();
  selector().id('tv_positive').text('同意').findOne().click();
  // const $$tv_positive = selector().id('tv_positive').text('同意');
  // $$tv_positive.waitFor();
  // $$tv_positive.findOne().click();
}
