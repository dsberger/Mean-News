var app = angular.module('meanNews', ['ui.router']);

app.factory('posts', ['$http', function($http){
   var o = {}

   o.posts = [];

   o.getAll = function(){
     return $http.get('/posts').success(function(data){
       angular.copy(data, o.posts);
     });
   };

   o.create = function(post) {
     return $http.post('/posts', post).success(function(data){
       o.posts.push(data);
     });
   };

   o.upvote = function(post) {
     return $http.put('/posts/' + post._id + '/upvote')
       .success(function(data){
         post.upvotes += 1;
       });
   };

   return o;
}]);

app.controller('MainCtrl', [
  '$scope', '$stateParams', 'posts',
  function($scope, $stateParams, posts){

    $scope.posts = posts.posts;

    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; }

      posts.create({
        title: $scope.title,
        link: $scope.link,
      });

      $scope.title = '';
      $scope.link = '';
    };

    $scope.incrementUpvotes = function(post){
      posts.upvote(post);
    };
}]);

app.controller('PostsCtrl', [
  '$scope','$stateParams', 'posts',
  function($scope, $stateParams, posts){

    $scope.post = posts.posts[$stateParams.id];

    $scope.addComment = function(){
      if($scope.body === '') { return; }
      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
    };
}]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: '/home.html',
          controller: 'MainCtrl',
          resolve: {
            postPromises: ['posts', function(posts){
              return posts.getAll();
            }]
          }
        })
        .state('posts', {
          url: '/posts/{id}',
          templateUrl: '/posts.html',
          controller: 'PostsCtrl'
        });

      $urlRouterProvider.otherwise('home');
    }]);
