'use strict';

const ApplicationConfiguration = (function(){
    const applicationModuleName = 'afishaApp';
    const applicationModuleVendorDependencies = [
        'app.core',
        'afisha',
        'constants'
    ];
    const module_defers = [];
    const registerModule = function(moduleName, dependencies){
        module_defers.push({
            moduleName: moduleName,
            dependencies: dependencies
        });
        return angular.module(moduleName, dependencies || []);
    };

    if(window.location.hash === '#_=_') window.location.hash = '#!';
    angular.element(document).ready(function(){

        angular.module(ApplicationConfiguration.applicationModuleName,
            ApplicationConfiguration.applicationModuleVendorDependencies);
        module_defers.forEach(function(module){
            angular.module(applicationModuleName).requires.push(module.moduleName);
        });
        angular.module(ApplicationConfiguration.applicationModuleName)
            .config(['$locationProvider', '$urlRouterProvider', '$ionicConfigProvider', 'localStorageServiceProvider',
            function($locationProvider, $urlRouterProvider, $ionicConfigProvider, localStorageServiceProvider){
                $locationProvider.hashPrefix('!');

                $ionicConfigProvider.views.maxCache(0);
                //$ionicConfigProvider.tabs.position('bottom');
                $ionicConfigProvider.views.swipeBackEnabled(true);
                $ionicConfigProvider.views.transition('android');

                if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {
                    $ionicConfigProvider.scrolling.jsScrolling(false);
                }

                // remove back button text
                $ionicConfigProvider.backButton.text('');

                // remove backbutton previous text
                $ionicConfigProvider.backButton.previousTitleText(false);

                localStorageServiceProvider
                    .setPrefix('afisha');
            }
        ]);
        angular.module(ApplicationConfiguration.applicationModuleName)
            .run(function($ionicPlatform, $ionicConfig, $rootScope, $ionicLoading, $ionicScrollDelegate,
                $ionicTemplateLoader, $ionicBackdrop, $ionicPopup, $timeout, common, localStorageService,
                serverService, $cordovaGeolocation) {

            let retainCounter = 0;

            $rootScope.$on('reconfiguring:show', function() {
                if (retainCounter === 0) {
                    // console.log('show');
                    $ionicLoading.show();
                }
                retainCounter++;
            });

            $rootScope.$on('reconfiguring:hide', function() {
                $rootScope.$emit('loading:hide');
            });

            const spinnerUrl = 'img/spinner.svg';

            const disableLoadingShowMock = $rootScope.$on('loading:show', function() {
                retainCounter++;
                // console.log(retainCounter);
            });

            const disableLoadingHideMock = $rootScope.$on('loading:hide', function() {
                retainCounter--;
                // console.log(retainCounter);
            });

            // Loading template prefetching.
            $ionicTemplateLoader.load(spinnerUrl).then(function() {
                // Initial loading showing if necessary.
                if (retainCounter) {
                    // console.log('show');
                    $ionicLoading.show({
                        templateUrl: spinnerUrl
                    });
                }

                disableLoadingShowMock();
                $rootScope.$on('loading:show', function() {
                    if (retainCounter === 0) {
                        // console.log('show');
                        $ionicLoading.show({
                            templateUrl: spinnerUrl
                        });
                    }
                    retainCounter++;
                });

                disableLoadingHideMock();
                $rootScope.$on('loading:hide', function() {
                    retainCounter--;
                    if (retainCounter < 1) {
                        retainCounter = 0;
                        // console.log('hide');
                        $ionicLoading.hide();
                    }
                });
            });

            function setStatusBar(aState) {
                /*
                if (window.StatusBar) {

                    if ( 'list.cargo' === aState.name || 'signin' === aState.name ) {

                        window.StatusBar.styleLightContentExtended();
                        window.StatusBar.backgroundColorByHexString("#4a6ba0");
                    } else {
                        window.StatusBar.styleDarkContentExtended(function success() {
                            window.StatusBar.backgroundColorByHexString("#fff");
                        }, function () {
                            window.StatusBar.backgroundColorByHexString("#000");
                        });

                    }

                }
                */
            }
            function setBackdropStatusBar() {
                if (window.StatusBar) {
                    window.StatusBar.styleLightContentExtended();
                    window.StatusBar.backgroundColorByHexString("#2a3345");
                }
            }

            let currentState;
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                document.addEventListener("deviceready", function() {
                    setStatusBar(toState);
                }, false);
                currentState = toState;
            });

            $rootScope.$on('backdrop.shown', function() {
                $timeout(function() {
                    setBackdropStatusBar();
                }, 200);
            });
            $rootScope.$on('backdrop.hidden', function() {
                $timeout(function() {
                    setStatusBar(currentState);
                }, 500);
            });

            // listen for Offline event
            if(ionic.Platform.isWebView()){
                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                    showOfflineAlert();
                });
            } else {
                window.addEventListener("offline", function (e) {
                    showOfflineAlert();
                }, false);
            }

            let offlinePopupShown = false;
            function showOfflineAlert() {
                if (!offlinePopupShown) {
                    offlinePopupShown = true;
                    /*
                    $ionicPopup.alert({
                        cssClass: 'red',
                        title: '<i class="ion-close"></i>No internet connection',
                        template: 'Please, get online to proceed',
                        okType: 'button-popup-secondary'
                    }).then(function () {
                        offlinePopupShown = false;
                    });
                    */
                }
            }

            $ionicPlatform.ready(function(){

                let keyboardHideTimer;

                if(window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                //$ionicConfig.backButton.text('Back');


                // we use custom class couse 'keyboard-open' cause bug with input that need scroll
                window.addEventListener('native.keyboardshow', function(){
                    clearTimeout(keyboardHideTimer);
                    document.body.classList.add('keyboard-open-force');
                    $ionicScrollDelegate.resize();
                });

                window.addEventListener('native.keyboardhide', function(){

                    // fix bug for don't removing keyboard-open class
                    if ( ionic.keyboard.isOpening ) {
                        keyboardHideTimer = setTimeout(function () {
                            document.body.classList.remove('keyboard-open-force', 'keyboard-open');
                        }, 450);
                    } else {
                        document.body.classList.remove('keyboard-open-force');
                    }

                    $ionicScrollDelegate.resize();

                });

            });

            if (localStorageService.get('currentCity')) {
                common.currentCity = JSON.parse(localStorageService.get('currentCity'));

                if (!common.currentCity.id) {
                    common.currentCity = Object.assign({}, common.defaultCity);
                }
                // console.log(common.currentCity);
            }

            if (localStorageService.get('currentLocation')) {
                common.currentLocation = JSON.parse(localStorageService.get('currentLocation'));
                // console.log(common.currentLocation);
            }

            if (localStorageService.get('useHalls')) {
                common.useHalls = JSON.parse(localStorageService.get('useHalls'));
                // console.log(common.useHalls);
            }

            if (localStorageService.get('sortByTitle')) {
                common.sortByTitle = JSON.parse(localStorageService.get('sortByTitle'));
                // console.log(common.sortByTitle);
            }

            if (localStorageService.get('savedCinemas')) {
                common.savedCinemas = JSON.parse(localStorageService.get('savedCinemas'));
                // console.log(common.savedCinemas);
            }

            const watchOptions = {
                timeout: 1000 * 30, // 30 seconds
                maximumAge: 1000 * 60 * 10, // 10 minutes
                enableHighAccuracy: false // may cause errors if true
            };

            const watch = $cordovaGeolocation.watchPosition(watchOptions);
            watch.then(
                null,
                function(err) {
                    // error
                },
                function(position) {
                    // console.log(position.coords);
                    common.currentLocation.latitude = position.coords.latitude;
                    common.currentLocation.longitude = position.coords.longitude;

                    localStorageService.set('currentLocation', JSON.stringify(common.currentLocation));
                });

            serverService.fetchCities((err, cities) => {
                // console.log(err, cities);
            });
        });

        // APP START
        initApp();

        function initApp(shouldInitOnSignInView) {
            const $injector = angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
            const $location = $injector.get('$location');

            // $location.path('/list/films');
        }
    });

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();
