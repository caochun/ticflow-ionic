angular.module('ticflow.controllers')

.controller('AcceptedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $ionicPopup, $filter, $q, $ionicActionSheet, $ionicModal, $cordovaCamera, $cordovaImagePicker, $ionicLoading) {

    $scope.record = {
        oldValue: "",
    };

    $scope.images = [
        {selected: false, uri: "", onRemote: false},
        {selected: false, uri: "", onRemote: false},
        {selected: false, uri: "", onRemote: false},
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
                if (list.attached1) {
                    $scope.images[0].selected = true;
                    $scope.images[0].uri = API.getBase() + '/uploads/' + list.attached1;
                    $scope.images[0].onRemote = true;
                }
                if (list.attached2) {
                    $scope.images[1].selected = true;
                    $scope.images[1].uri = API.getBase() + '/uploads/' + list.attached2;
                    $scope.images[1].onRemote = true;
                }
                if (list.attached3) {
                    $scope.images[2].selected = true;
                    $scope.images[2].uri = API.getBase() + '/uploads/' + list.attached3;
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

    $scope.save = function () {
        var d0 = $q.defer(), d1 = $q.defer(), d2 = $q.defer();
        $rootScope.show("图片上传中...");
        var form = {serial_no: $scope.list.serial_no, feedback: $scope.list.feedback};

        if (!$scope.images[0].selected) {
            form.attached1 = "";
            d0.resolve();
        } else if ($scope.images[0].selected && !($scope.images[0].onRemote)) {
            API.upload($scope.images[0].uri)
                .then(function (res) {
                    // Success!
                    form.attached1 = JSON.parse(res.response).filename;
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
            form.attached2 = "";
            d1.resolve();
        } else if ($scope.images[1].selected && !($scope.images[1].onRemote)) {
            API.upload($scope.images[1].uri)
                .then(function (res) {
                    // Success!
                    form.attached2 = JSON.parse(res.response).filename;
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
            form.attached3 = "";
            d2.resolve();
        } else if ($scope.images[2].selected && !($scope.images[2].onRemote)) {
            API.upload($scope.images[2].uri)
                .then(function (res) {
                    // Success!
                    form.attached3 = JSON.parse(res.response).filename;
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
            API.modifyList($scope.list._id, form)
                .success(function (list) {
                    $rootScope.notify("暂存成功!");
                })
                .error(function () {
                    $rootScope.notify("暂存失败！请检查您的网络！");
                });
        });
    };

    $scope.submit = function () {
        if (!$scope.list.serial_no) {
            $rootScope.notify("请输入序列号！");
            return false;
        }
        if (!$scope.list.feedback) {
            $rootScope.notify("请输入反馈信息！");
            return false;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: '确定提交完成这个订单？',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        });

        confirmPopup.then(function(res) {
            if(res) {
                var d0 = $q.defer(), d1 = $q.defer(), d2 = $q.defer();
                $rootScope.show("图片上传中...");
                var form = {serial_no: $scope.list.serial_no, completed: true, completeTime: new Date(), feedback: $scope.list.feedback};
                
                if (!$scope.images[0].selected) {
                    form.attached1 = "";
                    d0.resolve();
                } else if ($scope.images[0].selected && !($scope.images[0].onRemote)) {
                    API.upload($scope.images[0].uri)
                        .then(function (res) {
                            // Success!
                            form.attached1 = JSON.parse(res.response).filename;
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
                    form.attached2 = "";
                    d1.resolve();
                } else if ($scope.images[1].selected && !($scope.images[1].onRemote)) {
                    API.upload($scope.images[1].uri)
                        .then(function (res) {
                            // Success!
                            form.attached2 = JSON.parse(res.response).filename;
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
                    form.attached3 = "";
                    d2.resolve();
                } else if ($scope.images[2].selected && !($scope.images[2].onRemote)) {
                    API.upload($scope.images[2].uri)
                        .then(function (res) {
                            // Success!
                            form.attached3 = JSON.parse(res.response).filename;
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
                    API.modifyList($scope.list._id, form)
                        .success(function (list) {
                            $rootScope.notify("提交成功!");
                            $window.location.href = ('#/menu/accepted');
                        })
                        .error(function () {
                            $rootScope.notify("提交失败！请检查您的网络！");
                        });
                });
            }
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

    $scope.callPhone = function () {
        $window.location.href = "tel:" + $scope.list.client.phone_no;
    };
});