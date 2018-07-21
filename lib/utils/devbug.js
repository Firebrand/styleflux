const chalk = require('chalk');
const {
  debugmode,
} = require('../../package.json');


const colors = {
  RED: 'red',
  GREEN: 'green',
  YELLOW: 'yellow',
  BLUE: 'blue',
  GRAY: 'gray',
  PURPLE: 'magenta',
  CYAN: 'cyan',
  WHITE: 'white',
};


const _echoOutput = (description, valueToOutput, color) => {
  const char = '-';
  const desc = `---------- ${description} (${valueToOutput.length}) ----------`;
  console.log(chalk.keyword(color)(desc));

  let output = valueToOutput;

  if (typeof valueToOutput === 'object') {
    output = JSON.stringify(valueToOutput);
  }

  console.log(chalk.keyword(color)(output));

  console.log(chalk.keyword(color)(char.repeat(desc.length)));
  console.log('\n');
};

const msg = (description, valueToOutput, color = colors.GREEN) => {
  if (typeof valueToOutput !== 'undefined') {
    _echoOutput(description, valueToOutput, color);
  }
};


const dbg = (description, valueToOutput, color = colors.WHITE) => {
  if (typeof valueToOutput !== 'undefined' && debugmode === 'true') {
    _echoOutput(description, valueToOutput, color);
  }
};


module.exports = {
  dbg,
  msg,
  colors,
};
