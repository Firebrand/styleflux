const { assert } = require('chai');
const parser = require('../../lib/components/sassParser');


describe('CSS Parts Processing', () => {
  it('Process Head', () => {
    const head = parser._processCssHead('.post h1 + p:first-line > .class1 > body > div.post > div#sidebar > h2[class*=post]:hover');
    const correctHead = '".post":{"h1":{"+p":{"&:first-line":{">.class1":{">body":{">div":{"&.post":{">div#sidebar":{">h2[class*=post]":{"&:hover"';

    assert.equal(head, correctHead);
  });

  it('Process Body', () => {
    const body = parser._processCssBody(`transform: scale(1.5); 
    -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=1.5, M12=0, M21=0, M22=1.5, SizingMethod='auto expand')";
    background: url("http://www.mentisology.org/wp-content/uploads/2015/07/balloons-beach-beauty-freedom-happiness-Favim.com-268585.jpg");
    font-size:20px;
    transition: all 1s ease;
    background: rgba(205,205,205, 1);`);

    const correctBody = `"transform":"scale(1.5)","-ms-filter":"\\"progid:DXImageTransform.Microsoft.Matrix(M11=1.5, M12=0, M21=0, M22=1.5, SizingMethod='auto expand')\\"","background":"url(\\"http://www.mentisology.org/wp-content/uploads/2015/07/balloons-beach-beauty-freedom-happiness-Favim.com-268585.jpg\\")","font-size":"20px","transition":"all 1s ease","background":"rgba(205,205,205, 1)"`;

    assert.equal(body, correctBody);
  });
});
