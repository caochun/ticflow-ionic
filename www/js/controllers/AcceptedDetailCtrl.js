angular.module('ticflow.controllers')

.controller('AcceptedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $ionicPopup, $filter, $q, $ionicActionSheet, $ionicModal, $cordovaCamera, $cordovaImagePicker, $ionicLoading) {

    $scope.record = {
        oldValue: "",
    };

    $scope.images = [
        {selected: false, uri: "", remoteUri: ""},
        {selected: false, uri: "", remoteUri: ""},
        {selected: false, uri: "", remoteUri: ""},
    ];

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadAcceptedDetail();
    });

    $scope.loadAcceptedDetail = function () {
        $scope.isManager = (API.getRole() == 'manager');
        $scope.isEngineer = (API.getRole() == 'engineer');
        $scope.isAdmin = (API.getRole() == 'admin');

        var _id = $stateParams._id;

        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy-MM-dd HH:mm");
                $scope.list.serveTime = $filter('date')($scope.list.serveTime, "yyyy-MM-dd HH:mm");
                $scope.record.oldValue = $scope.list.value;
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadAcceptedDetail();
    };

    $scope.modify = function () {
        if ($scope.list.value !== $scope.record.oldValue) {
            API.modifyList($scope.list._id, $scope.list)
                .success(function (list) {
                    $rootScope.notify("修改成功!");
                    API.newValueChange($scope.record.oldValue, $scope.list.value, API.getId(), $scope.list._id)
                        .success(function (valuechange) {
                            $scope.record.oldValue = $scope.list.value;
                        })
                        .error(function () {
                            $rootScope.notify("新建分值改动信息失败！请检查您的网络！");
                        });
                })
                .error(function () {
                    $rootScope.notify("修改失败！请检查您的网络！");
                });
        } else {
            $rootScope.notify("分值未改动!");
        }
    };

    $scope.submit = function () {
        if (!$scope.list.serial_no) {
            $rootScope.notify("请输入序列号！");
            return false;
        }

        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="list.feedback">',
            title: '请输入提交反馈信息',
            scope: $scope,
            buttons: [
                { text: '<b>取消</b>' },
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.list.feedback) {
                            e.preventDefault();
                        } else {
                            var d0 = $q.defer(), d1 = $q.defer(), d2 = $q.defer();
                            $rootScope.show("图片上传中...");
                            if ($scope.images[0].selected) {
                                API.upload($scope.images[0].uri)
                                    .then(function (res) {
                                        // Success!
                                        $scope.images[0].remoteUri = JSON.parse(res.response).filename;
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
                            if ($scope.images[1].selected) {
                                API.upload($scope.images[1].uri)
                                    .then(function (res) {
                                        // Success!
                                        $scope.images[1].remoteUri = JSON.parse(res.response).filename;
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
                            if ($scope.images[2].selected) {
                                API.upload($scope.images[2].uri)
                                    .then(function (res) {
                                        // Success!
                                        $scope.images[2].remoteUri = JSON.parse(res.response).filename;
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
                                API.modifyList($scope.list._id, {serial_no: $scope.list.serial_no, completed: true, completeTime: new Date(), feedback: $scope.list.feedback,
                                    attached1: $scope.images[0].remoteUri, attached2: $scope.images[1].remoteUri, attached3: $scope.images[2].remoteUri})
                                    .success(function (list) {
                                        $rootScope.notify("提交成功!");
                                        $window.location.href = ('#/menu/accepted');
                                    })
                                    .error(function () {
                                        $rootScope.notify("提交失败！请检查您的网络！");
                                    });
                            });

                            
                        }
                    }
                }
            ]
        });
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
    };

    $scope.remove = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '确定删除该报修单？',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        });

        confirmPopup.then(function(res) {
            if(res) {
                API.removeList($scope.list._id)
                    .success(function (list) {
                        $rootScope.notify("删除成功!");
                        $window.location.href = ('#/menu/accepted');
                    })
                    .error(function () {
                        $rootScope.notify("删除失败！请检查您的网络！");
                    });
            }
        });
    };

    $scope.reaccept = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '确定取消接单？',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        });

        confirmPopup.then(function(res) {
            if(res) {
                API.modifyList($scope.list._id, {accepted: false, acceptTime: "", serveTime: ""})
                    .success(function (list) {
                        $rootScope.notify("取消接单成功!");
                        $window.location.href = ('#/menu/accepted');
                    })
                    .error(function () {
                        $rootScope.notify("取消接单失败！请检查您的网络！");
                    });
            }
        });
    };

});