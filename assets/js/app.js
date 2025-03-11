var app = angular.module('myApp', []);


app.controller('evaluationController', function($scope) {
    // $scope.formData.bodyRating = 0;
    // $scope.formData.interiorRating = 0;
    // $scope.formData.engineRating = 0;
    // $scope.formData.averageRating = 0;
    // $scope.formData.ratingResult = '';

    // Watch for changes in the ratings and calculate the weighted average
    $scope.$watchGroup(['formData.bodyRating', 'formData.interiorRating', 'formData.engineRating'], function(newValues) {
        // Convert ratings to floats
        var body = parseFloat(newValues[0]);
        var interior = parseFloat(newValues[1]);
        var engine = parseFloat(newValues[2]);

        // Calculate weighted average
        $scope.formData.averageRating = (body * 0.40 + interior * 0.30 + engine * 0.30).toFixed(2);

        // Determine the rating result
        if ($scope.formData.averageRating <= 4) {
            $scope.formData.ratingResult = 'Mauvais';
        } else if ($scope.formData.averageRating <= 7) {
            $scope.formData.ratingResult = 'Moyen';
        } else {
            $scope.formData.ratingResult = 'Bon';
        }
    });
});



app.controller('FormController', ['$scope', function($scope) {
    $scope.currentStep = 1;
    $scope.showSummary = false;
    $scope.currentStep = 1;
    $scope.showSummary = false;
    $scope.formData = {
        partnerName: '',
        zone: '',
        ownerName: '',
        brand: '',
        model: '',
        registration: '',
        fuelType: '',
        firstRegistrationDate: '',
        vehicleCategory: '',
        vehicleUsage: '',
        usageType: '',
        realMileage: 0,
        averageMileage: 0,
        averageYearlyMileage: 0,
        vehicleAge: 0,
        purchaseDate: '',
        condition: '',
        purchasePrice: 0,
        bodyRating: 0,
        interiorRating: 0,
        engineRating: 0,
        averageRating: 0,
        ratingResult: ''
    };

    // Fonction pour collecter toutes les données du formulaire
    $scope.collectFormData = function() {
        $scope.formData = $scope.formData;
    };

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
        $scope.calculateDepreciation();
        $scope.showSummary = true;
    };

    $scope.returnToForm = function() {
        $scope.showSummary = false;
        console.log($scope.formData);
    };

    $scope.validateAndSubmit = function() {
        // Réinitialiser le formulaire
        $scope.showSummary = false;
        $scope.currentStep = 1;
        $scope.formData = {
            partnerName: '',
            zone: '',
            ownerName: '',
            brand: '',
            model: '',
            registration: '',
            fuelType: '',
            firstRegistrationDate: '',
            vehicleCategory: '',
            vehicleUsage: '',
            usageType: '',
            realMileage: 0,
            averageMileage: 0,
            averageYearlyMileage: 0,
            vehicleAge: 0,
            purchaseDate: '',
            condition: '',
            purchasePrice: 0,
            bodyRating: 0,
            interiorRating: 0,
            engineRating: 0,
            averageRating: 0,
            ratingResult: ''
        };
    };

    // Remplacer toutes les références 'this' par $scope.depreciationData
    $scope.calculateDepreciation = function() {
        const currentDate = new Date();
        $scope.currentYear = currentDate.getFullYear();
        const purchaseYear = new Date($scope.formData.purchaseDate).getFullYear();
        
        // Initialiser toutes les propriétés nécessaires
        $scope.depreciationData = {
            yearsSincePurchase: $scope.currentYear - purchaseYear - 1,
            evaluator1: $scope.formData.evaluator1Price, // Utilisez la valeur du formulaire
            evaluator2: $scope.formData.evaluator2Price, // Utilisez la valeur du formulaire
            marketValue: $scope.formData.marketPrice,    // Utilisez la valeur du formulaire
            owner: $scope.formData.ownerPrice,
            rates: {},
            adjustments: {}
        }

        // Calcul des taux de dépréciation
        switch($scope.formData.usageType) {
            case 'prive':
            case 'particulier':
                $scope.depreciationData.rates = { 
                    firstYearRate: 0.15, 
                    annualRate: 0.11 
                };
                break;
            case 'marchandises':
                $scope.depreciationData.rates = { 
                    firstYearRate: 0.20, 
                    annualRate: 0.13 
                };
                break;
            case 'personnes':
                $scope.depreciationData.rates = { 
                    firstYearRate: 0.25, 
                    annualRate: 0.18 
                };
                break;
            default:
                $scope.depreciationData.rates = { 
                    firstYearRate: 0, 
                    annualRate: 0 
                };
        }

        // Calcul des ajustements
        $scope.depreciationData.adjustments = {
            condition: $scope.formData.ratingResult === 'Bon' ? -0.03 : 
                    $scope.formData.ratingResult === 'Mauvais' ? 0.05 : 0,
            mileage: Math.max(0, Math.floor(
                ($scope.formData.realMileage - $scope.formData.averageMileage) / 10000
            ) * 0.02)
        };

        // Calcul dépréciation cumulée
        let value = $scope.formData.purchasePrice;
        if($scope.depreciationData.rates.firstYearRate) {
            value *= (1 - $scope.depreciationData.rates.firstYearRate);
            
            for(let i = 1; i < $scope.depreciationData.yearsSincePurchase; i++) {
                value *= (1 - ($scope.depreciationData.rates.annualRate));
            }
        }

        
        
        
        const conditionAdjustment = $scope.depreciationData.adjustments.condition;
        const mileageAdjustment = $scope.depreciationData.adjustments.mileage;
        const adjustedValue = value * (1 - conditionAdjustment) * (1 - mileageAdjustment);
        // Stockage des valeurs
        // $scope.depreciationData.currentValue = value || 0;

        $scope.depreciationData.nextYearValue = adjustedValue - (adjustedValue*$scope.depreciationData.rates.annualRate);

        $scope.depreciationData.yearAfterNextValue = $scope.depreciationData.nextYearValue * (1 - $scope.depreciationData.rates.annualRate);
            
        // Mettre à jour les valeurs
        $scope.depreciationData.currentValue = adjustedValue;
        $scope.depreciationData.adjustedValueDetails = {
            baseValue: value,
            conditionPercent: (conditionAdjustment * 100).toFixed(0),
            mileagePercent: (mileageAdjustment * 100).toFixed(0),
            adjustedValue: adjustedValue
        };

        // Calcul valeur finale
        $scope.depreciationData.residualValue = $scope.depreciationData.currentValue * 0.45;
        $scope.depreciationData.evaluator1Value = $scope.depreciationData.evaluator1 * 0.15;
        $scope.depreciationData.evaluator2Value = $scope.depreciationData.evaluator2 * 0.15;
        $scope.depreciationData.ownerValue = $scope.formData.ownerPrice * 0.05;
        $scope.depreciationData.marketValueContrib = $scope.depreciationData.marketValue * 0.20;
        
        $scope.depreciationData.finalValue = Math.round(
            $scope.depreciationData.residualValue + 
            $scope.depreciationData.evaluator1Value + 
            $scope.depreciationData.evaluator2Value + 
            $scope.depreciationData.ownerValue + 
            $scope.depreciationData.marketValueContrib
        );

        // Libellés d'affichage
        $scope.depreciationData.kmStatus = ($scope.formData.realMileage - $scope.formData.averageMileage) > 10000
        ? 'surutilisé'
        : 'conforme au standard';


    };

    $scope.exportToPDF = function() {
        try {
            const doc = new jsPDF();
            const content = document.getElementById('resume');
            
            if (!content) {
                console.error('Element #resume not found');
                return;
            }
    
            html2canvas(content, {
                scale: 2, // Meilleure qualité
                useCORS: true, // Pour les images externes
                logging: true // Pour le debug
            }).then(function(canvas) {
                try {
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = 210; // A4 width in mm
                    const pageHeight = 297; // A4 height in mm
                    const imgHeight = canvas.height * imgWidth / canvas.width;
                    let heightLeft = imgHeight;
                    let position = 0;
                    
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                    
                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        doc.addPage();
                        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }
                    
                    doc.save('evaluation-vehicule.pdf');
                } catch (err) {
                    console.error('Error in PDF generation:', err);
                }
            }).catch(function(error) {
                console.error('Error in html2canvas:', error);
            });
        } catch (err) {
            console.error('Error initializing PDF:', err);
        }
    };

}]);

app.controller('KilometrageController', function($scope) {
    // $scope.formData.vehicleUsage = '';
    // $scope.formData.usageType = '';
    // $scope.formData.firstRegistrationDate = '';
    // $scope.formData.averageMileage = 0;
    // $scope.formData.averageYearlyMileage = 0;
    // $scope.formData.vehicleAge = 0;
    // $scope.formData.realMileage = 0;

    // Fonction pour calculer le kilométrage moyen
    $scope.calculateAverageMileage = function() {

        if($scope.formData.firstRegistrationDate){
            // Calculer l'âge du véhicule
            var registrationYear = new Date($scope.formData.firstRegistrationDate).getFullYear();
            var currentYear = new Date().getFullYear();
            $scope.formData.vehicleAge = currentYear - registrationYear;
            console.log($scope.formData.vehicleAge)

            if ($scope.formData.vehicleUsage == 'location') {
                $scope.formData.usageType = 'location'; 
            }
            
            if ($scope.formData.usageType) {
                console.log($scope.formData.usageType)
                // Plages de kilométrage en fonction de l'usage du véhicule
                var minMileage = 0;
                var maxMileage = 0;

                switch ($scope.formData.usageType) {
                    case 'prive':
                        minMileage = 10000;
                        maxMileage = 15000;
                        break;
                    case 'particulier':
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
                }
            }
    
                
                // Calculer le kilométrage moyen annuel en fonction de l'usage et de l'âge du véhicule
                var averageMileage = ((minMileage + maxMileage) / 2) * $scope.formData.vehicleAge;
                $scope.formData.averageMileage = averageMileage;
                console.log($scope.formData.averageMileage);
        }

            if ($scope.formData.realMileage){
                // Calculer le kilométrage moyen annuel (kilométrage réel / âge du véhicule)
                var averageYearlyMileage = $scope.formData.realMileage / $scope.formData.vehicleAge;
                $scope.formData.averageYearlyMileage = averageYearlyMileage;
            }
        }
});

app.filter('percentage', ['$filter', function($filter) {
    return function(input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    };
}]);





