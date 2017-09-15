/*!
 * @license
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - 2017 Florian Körner
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var EqualHeight;
(function (EqualHeight) {
    var MODE_OFFSET = 'offset';
    var MODE_GROUP = 'group';
    var Plugin = /** @class */ (function () {
        function Plugin(elements, options) {
            this.elements = elements;
            // Contains last windowWith
            this.windowWidth = jQuery(window).width();
            this.options = jQuery.extend({
                defaultGroup: 'eqh-default',
                defaultMode: 'offset',
                defaultHidden: false,
                groupAttr: 'data-eqh',
                modeAttr: 'data-eqh-mode',
                hiddenAttr: 'data-eqh-hidden'
            }, options || {});
            this.registerListener();
            this.recalculate();
        }
        // Recalculate heights
        Plugin.prototype.recalculate = function () {
            var _this = this;
            var equalHeightGroups = {};
            // Responsive float-Fix
            this.elements.height(1);
            // Group Elements
            this.elements.each(function (key, val) {
                var element = jQuery(val), offset = 0, group = element.attr(_this.options.groupAttr) || _this.options.defaultGroup, mode = element.attr(_this.options.modeAttr) || _this.options.defaultMode, hidden = element.attr(_this.options.hiddenAttr) === 'true' || _this.options.defaultHidden;
                if (false === hidden && element.is(':hidden')) {
                    return;
                }
                if (mode === MODE_OFFSET) {
                    offset = Math.floor(element.offset().top);
                }
                equalHeightGroups[group] = equalHeightGroups[group] || {};
                equalHeightGroups[group][mode] = equalHeightGroups[group][mode] || {};
                equalHeightGroups[group][mode][offset] = equalHeightGroups[group][mode][offset] || jQuery();
                equalHeightGroups[group][mode][offset] = equalHeightGroups[group][mode][offset].add(val);
            });
            // Reset element height to `auto`
            this.elements.css('height', 'auto');
            jQuery.each(equalHeightGroups, function (group, modes) {
                jQuery.each(modes, function (mode, offsets) {
                    jQuery.each(offsets, function (offset, elements) {
                        _this.recalculateElements(elements);
                    });
                });
            });
        };
        // Recalculate elements heights
        Plugin.prototype.recalculateElements = function (elements) {
            var maxHeight = 0;
            // Find the max height
            elements.each(function (key, val) {
                var outerHeight = Math.round(jQuery(val).outerHeight());
                if (outerHeight > maxHeight) {
                    maxHeight = outerHeight;
                }
            });
            // Calculate the new height of each element (height without padding and border)
            elements.each(function (key, val) {
                var element = jQuery(val), negative = element.outerHeight() - element.height();
                element.height(maxHeight - negative);
            });
        };
        Plugin.prototype.registerListener = function () {
            var _this = this;
            // Create resize event listener
            jQuery(window).on('resize', function () {
                var newWindowWidth = jQuery(window).width();
                // Only recalculate on horizontal resize
                if (_this.windowWidth != newWindowWidth) {
                    _this.windowWidth = newWindowWidth;
                    _this.recalculate();
                }
            });
        };
        return Plugin;
    }());
    EqualHeight.Plugin = Plugin;
})(EqualHeight || (EqualHeight = {}));
// Register jQuery-Plugin
jQuery.fn.equalHeight = function (options) {
    return new EqualHeight.Plugin(jQuery(this), options);
};
