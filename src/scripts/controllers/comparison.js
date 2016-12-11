(function () {
  angular
      .module("app")
      .controller("ComparisonCtrl", ComparisonCtrl);

  function ComparisonCtrl($scope, $stateParams, $window, projectService, CacheFactory, ENV) {
    var vm = this;
    $scope.page = "comparison";

    var projectCache,
        projectCacheKey = ENV.api + 'projects/' + $stateParams.id + '?project[slug]=' + $stateParams.slug;

    if (!CacheFactory.get('projectCache')) {
      CacheFactory.createCache('projectCache', {
        deleteOnExpire: 'aggressive',
        recycleFreq: 60000
      });
    }
    projectCache = CacheFactory.get('projectCache');

    $scope.project = {
      id: $stateParams.id,
      slug: $stateParams.slug,
      artboardId: $stateParams.artboardId
    };

    $scope.loading = false;

    vm.comparisonData = {};
    vm.project = {};

    var info = {
      id: $stateParams.id,
      slug: $stateParams.slug
    }
    projectService.getProject(info.id, info.slug)
    .then(function(p) {
      info.currentArtboard = _.findWhere(p.artboards, {id: parseInt($stateParams.artboardId)})
      initialize(p);
    }, function() {
      // console.log("Server did not send project data!");
    });

    function initialize(p) {
      vm.comparisonData.pages = p.artboards;
      vm.comparisonData.setOriginalScreen = setOriginalScreen;
      vm.comparisonData.setImplementedScreen = setImplementedScreen;
    }

    function setOriginalScreen(index) {
      $scope.img1 = vm.comparisonData.pages[index].fullImage;
      vm.selectedPage = vm.comparisonData.pages[index].id;
      if($scope.img2 === undefined) {
        $scope.img2 = vm.comparisonData.pages[index].fullImage;
      }
      $(window).trigger("resize");
    }
    function setImplementedScreen(index) {
      $scope.img2 = vm.comparisonData.pages[index].fullImage;
      vm.selectedCompare = vm.comparisonData.pages[index].id;
      if($scope.img1 === undefined) {
        $scope.img1 = vm.comparisonData.pages[index].fullImage;
      }
      $(window).trigger("resize");
    }
  }
})();
