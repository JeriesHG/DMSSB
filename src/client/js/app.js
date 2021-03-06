// Default colors
var brandPrimary = '#20a8d8';
var brandSuccess = '#4dbd74';
var brandInfo = '#63c2de';
var brandWarning = '#f8cb00';
var brandDanger = '#f86c6b';

var grayDark = '#2a2c36';
var gray = '#55595c';
var grayLight = '#818a91';
var grayLighter = '#d1d4d7';
var grayLightest = '#f8f9fa';

angular
  .module('app', [
    'ui.router',
    'oc.lazyLoad',
    'ncy-angular-breadcrumb',
    'angular-loading-bar',
    'ngMaterial',
    '720kb.datepicker',
    'ngMessages'
  ])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 1;
  }])
  .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {

    $(document).on('hidden.bs.modal', '.modal', function() {
      $('.modal:visible').length && $(document.body).addClass('modal-open');
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
    $rootScope.$state = $state;
    return $rootScope.$stateParams = $stateParams;
  }])
  .filter('range', function() {
    return function(input, total) {
      total = parseInt(total);
      for (var i = 0; i < total; i++)
        input.push(i);
      return input;
    };
  }).filter('numberFixedLen', function() {
    return function(n, len) {
      var num = parseInt(n, 10);
      len = parseInt(len, 10);
      if (isNaN(num) || isNaN(len)) {
        return n;
      }
      num = '' + num;
      while (num.length < len) {
        num = '0' + num;
      }
      return num;
    };
  });
