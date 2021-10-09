const readline = require('readline');
const http = require('http');
let host = '';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question1 = () => {
  return new Promise((resolve, reject) => {
    rl.question('On which connection you want to connect?', (answer) => {
      host = answer;
      resolve();
    });
  });
};

const question2 = () => {
  return new Promise((resolve, reject) => {
    rl.question('How many clients we want to create?', (answer) => {
      let ans = Number(answer);
      http.get(`${host}/createClients/${ans}`, () => {
        resolve();
      });
    });
  });
};

const question3 = () => {
  return new Promise((resolve, reject) => {
    rl.question('Seconds? ', (answer) => {
      const interval = Number(answer);
      http.get(`${host}/setInterval/${interval}`, () => {
        resolve();
      });
    })
  })
}

const main = async () => {
  await question1();
  await question2();
  await question3();
  main();
}

main();