const {
  dbg,
  msg,
  colors,
} = require('../utils/devbug');
const _ = require('lodash');
const perfectionist = require('perfectionist');
const namer = require('color-namer');
const sass = require('node-sass');

const _colorObj = {};
let _mainSCSS = '';

const _cssToSingleLine = contents => contents.replace(/^\s*\/\/.*/gm, '').replace(/\/\*.*\*\//g, '').replace(/(?:\r\n|\r|\n)/g, '');

const _processCssHead = (headContent) => {
  const trimmedHead = headContent.trim();
  let parsedHeadContent = trimmedHead;

  if (trimmedHead.substr(0, 6) !== '@media') {
    parsedHeadContent = trimmedHead
      .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/g, '')
      .replace(/"/g, '\\"')
      .replace(/([^\s])(\.)([^\s])/g, '$1{&$2$3')
      .replace(/(\s*::\s*)(?=([^\(]*\([^\(\)]*\))*[^\)]*$)/g, '{&:')
      .replace(/([^&])\s*:\s*(?=([^\(]*\([^\(\)]*\))*[^\)]*$)/g, '$1{&:')
      .replace(/(\s*>\s*)/g, '{>')
      .replace(/(\s*\+\s*)/g, '{+')
      .replace(/\s(?=([^"]*"[^"]*")*[^"]*$)/g, '{')
      .replace(/(\s*{\s*)/g, '":{"');
  }

  return `"${parsedHeadContent}"`;
};


const _processCssBody = (bodyContent) => {
  const bodyContentArr = bodyContent.replace(/(\s*;\s*)(?=([^\(]*\([^\(\)]*\))*[^\)]*$)/g, '~').split('~');
  dbg('bodyContentArr', bodyContentArr, colors.CYAN);
  let cumulator = '';

  bodyContentArr.forEach((attribute) => {
    if (attribute.length > 1) {
      const pullColorVar = attribute.match(/[^0-9A-Za-z]+(#[0-9A-Fa-f]{3,6})/);
      let modAttribute = attribute;

      if (pullColorVar != null) {
        const colorVar = pullColorVar[1];
        const colorName = namer(colorVar).html[0].name + colorVar.replace('#', '_');
        _colorObj[`$${colorName}`] = `${colorVar}`;
        modAttribute = attribute.replace(/([^0-9A-Za-z]+)(#[0-9A-Fa-f]{3,6})/, `$1$${colorName}`);
      }

      cumulator += `"${modAttribute.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/(\s*;\s*)(?=([^\(]*\([^\(\)]*\))*[^\)]*$)/g, '","').replace(/(\s*:\s*)/, '":"')
        .trim()}",`;
    }
  });

  return cumulator.substr(0, cumulator.length - 1);
};


const _cssToArray = (css) => {
  let level = 0;
  let cumuloString = '';
  const cssArray = [];


  for (let i = 0; i <= css.length; i++) {
    const char = css[i];
    cumuloString += char;
    if (char === '{') {
      level += 1;
    } else if (char === '}') {
      level -= 1;
      if (level === 0) {
        cssArray.push(cumuloString);
        cumuloString = '';
      }
    }
  }

  return cssArray;
};


const _cssarrayToObject = (fileContentsArr) => {
  const mainObject = {};

  fileContentsArr.forEach((value) => {
    const head = value.match(/(.*?){/)[1];
    dbg('Head: ', head, colors.GREEN);
    const tail = value.match(/{(.*)}/)[1];
    dbg('Tail: ', tail, colors.BLUE);

    const dividedHead = head.split(',');

    dividedHead.forEach((headvalue) => {
      if (head.length > 0) {
        const cleanHeadValue = headvalue.trim();

        let processedHead = _processCssHead(cleanHeadValue);
        let processedBody = '';

        if (processedHead.substr(0, 2) === '"@') {
          processedHead = `"${cleanHeadValue}"`;
          processedBody = JSON.stringify(_cssarrayToObject(_cssToArray(tail)));
          processedBody = processedBody.substr(1, processedBody.length - 2);
        } else {
          processedBody = _processCssBody(tail);
        }

        dbg('----------JSON ready Head: ', processedHead, colors.GREEN);

        dbg('----------JSON ready Body: ', processedBody, colors.BLUE);


        const closingBracketsInHead = (processedHead.match(/{/g) || []).length;

        const completeClause = `${processedHead}:{${processedBody}${'}'.repeat(closingBracketsInHead + 1)}`;


        const objectClause = JSON.parse(`{${completeClause}}`);
        _.merge(mainObject, objectClause);
      }
    });
  });

  return mainObject;
};


const _objectContainsObject = (objectVal) => {
  let containsObject = false;
  const keychain = Object.keys(objectVal);

  keychain.forEach((key) => {
    if (typeof objectVal[key] === 'object') containsObject = true;
  });

  return containsObject;
};


const _cssObjectToCss = (contentObject) => {
  const keychain = Object.keys(contentObject);


  if (!_objectContainsObject(contentObject)) {
    keychain.sort();
  }

  keychain.forEach((key) => {
    if (typeof contentObject[key] === 'object') {
      _mainSCSS += `${key}{`;
      _cssObjectToCss(contentObject[key]);
      _mainSCSS += '}';
    } else {
      _mainSCSS += `${key}:${contentObject[key]};`;
    }
  });
};


const _objToKeyValueCss = (objectVal) => {
  if (typeof objectVal === 'object') {
    const keychain = Object.keys(objectVal);

    if (keychain.length > 0) {
      keychain.sort();

      let stringOutput = '';

      keychain.forEach((key) => {
        stringOutput += `${key}:${objectVal[key]};`;
      });


      return stringOutput;
    }
  }
  return '';
};


const convertCssToObject = (cssContent) => {
  let plainCss;
  try {
    plainCss = sass.renderSync({
      data: cssContent,
    }).css.toString();
  } catch (error) {
    msg('Error', 'The source CSS is not valid', colors.RED);
  }
  const singleLineCss = _cssToSingleLine(plainCss);
  dbg('singleLineCss', singleLineCss, colors.YELLOW);
  const cssArray = _cssToArray(singleLineCss);
  dbg('cssArray', cssArray, colors.PURPLE);
  try {
    return _cssarrayToObject(cssArray);
  } catch (error) {
    msg('Error', 'There was a problem converting the CSS to an Object', colors.RED);
  }

  return true;
};


const convertCssToScss = (cssContent) => {
  const cssObject = convertCssToObject(cssContent);
  _cssObjectToCss(cssObject);
  const colorVars = _objToKeyValueCss(_colorObj);
  const completedProcessing = colorVars + _mainSCSS;
  const cleanResult = perfectionist.process(completedProcessing, { indentSize: 2, colorShorthand: false });
  return cleanResult.css;
};


module.exports = {
  _processCssHead, _processCssBody, convertCssToObject, convertCssToScss,
};
