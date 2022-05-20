const name = 'Hisheng';

export const User = {
  name,
  age: 21
};

export const showUser = (user) => {
  const { name, age } = user;
  console.log(`I am ${name}, ${age} years old.`);
}

showUser(User);

export function sum(...nums) {
  return nums.reduce((total, cur) => {
    return total + cur;
  }, 0);
}