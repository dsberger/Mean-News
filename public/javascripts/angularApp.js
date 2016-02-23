var app = angular.module('meanNews', ['ui.router']);

app.factory('posts', ['$http', function($http){
   var o = {}

   o.posts = [];

   o.get = function(id) {
     return $http.get('/posts/' + id).then(function(res){
       return res.data;
     });
   };

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

   o.addComment = function(id, comment){
     return $http.post('/posts/' + id + '/comments', comment);
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
        link: $scope.link
      });

      $scope.title = '';
      $scope.link = '';
    };

    $scope.incrementUpvotes = function(post){
      posts.upvote(post);
    };
}]);

app.controller('PostsCtrl', [
  '$scope', 'posts', 'post',
  function($scope, posts, post){

    $scope.post = post;

    $scope.addComment = function(){
      if($scope.body === '') { return; }

      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user'
      }).success(function(comment){
        $scope.post.comments.push(comment);
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
          controller: 'PostsCtrl',
          resolve: {
            post: ['$stateParams', 'posts', function($stateParams, posts) {
              return posts.get($stateParams.id);
            }]
          }
        });

      $urlRouterProvider.otherwise('home');
    }]);
