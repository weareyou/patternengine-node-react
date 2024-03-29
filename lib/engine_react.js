/*
 * react pattern engine for patternlab-node - v0.1.0 - 2016
 *
 * Geoffrey Pursell, Brian Muenzenmeyer, and the web community.
 * Licensed under the MIT license.
 *
 * Many thanks to Brad Frost and Dave Olsen for inspiration, encouragement, and advice.
 *
 */


"use strict";

const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Hogan = require('hogan.js');
const beautify = require('js-beautify');
const cheerio = require('cheerio');

const outputTemplate = Hogan.compile(
  fs.readFileSync(
    path.join(__dirname, './outputTemplate.mustache'),
    'utf8'
  )
);

var engine_react = {
  engine: React,
  engineName: 'react',
  engineFileExtension: '.jsx',

  // hell no
  expandPartials: false,

  // regexes, stored here so they're only compiled once
  findPartialsRE: null,
  findPartialsWithStyleModifiersRE: null,
  findPartialsWithPatternParametersRE: null,
  findListItemsRE: null,
  findPartialRE: null,

  // render it
  renderPattern(pattern, data, partials) {
    try {
      /* eslint-disable no-eval */
      const componentString = pattern.template || pattern.extendedTemplate;

      return outputTemplate.render({
        patternPartial: pattern.patternPartial,
        json: JSON.stringify(data),
        htmlOutput: 'NO HTML', // ReactDOMServer.renderToStaticMarkup(Component(data)),
        runtimeCode: 'var component = ' + pattern.patternBaseName.split('-')[0]
      });
    }
    catch (e) {
      console.log("Error rendering React pattern.", e);
      return "";
    }
  },

  /**
   * Find regex matches within both pattern strings and pattern objects.
   *
   * @param {string|object} pattern Either a string or a pattern object.
   * @param {object} regex A JavaScript RegExp object.
   * @returns {array|null} An array if a match is found, null if not.
   */
  patternMatcher(pattern, regex) {
    var matches;
    if (typeof pattern === 'string') {
      matches = pattern.match(regex);
    } else if (typeof pattern === 'object' && typeof pattern.template === 'string') {
      matches = pattern.template.match(regex);
    }
    return matches;
  },

  // find and return any {{> template-name }} within pattern
  findPartials(pattern) {
    return [];
  },
  findPartialsWithStyleModifiers(pattern) {
    return [];
  },

  // returns any patterns that match {{> value(foo:"bar") }} or {{>
  // value:mod(foo:"bar") }} within the pattern
  findPartialsWithPatternParameters(pattern) {
    return [];
  },
  findListItems(pattern) {
    return [];
  },

  // given a pattern, and a partial string, tease out the "pattern key" and
  // return it.
  findPartial(partialString) {
    return [];
  },

  rawTemplateCodeFormatter(unformattedString) {
    return beautify(unformattedString, {e4x: true, indent_size: 2});
  },

  renderedCodeFormatter(unformattedString) {
    return unformattedString;
  },

  markupOnlyCodeFormatter(unformattedString, pattern) {
    const $ = cheerio.load(unformattedString);
    return beautify.html($('.reactPatternContainer').html(), {indent_size: 2});
  },

  /**
   * Add custom output files to the pattern output
   * @param {object} patternlab - the global state object
   * @returns {(object|object[])} - an object or array of objects,
   * each with two properties: path, and content
   */
  addOutputFiles(paths, patternlab) {
    return [];
  }
};

module.exports = engine_react;
