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

interface JQuery {
    equalHeight(options?: EqualHeight.Options): EqualHeight.Plugin
}

namespace EqualHeight {
    const MODE_OFFSET = 'offset';
    const MODE_GROUP = 'group';

    export interface Options {
        defaultGroup?: string;
        defaultMode?: string;
        defaultHidden?: boolean;
        groupAttr?: string;
        modeAttr?: string;
        hiddenAttr?: string;
    }

    export class Plugin {
        // Contains last windowWith
        private windowWidth: number = jQuery(window).width();

        // Plugin instance options
        public options: Options;

        constructor(public elements: JQuery, options?: Options) {
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
        public recalculate() {
            var equalHeightGroups = {};

            // Responsive float-Fix
            this.elements.height(1);

            // Group Elements
            this.elements.each((key, val) => {
                var element = jQuery(val),
                    offset = 0,
                    group = element.attr(this.options.groupAttr) || this.options.defaultGroup,
                    mode = element.attr(this.options.modeAttr) || this.options.defaultMode,
                    hidden = element.attr(this.options.hiddenAttr) === 'true' || this.options.defaultHidden;

                if (false === hidden && element.is(':hidden')) {
                    console.log(element.data('eqh-height'));
                    // Reset to previous calculated height
                    element.height(element.data('eqh-height'));

                    return;
                }

                if (mode === MODE_OFFSET) {
                    offset = Math.floor(element.offset().top);
                }

                equalHeightGroups[group]               = equalHeightGroups[group] || {};
                equalHeightGroups[group][mode]         = equalHeightGroups[group][mode] || {};
                equalHeightGroups[group][mode][offset] = equalHeightGroups[group][mode][offset] || jQuery();

                equalHeightGroups[group][mode][offset] = equalHeightGroups[group][mode][offset].add(val);
            });

            jQuery.each(equalHeightGroups, (group, modes) => {
                jQuery.each(modes, (mode, offsets) => {
                    jQuery.each(offsets, (offset, elements) => {
                        this.recalculateElements(elements);
                    });
                });
            });
        }

        // Recalculate elements heights
        private recalculateElements(elements: JQuery) {
            var maxHeight = 0;

            elements.height('');
            
            // Find the max height
            elements.each((key, val) => {
                var outerHeight = Math.round(jQuery(val).outerHeight());

                if (outerHeight > maxHeight) {
                    maxHeight = outerHeight;
                }
            });

            // Calculate the new height of each element (height without padding and border)
            elements.each((key, val) => {
                var element = jQuery(val),
                    negative = element.outerHeight() - element.height(),
                    height = maxHeight - negative;

                element
                    .data('eqh-height', height)
                    .height(height);
            });
        }

        private registerListener() {
            // Create resize event listener
            jQuery(window).on('resize', () => {
                var newWindowWidth = jQuery(window).width();
        
                // Only recalculate on horizontal resize
                if (this.windowWidth != newWindowWidth) {
                    this.windowWidth = newWindowWidth;
                    this.recalculate();
                }
            });
        }
    }
}

// Register jQuery-Plugin
jQuery.fn.equalHeight = function (options?: EqualHeight.Options) {
    return new EqualHeight.Plugin(jQuery(this), options);
}
