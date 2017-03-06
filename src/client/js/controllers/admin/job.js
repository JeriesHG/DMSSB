function JobController($scope, $http, commonFactory) {

  initializeController();

  $scope.selectedJob = {};

  $scope.print = function() {
    commonFactory.printTable("adminTable");
  }

  $scope.newJob = function() {
    $scope.selectedJob = {};
  }

  $scope.saveJob = function() {
    if ($scope.selectedJob.edit) {
      let id = $scope.selectedJob._id;
      $http.put('/api/jobs/' + id, $scope.selectedJob)
        .then(function(response) {
          commonFactory.toastMessage('Position de Trabajo ' + $scope.selectedJob.job + ' fue actualizado exitosamente!', 'info');
          $scope.selectedJob = {};
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      $scope.selectedJob.created = new Date();
      $http.post('/api/jobs/', $scope.selectedJob)
        .then(function(response) {
          commonFactory.toastMessage('Position de Trabajo ' + $scope.selectedJob.job + ' fue guardado exitosamente!', 'success');
          $scope.selectedJob = {};
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    retrieveJobs();
  }

  $scope.updateJob = function(id) {
    $http.get('/api/jobs/' + id)
      .then(function(response) {
        $scope.selectedJob = response.data;
        $scope.selectedJob.edit = true;
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  $scope.deleteJob = function(id) {
    if (confirm("Esta seguro de borrar esta posicion de trabajo?")) {
      $http.delete('/api/jobs/' + id)
        .then(function(response) {
          commonFactory.activateAlert('Position de Trabajo borrada exitosamente!', 'danger');
          retrieveJobs();
          $scope.selectedJob = {};
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  function initializeController() {
    retrieveJobs();
  }

  function retrieveJobs() {
    $http.get('/api/jobs/')
      .then(function(response) {
        $scope.jobs = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

JobController.$inject = ['$scope', '$http', 'commonFactory'];
angular.module('app').controller('jobsController', JobController);
