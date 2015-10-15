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

namespace EqualHeight {
    export interface Options {
        defaultGroup?: string;
        groupAttr?: string;
    }
    
    export class Plugin {
        // Contains last windowWith
        private windowWidth: number = jQuery(window).width();
        
        // Plugin instance options
        public options: Options;
    
        constructor(public elements: JQuery, options?: Options) {
            this.options = jQuery.extend({
                defaultGroup: 'eqh-default',
                groupAttr: 'data-eqh'
            }, options || {});
            
            this.registerListener();
            
            this.calculateEqualHeights();
        }
        
        private registerListener() {
            // Create resize event listener
            jQuery(window).on('resize', () => {
                var newWindowWidth = jQuery(window).width();
        
                // Only recalculate on horizontal resize
                if (this.windowWidth != newWindowWidth) {
                    this.windowWidth = newWindowWidth;
                    this.calculateEqualHeights();
                }
            });
        }
        
        // Recalculate heights
        public calculateEqualHeights() {
            var equalHeightGroups = {};
    
            // Responsive float-Fix
            this.elements.height(1);
    
            // Group Elements
            this.elements.each((key, val) => {
                var element = jQuery(val),
                    offset = Math.floor(element.offset().top),
                    group  = element.attr(this.options.groupAttr) || this.options.defaultGroup;
    
                equalHeightGroups[group]         = equalHeightGroups[group] || {};
                equalHeightGroups[group][offset] = equalHeightGroups[group][offset] || jQuery();
                equalHeightGroups[group][offset] = equalHeightGroups[group][offset].add(val);
            });
    
            // Reset element height to `auto`
            this.elements.css('height', 'auto');
    
            jQuery.each(equalHeightGroups, (name, group) => {
                jQuery.each(group, (offset, elements) => {
                    var maxHeight = 0;
   
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
                            negative = element.outerHeight() - element.height();
    
                        element.height(maxHeight - negative);
                    });
                });
            });
        };
    }
}

// Register jQuery-Plugin
jQuery.fn.equalHeight = function (options?: EqualHeight.Options) {
    new EqualHeight.Plugin(jQuery(this), options);
}
