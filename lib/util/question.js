var readline = require('readline')

module.exports = function question (arr, callback, answers, rl) {
  if (!answers) {
    answers = []
  }
  if (!rl) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }
  if (arr && arr.length > 0) {
    var q = arr.shift()
    rl.question(q, function(answer) {
      answers.push(answer)
      question(arr, callback, answers, rl)
    })
  } else {
    rl.close();
    callback(answers);
  }
}
