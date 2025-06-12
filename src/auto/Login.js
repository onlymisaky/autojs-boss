export function isLogout() {
  return (selector().id('cl_item').exists() && selector().id('checkbox').exists()) || (
    selector().bounds(83, 941, 997, 1416).exists()
  )
}

export function waitForLoginOut() {
  selector().id('cl_item').waitFor()
  selector().id('checkbox').waitFor()
}

export function login() {
  selector().id('cl_item').findOne().click();
  selector().id('tv_positive').untilFind().get(0).click()
}
