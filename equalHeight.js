(function($) {
    $.fn.equalHeight = function() {
        var $this = $(this),
            calculateEqualHeights = function() {
                var equalHeightGroups = {};

                // Responsive float-Fix
                $this.height(1);

                // Group Elements by offset top
                $this.each(function() {
                    var y = $(this).offset().top;

                    equalHeightGroups[y] = equalHeightGroups[y] || $();
                    equalHeightGroups[y] = equalHeightGroups[y].add(this);
                });

                $.each(equalHeightGroups, function(y, elements) {
                    var height = 0;

                    // Reset element height to `auto`
                    elements.css('height', 'auto');

                    // Find the max height
                    elements.each(function() {
                        var outerHeight = $(this).outerHeight();

                        if (outerHeight > height) {
                            height = outerHeight;
                        }
                    });

                    // Calculate the new height of each element (height without padding and border)
                    elements.each(function() {
                        var self = $(this),
                            negative = self.outerHeight() - self.height();

                        self.height(height - negative);
                    });
                });
            };

        // Bind event and calculate initial box dimensions
        $(window).on('resize', calculateEqualHeights);
        calculateEqualHeights();
    }
}(jQuery));