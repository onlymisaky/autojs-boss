export function isLogout() {
  return (selector().id('cl_item').exists() && selector().id('checkbox').exists()) || (
    selector().bounds(83, 941, 997, 1416).exists()
  );
}

export function waitForLoginOut() {
  selector().id('cl_item').waitFor();
  selector().id('checkbox').waitFor();
}

export function login() {
  selector().id('cl_item').findOne().click();
  const $$tv_positive = selector().id('tv_positive').text('同意');
  $$tv_positive.waitFor();
  $$tv_positive.findOne().click();
}
