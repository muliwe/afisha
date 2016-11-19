'use strict';

var ApplicationConfiguration = (function(){
    var applicationModuleName = 'afisha';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngAnimate',
        'ngSanitize',
        'ui.router',
        'ionic',
        'ngCordova'
    ];
    var module_defers = [];
    var registerModule = function(moduleName, dependencies){
        module_defers.push({
            moduleName: moduleName,
            dependencies: dependencies
        });
        return angular.module(moduleName, dependencies || []);
    };
    if(window.location.hash === '#_=_') window.location.hash = '#!';
    angular.element(document).ready(function(){

        angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
        module_defers.forEach(function(module){
            angular.module(applicationModuleName).requires.push(module.moduleName);
        });
        angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$urlRouterProvider', '$ionicConfigProvider',
            function($locationProvider, $urlRouterProvider, $ionicConfigProvider){
                $locationProvider.hashPrefix('!');

                $ionicConfigProvider.views.maxCache(0);
                //$ionicConfigProvider.tabs.position('bottom');
                $ionicConfigProvider.views.swipeBackEnabled(false);
                //$ionicConfigProvider.views.transition('android');

                if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {
                    $ionicConfigProvider.scrolling.jsScrolling(false);
                }

                // remove back button text
                $ionicConfigProvider.backButton.text('');

                // remove backbutton previous text
                $ionicConfigProvider.backButton.previousTitleText(false);

            }
        ]);
        angular.module(ApplicationConfiguration.applicationModuleName).run(function(User, UserService, $ionicPlatform, $ionicConfig, $rootScope, $ionicLoading, $ionicScrollDelegate, $ionicTemplateLoader, $ionicBackdrop, $ionicPopup, cargoConfig, $timeout) {
            $rootScope.$on('event:auth-login_required', function() {
                UserService.logout();
            });

            var isPopupShown = false;
            $rootScope.$on('error:old_version', function(event, errorResponseData) {
                if (!isPopupShown) {
                    isPopupShown = true;
                    $ionicPopup.confirm({
                        cssClass: 'red',
                        title: '<i class="ion-close"></i>Old app version',
                        template: errorResponseData.error.message,
                        cancelText: 'Update later',
                        cancelType: 'button-popup-secondary',
                        okText: 'Update',
                        okType: 'button-balanced'
                    }).then(function(wantToUpdate) {
                        isPopupShown = false;
                        if (wantToUpdate) {
                            cargoConfig
                                .getConfigByName('updateUrls')
                                .then(function(updateUrls) {
                                    if (ionic.Platform.isAndroid()) {
                                        cordova.InAppBrowser.open(updateUrls.android, '_system');
                                    } else if (ionic.Platform.isIOS()) {
                                        cordova.InAppBrowser.open(updateUrls.ios, '_system');
                                    }
                                });
                        }
                    });
                }
            });

            var retainCounter = 0;

            var spinnerUrl = 'img/spinner.svg';

            var disableLoadingShowMock = $rootScope.$on('loading:show', function() {
                retainCounter++;
            });

            var disableLoadingHideMock = $rootScope.$on('loading:hide', function() {
                retainCounter--;
            });

            // Loading template prefetching.
            $ionicTemplateLoader.load(spinnerUrl).then(function() {
                // Initial loading showing if necessary.
                if (retainCounter) {
                    $ionicLoading.show({
                        templateUrl: spinnerUrl
                    });
                }

                disableLoadingShowMock();
                $rootScope.$on('loading:show', function() {
                    if (retainCounter === 0) {
                        $ionicLoading.show({
                            templateUrl: spinnerUrl
                        });
                    }
                    retainCounter++;
                });

                disableLoadingHideMock();
                $rootScope.$on('loading:hide', function() {
                    retainCounter--;
                    if (retainCounter === 0) {
                        $ionicLoading.hide();
                    }
                });
            });

            function setStatusBar(aState) {
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
            }
            function setBackdropStatusBar() {
                if (window.StatusBar) {
                    window.StatusBar.styleLightContentExtended();
                    window.StatusBar.backgroundColorByHexString("#2a3345");
                }
            }

            var currentState;
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

            var offlinePopupShown = false;
            function showOfflineAlert() {
                if (!offlinePopupShown) {
                    offlinePopupShown = true;
                    $ionicPopup.alert({
                        cssClass: 'red',
                        title: '<i class="ion-close"></i>No internet connection',
                        template: 'Please, get online to proceed',
                        okType: 'button-popup-secondary'
                    }).then(function () {
                        offlinePopupShown = false;
                    });
                }
            }

            $ionicPlatform.ready(function(){

                var keyboardHideTimer;

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
        });

        // APP START
    });

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();
