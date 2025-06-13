auto.waitFor();
console.show();

setInterval(() => {
  console.log(currentPackage());
  console.log(currentActivity());
}, 1000);
