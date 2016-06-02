angular.module('ticflow.controllers')

.controller('VisitingDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $filter, $ionicActionSheet, $cordovaCamera, $cordovaImagePicker, $ionicModal, $q, $ionicPopup) {

	$scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadVisitingDetail();
    });

    $scope.images = [
        {selected: false, uri: "", onRemote: false},
        {selected: false, uri: "", onRemote: false},
        {selected: false, uri: "", onRemote: false},
    ];

    $scope.loadVisitingDetail = function () {

        var _id = $stateParams._id;

        API.getVisitingDetail(_id)
            .success(function (visiting) {
                $scope.visiting = visiting;
                $scope.visiting.date = $filter('date')($scope.visiting.date, "yyyy-MM-dd HH:mm");

                $scope.isCreater = (API.getId() == $scope.visiting.saler);

                if (visiting.attached1) {
                    $scope.images[0].selected = true;
                    $scope.images[0].uri = API.getBase() + '/uploads/' + visiting.attached1;
                    $scope.images[0].onRemote = true;
                }
                if (visiting.attached2) {
                    $scope.images[1].selected = true;
                    $scope.images[1].uri = API.getBase() + '/uploads/' + visiting.attached2;
                    $scope.images[1].onRemote = true;
                }
                if (visiting.attached3) {
                    $scope.images[2].selected = true;
                    $scope.images[2].uri = API.getBase() + '/uploads/' + visiting.attached3;
                    $scope.images[2].onRemote = true;
                }
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadVisitingDetail();
    };

    $scope.callPhone = function () {
        $window.location.href = "tel:" + $scope.visiting.phone;
    };

    $scope.showActions = function (i) {
        $ionicActionSheet.show({
            buttons: [{
                text: "拍照"
            }, {
                text: "从相册选择"
            }],
            cancelText: '取消',

            buttonClicked: function (index) {
                if (index === 0) {
                    $scope.takePhoto(i);
                } else {
                    $scope.pickImage(i);
                }
                return true;
            }
        });
    };

    $scope.takePhoto = function (i) {
        var options = {
            quality: 20,
            saveToPhotoAlbum: true,
        };

        $cordovaCamera.getPicture(options).then(function(imageURI) {
            if (imageURI !== null) {
                $scope.images[i].selected = true;
                $scope.images[i].uri = imageURI;
                $scope.images[i].onRemote = false;
            }
        }, function(err) {
            // error
        });
    };

    $scope.pickImage = function (i) {
        var options = {
            maximumImagesCount: 1,
            quality: 20,
        };

        $cordovaImagePicker.getPictures(options).then(function (results) {
            if (results.length !== 0) {
                $scope.images[i].selected = true;
                $scope.images[i].uri = results[0];
                $scope.images[i].onRemote = false;
            }
        }, function(error) {
          // error getting photos
        });
    };

    $ionicModal.fromTemplateUrl('templates/imageModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.imageModal = modal;
    });

    $scope.showImage = function (i) {
        $scope.imageUri = $scope.images[i].uri;
        $scope.imageModal.show();
    };

    $scope.hideImage = function () {
        $scope.imageModal.hide();
    };

    $scope.removeImage = function (i) {
        $scope.images[i].selected = false;
        $scope.images[i].uri = "";
        $scope.images[i].onRemote = false;
    };

    $scope.update = function () {
        var d0 = $q.defer(), d1 = $q.defer(), d2 = $q.defer();
        $rootScope.show("图片上传中...");
        
        if (!$scope.images[0].selected) {
            $scope.visiting.attached1 = "";
            d0.resolve();
        } else if ($scope.images[0].selected && !($scope.images[0].onRemote)) {
            API.upload($scope.images[0].uri)
                .then(function (res) {
                    // Success!
                    $scope.visiting.attached1 = JSON.parse(res.response).filename;
                    $scope.images[0].onRemote = true;
                    d0.resolve();
                }, function (err) {
                    // Error
                    $rootScope.hide();
                    $rootScope.notify("图片上传失败！请检查您的网络！");
                    return false;
                }, function (progress) {
                    // constant progress updates
                });
        } else {
            d0.resolve();
        }

        if (!$scope.images[1].selected) {
            $scope.visiting.attached2 = "";
            d1.resolve();
        } else if ($scope.images[1].selected && !($scope.images[1].onRemote)) {
            API.upload($scope.images[1].uri)
                .then(function (res) {
                    // Success!
                    $scope.visiting.attached2 = JSON.parse(res.response).filename;
                    $scope.images[1].onRemote = true;
                    d1.resolve();
                }, function (err) {
                    // Error
                    $rootScope.hide();
                    $rootScope.notify("图片上传失败！请检查您的网络！");
                    return false;
                }, function (progress) {
                    // constant progress updates
                });
        } else {
            d1.resolve();
        }

        if (!$scope.images[2].selected) {
            $scope.visiting.attached3 = "";
            d2.resolve();
        } else if ($scope.images[2].selected && !($scope.images[2].onRemote)) {
            API.upload($scope.images[2].uri)
                .then(function (res) {
                    // Success!
                    $scope.visiting.attached3 = JSON.parse(res.response).filename;
                    $scope.images[2].onRemote = true;
                    d2.resolve();
                }, function (err) {
                    // Error
                    $rootScope.hide();
                    $rootScope.notify("图片上传失败！请检查您的网络！");
                    return false;
                }, function (progress) {
                    // constant progress updates
                });
        } else {
            d2.resolve();
        }

        $q.all([d0.promise, d1.promise, d2.promise]).then(function(){
            $rootScope.hide();
        	API.updateVisiting($scope.visiting._id, $scope.visiting)
                .success(function (visiting) {
                    $rootScope.notify("修改成功!");
                })
                .error(function () {
                    $rootScope.notify("删除失败！请检查您的网络！");
                });
        });
    };

    $scope.remove = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '确定删除该拜访记录？',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        });

        confirmPopup.then(function(res) {
            if(res) {
                API.removeVisiting($scope.visiting._id)
                    .success(function (visiting) {
                        $rootScope.notify("删除成功!");
                        $window.location.href = ('#/menu/visiting');
                    })
                    .error(function () {
                        $rootScope.notify("删除失败！请检查您的网络！");
                    });
            }
        });
    };
});