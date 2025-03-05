var app = angular.module('myApp', []);

app.controller('FormController', function($scope) {

    $scope.currentStep = 1;

    $scope.nextStep = function() {
        if ($scope.currentStep < 3) {
                $scope.currentStep++;
        }
    };

    $scope.previousStep = function() {
        if ($scope.currentStep > 1) {
            $scope.currentStep--;
        }
    };

    $scope.submitForm = function() {
            alert('Formulaire soumis !');
    };


    $scope.vehicleUsage = '';
    $scope.personnelType = '';
    $scope.professionnelType = '';

    $scope.vehicleUsage = '';
    $scope.firstRegistrationDate = '';
    $scope.averageMileage = 0;

    // Function to calculate the average mileage
    $scope.$watchGroup(['firstRegistrationDate', 'vehicleUsage'], function(newValues) {
        if ($scope.firstRegistrationDate && $scope.vehicleUsage) {
            // Calculate vehicle age
            var registrationYear = new Date($scope.firstRegistrationDate).getFullYear();
            var currentYear = new Date().getFullYear();
            var vehicleAge = currentYear - registrationYear;

            // Default mileage ranges based on vehicle usage
            var minMileage = 0;
            var maxMileage = 0;

            switch ($scope.vehicleUsage) {
                case 'personnel':
                    minMileage = 10000;
                    maxMileage = 15000;
                    break;
                case 'marchandises':
                    minMileage = 40000;
                    maxMileage = 60000;
                    break;
                case 'personnes':
                    minMileage = 50000;
                    maxMileage = 80000;
                    break;
                case 'location':
                    minMileage = 30000;
                    maxMileage = 50000;
                    break;
            }

            // Calculate the average yearly mileage based on usage and vehicle age
            var averageMileage = ((minMileage + maxMileage) / 2) * vehicleAge;
            $scope.averageMileage = averageMileage;
            console.log($scope.averageMileage);
        }
    });

    $scope.bodyRating = 0;
    $scope.interiorRating = 0;
    $scope.engineRating = 0;
    $scope.averageRating = 0;
    $scope.ratingResult = '';

    // Watch for changes in the ratings and calculate the weighted average
    $scope.$watchGroup(['bodyRating', 'interiorRating', 'engineRating'], function(newValues) {
        // Convert ratings to floats
        var body = parseFloat(newValues[0]);
        var interior = parseFloat(newValues[1]);
        var engine = parseFloat(newValues[2]);

        // Calculate weighted average
        $scope.averageRating = (body * 0.40 + interior * 0.30 + engine * 0.30).toFixed(2);

        // Determine the rating result
        if ($scope.averageRating <= 4) {
            $scope.ratingResult = 'Mauvais';
        } else if ($scope.averageRating <= 7) {
            $scope.ratingResult = 'Moyen';
        } else {
            $scope.ratingResult = 'Bon';
        }
    });


    
});



