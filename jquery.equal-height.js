/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Florian Körner
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
/// <reference path="typings/tsd.d.ts" />
var EqualHeight;
(function (EqualHeight) {
    var Plugin = (function () {
        function Plugin(elements, options) {
            this.elements = elements;
            // Contains last windowWith
            this.windowWidth = jQuery(window).width();
            this.options = jQuery.extend({
                defaultGroup: 'eqh-default',
                groupAttr: 'data-eqh'
            }, options || {});
            this.registerListener();
            this.calculateEqualHeights();
        }
        Plugin.prototype.registerListener = function () {
            var _this = this;
            // Create resize event listener
            jQuery(window).on('resize', function () {
                var newWindowWidth = jQuery(window).width();
                // Only recalculate on horizontal resize
                if (_this.windowWidth != newWindowWidth) {
                    _this.windowWidth = newWindowWidth;
                    _this.calculateEqualHeights();
                }
            });
        };
        // Recalculate heights
        Plugin.prototype.calculateEqualHeights = function () {
            var _this = this;
            var equalHeightGroups = {};
            // Responsive float-Fix
            this.elements.height(1);
            // Group Elements
            this.elements.each(function (key, val) {
                var element = jQuery(val), offset = Math.floor(element.offset().top), group = element.attr(_this.options.groupAttr) || _this.options.defaultGroup;
                equalHeightGroups[group] = equalHeightGroups[group] || {};
                equalHeightGroups[group][offset] = equalHeightGroups[group][offset] || jQuery();
                equalHeightGroups[group][offset] = equalHeightGroups[group][offset].add(val);
            });
            // Reset element height to `auto`
            this.elements.css('height', 'auto');
            jQuery.each(equalHeightGroups, function (name, group) {
                jQuery.each(group, function (offset, elements) {
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
                });
            });
        };
        ;
        return Plugin;
    })();
    EqualHeight.Plugin = Plugin;
})(EqualHeight || (EqualHeight = {}));
// Register jQuery-Plugin
jQuery.fn.equalHeight = function (options) {
    new EqualHeight.Plugin(jQuery(this), options);
};
