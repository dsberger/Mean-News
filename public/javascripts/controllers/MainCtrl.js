app.controller('MainCtrl', [
  '$scope', '$stateParams', 'posts', 'auth',
  function($scope, $stateParams, posts, auth){

    $scope.isLoggedIn = auth.isLoggedIn;

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
