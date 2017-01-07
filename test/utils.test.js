/**
 * Created by renatewr on 17/07/14.
 */

/* jshint node: true, strict: true */
/* global describe: true, before: true */


const assert = require('chai').assert;
  // expect = require('chai').expect,
const jsdom = require('jsdom');
const utils = require('../browser/utils.js');


describe('utils.attributeToArray()', () => {
  describe('class="foo bar xyz"', () => {
    before(function () {
      const fragment = jsdom.jsdom('<div id="root" class="foo bar xyz">text</div>', {});
      this.result = utils.attributeToArray(fragment.getElementById('root'), 'class');
    });

    it('should return an array', function () {
      assert.isArray(this.result);
    });

    it('should return an array with the length of 3', function () {
      assert.equal(3, this.result.length);
    });

    it('should return an array with "foo" at index 0', function () {
      assert.equal('foo', this.result[0]);
    });

    it('should return an array with "bar" at index 1', function () {
      assert.equal('bar', this.result[1]);
    });

    it('should return an array with "xyz" at index 2', function () {
      assert.equal('xyz', this.result[2]);
    });
  });
});

describe('utils.removeClass foo if an element has class foo', () => {
  it('should remove class foo', (done) => {
    const result = '<div id="root"><a class="slides"></a><a class="slides"></a><a class="slides"></a></div>';

    jsdom.env('<div id="root"><a class="slides"></a><a class="slides"></a><a class="foo slides"></a></div>', (error, window) => {
      const elements = Array.prototype.slice.call(window.document.getElementsByClassName('foo'));

      for (let i = 0; i < elements.length; i += 1) {
        utils.removeClass(elements[i], 'foo');
      }
      const element = window.document.getElementById('root');
      assert.equal(result, element.outerHTML);
      done();
    });
  });
});

describe('utils.addClass foo if an element does not have class foo', () => {
  it('should remove class foo', (done) => {
    const result = '<div id="root"><a class="slides foo"></a><a class="slides foo"></a></div>';

    jsdom.env('<div id="root"><a class="slides"></a><a class="slides"></a></div>', (error, window) => {
      const elements = Array.prototype.slice.call(window.document.getElementsByClassName('slides'));

      for (let i = 0; i < elements.length; i += 1) {
        utils.addClass(elements[i], 'foo');
      }
      const element = window.document.getElementById('root');
      assert.equal(result, element.outerHTML);
      done();
    });
  });
});

describe('utils.extractDate', () => {
  it('returns a date', () => {
    const mock = { took: 2, timed_out: false, _shards: { total: 5, successful: 5, failed: 0 }, hits: { total: 7, max_score: null, hits: [{ _index: 'zett', _type: 'ads', _id: '660438', _score: null, fields: { publishToTime: ['2006-09-07T21:59:59+0000'], systemModifiedTime: ['2006-09-08T02:00:05+0000'], 'attributes.name': ['employerdescription', 'text', 'workhours', 'workarea', 'employer', 'positiontitle', 'positioncount', 'employerhomepage', 'worksector', 'engagementtype', 'applicationdue', 'applicationmail', '_importsourcefile', 'mapcoordinatex', 'mapcoordinatey', 'mapclienturl', 'mappreviewurl'], category: ['Stilling/Stilling ledig'], title: ['Spesialsykepleiere'], 'media.reference': ['bf/4b/bf4b34d9a034a971e18d2a08ae451fff'], objectId: [660438], publishFromTime: ['2006-08-17T22:00:00+0000'], 'attributes.value': ['Helse Nordmøre og Romsdal HF omfatter Molde sjukehus, Kristiansund sykehus og den øvrige spesialisthelsetjenesten i Nordmøre og Romsdal.<br/><br/>Helseforetaket yter helsetjenester innenfor et bredt spekter. Foretaket har et samlet budsjett på 1,4 miliarder kroner og totalt vel 2.500 ansatte.', '<html>\n<head>\n<link href="http://pdf2zettsrv/pdf2zetteditor.css" type=text/css rel=stylesheet>\n</head>\n<body>\n<p>\nAkuttmedisinsk avdeling Intensivenheten, Kristiansund sykehus Enheten er en felles intensiv for b&#229;de medisin, kirurgi, hjerteoverv&#229;kning og postoperativ. Arbeid i et faglig interessant, travelt og trivelig milj&#248;.\n</p>\n<p>\nVi har et godt arbeidsmilj&#248;, tilbyr oppl&#230;ringstid. I tillegg har vi 1 undervisningsdag pr. 12 ukers turnus. Fagutviklingssykepleier er ogs&#229; ansatt i enheten.\n</p>\n<h1>Spesialsykepleiere i intensivsykepleie\n</h1>\n<p>\nNr. id. 441 \n</p>\n<p>\nVi &#248;nsker oss flere spesialsykepleiere i intensivsykepleie med interesse for fagfeltet.<br>\nVidere &#248;nsker vi at du har engasjement og er villig til &#229; v&#230;re med p&#229; &#229; utvikle avdelingen i en positiv retning.\n</p>\n<p>\nN&#230;rmere opplysninger gis ved henvendelse til \n</p>\n<p>\navdelingssykepleier Ola Dagfinn Boksasp, tlf. 71 12 15 04, eller stedfortreder.\n</p>\n<p>\nS&#248;knad sendes elektronisk via <a href="http://www.jobbnor.no">www.jobbnor.no</a>\n<br>\n- hvor du ogs&#229; finner fullstendig tekst.\n</p>\n<p>\n<strong>S&#248;knadsfrist: 7. september 2006</strong>\n</p>\n</body>\n</html>\n<br/>', 'Heltid', 'Helse, Sykepleie, Sosial og Omsorg', 'Helse Nordmøre og Romsdal HF', 'Spesialsykepleiere', '1', 'http://www.jobbnor.no', 'Privat', 'Engasjement', '7. september', 'www.jobbnor.no', '/usr/local/import/archive/zojobs/2006/08/0ecce9d1-5b08-4e80-b012-1c8d465f0810.xml', '7019892.0', '138322.75', 'http://zett.gisline.no/ZettBrowser/map.aspx?x=7019892&y=138322,75&scale=10800&title=', 'http://zett.gisline.no/zettpreviews/0818/546a4a95-c42a-488f-bd8b-4c8cda586251.png'] }, sort: [1155852000000] }] } };
    assert.equal(utils.createDate(mock.hits.hits[0].fields.systemModifiedTime), '1157680805000');
  });
});

describe('Returning the corresponding value based on attribute name in json object', () => {
  describe('Period formatted', () => {
    it('returns 1.999.999 if value is 1999999', () => {
      assert.equal(utils.periodFormatted(1999999), '1.999.999');
    });
    it('returns 0 if value is empty', () => {
      assert.equal(utils.periodFormatted(), '0');
    });
  });

  describe('Shortening a textstring', () => {
    it('returns the full string if it is 120 characters or less', () => {
      assert.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a leo sed quam fermentum pulvinar ut in mauris nullam.', utils.shorten('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a leo sed quam fermentum pulvinar ut in mauris nullam.', 120));
    });

    it('returns the first 117 characters plus ...', () => {
      assert.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a leo sed quam fermentum pulvinar ut in mauris null...', utils.shorten('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a leo sed quam fermentum pulvinar ut in mauris nullam. Lorem ipsum dolor sit amet.', 120));
    });
  });
});

describe('jsonFromUrl', () => {
  it('should have the correct keys and values', () => {
    const expected = {
      foo: 'bar',
      baz: 'qux',
    };

    const input = '?foo=bar&baz=qux';
    assert.equal(JSON.stringify(expected), JSON.stringify(utils.jsonFromUrl(input)));
  });

  it('should allow empty parameters', () => {
    const expected = { };

    const input = '?';
    assert.equal(JSON.stringify(expected), JSON.stringify(utils.jsonFromUrl(input)));
  });

  it('should ignore empty parameters', () => {
    const expected = { };

    const input = '?foo=';
    assert.equal(JSON.stringify(expected), JSON.stringify(utils.jsonFromUrl(input)));
  });

  it('should allow nested objects', () => {
    const expected = {
      foo: {
        bar: 'baz',
        qux: 'foo',
      },
    };

    const input = '?foo[bar]=baz&foo[qux]=foo';
    assert.equal(JSON.stringify(expected), JSON.stringify(utils.jsonFromUrl(input)));
  });

  it('should allow single nested objects', () => {
    const expected = {
      foo: {
        bar: 'baz',
      },
    };

    const input = '?foo[bar]=baz';
    assert.equal(JSON.stringify(expected), JSON.stringify(utils.jsonFromUrl(input)));
  });

  it('should allow missing question mark', () => {
    const expected = { };

    const input = '';
    assert.equal(JSON.stringify(expected), JSON.stringify(utils.jsonFromUrl(input)));
  });
});

describe('areEqualIgnoreCase', () => {
  it('should ignore case', () => {
    assert.isTrue(utils.areEqualIgnoreCase('eiendom', 'eiendom'));
    assert.isTrue(utils.areEqualIgnoreCase('Eiendom', 'eiendom'));
    assert.isTrue(utils.areEqualIgnoreCase('Eiendom', 'EiendoM'));
  });
});
