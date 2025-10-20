// example5_script.js
// 以巢狀 for 產生 1~9 的乘法表

var start = parseInt(prompt("請輸入乘法表起始數："));
var end = parseInt(prompt("請輸入乘法表結束數："));

var output = '';
if (!isNaN(start) && !isNaN(end) && start <= end) {
  for (var i = start; i <= end; i++) {
    for (var j = 1; j <= 9; j++) {
      output += i + 'x' + j + '=' + (i * j) + '\t';
    }
    output += '\n';
  }
}
document.getElementById('result').textContent = output;
