;(function($) {
    $.fn.equalHeight = function(options) {
        var self = this;
        
        // Extend basic / default configuration
        options = $.extend({
            defaultGroup: 'eqh-default',
            groupAttr: 'data-eqh'
        }, options || {});
        
        // Create resize event listener
        $(window).on('resize', self, function() {
            self.calculateEqualHeights();
        });
        
        // Recalculate heights
        self.calculateEqualHeights = function() {
            var equalHeightGroups = {};

            // Responsive float-Fix
            this.height(1);

            // Group Elements
            this.each(function() {
                var offset = $(this).offset().top,
                    group  = $(this).attr(options.groupAttr) || options.defaultGroup;
                
                equalHeightGroups[group]         = equalHeightGroups[group] || {};
                equalHeightGroups[group][offset] = equalHeightGroups[group][offset] || $();
                equalHeightGroups[group][offset] = equalHeightGroups[group][offset].add(this);
            });
            
            // Reset element height to `auto`
            this.css('height', 'auto');
            
            $.each(equalHeightGroups, function(name, group) {
                $.each(group, function(offset, elements) {
                    var height = 0;

                    // Find the max height
                    elements.each(function() {
                        var outerHeight = $(this).outerHeight();

                        if (outerHeight > height) {
                            height = outerHeight;
                        }
                    });

                    // Calculate the new height of each element (height without padding and border)
                    elements.each(function() {
                        var element = $(this),
                            negative = element.outerHeight() - element.height();

                        element.height(height - negative);
                    });
                });
            });
        };
        
        // Initial height calculation
        self.calculateEqualHeights();
    };
})(jQuery);
