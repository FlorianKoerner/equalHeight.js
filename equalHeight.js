(function($) {
    var EqualHeight = {
        elements: $(),
        bindEvents: function() {
            var self = this;

            $(window).on('resize', self, self.eventCallbacks.onWindowResize);
        },
        eventCallbacks: {
            onWindowResize: function(e) {
                var self = e.data;

                self.calculateEqualHeights();
            }
        },
        calculateEqualHeights: function() {
            var self = this;
            var equalHeightGroups = {};

            // Responsive float-Fix
            self.elements.height(1);

            // Group Elements by offset top
            self.elements.each(function() {
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
        },
        add: function(elements) {
            var self = this;

            self.remove(elements);
            self.elements = self.elements.add(elements);

            self.calculateEqualHeights();
        },
        remove: function(elements) {
            var self = this;

            self.elements = self.elements.not(elements);
        }
    };

    $.fn.equalHeight = (function(EqualHeight) {
        EqualHeight.bindEvents();

        return function(method) {
            switch (method) {
                case 'destroy':
                    EqualHeight.remove(this);
                    break;
                default:
                    EqualHeight.add(this);
            }
        };
    }(EqualHeight));
}(jQuery));
