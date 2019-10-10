/**
 * Chartist.js plugin to display a target line on a chart.
 * With code from @gionkunz in https://github.com/gionkunz/chartist-js/issues/235
 * and @OscarGodson in https://github.com/gionkunz/chartist-js/issues/491.
 * Based on https://github.com/gionkunz/chartist-plugin-pointlabels
 */
/* global Chartist */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["chartist"], function (Chartist) {
      return (root.returnExportsGlobal = factory(Chartist));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require("chartist"));
  } else {
    root['Chartist.plugins.ctTargetLine'] = factory(Chartist);
  }
}(this, function (Chartist) {
  (function (_window, document, Chartist) {
    'use strict';
    const defaultOptions = {
      class: 'ct-target-line',
      value: null,
      axis: 'Y', // TODO: implement horizontally target line
      showLabel: true,
      labelClass: 'ct-target-line-label',
      label: 0,
    };
    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctTargetLine = (options) => {
      options = Chartist.extend({}, defaultOptions, options);
      return (chart) => {
          const projectY = (chartRect, bounds, value) => {
            return Math.floor(chartRect.y1 - (chartRect.height() / bounds.max * value)) - 1
          }

          chart.on('created', (context) => {
            const targetLineY = projectY(context.chartRect, context.bounds, options.value || Math.abs(context.bounds.low));
            if (!options.value && context.bounds.low === 0) {
              return;
            }
            if (options.showLabel) {
              const labelsGroup = context.svg.querySelector('.ct-labels');
              const height = 30; // TODO: calculate based on options
              const width = 30; // TODO: calculate based on options
              const content = document.createElement('span');
              content.className = `ct-label ct-vertical ct-start ${options.labelClass}`;
              content.setAttribute('xmlns', Chartist.namespaces.xhtml);
              content.innerText = options.label;
              content.style = `width: ${width}px; height: ${height}px;`;
              labelsGroup.foreignObject(
                content,
                Chartist.extend({ style: 'overflow: visible;' }, {
                  y: targetLineY - Math.round(height / 2),
                  x: context.chartRect.padding.left + chart.options.axisY.labelOffset.x,
                  height,
                  width,
                })
              );
            }
            const gridsGroup = context.svg.querySelector('.ct-grids');
            gridsGroup.elem('line', {
              x1: context.chartRect.x1,
              x2: context.chartRect.x2,
              y1: targetLineY,
              y2: targetLineY
            }, options.class);
          });
      };
    };
  }(window, document, Chartist));
  return Chartist.plugins.ctTargetLine;
}));
