angular.module('ticflow.controllers')

.controller('NewListCtrl', function ($rootScope, $scope, API, $window, $q, $ionicActionSheet, $ionicModal, $cordovaCamera, $cordovaImagePicker, $ionicLoading) {

    $scope.list = {
        client: {
            name: "",
            address: "",
            phone_no: "",
            unit: "",
        },
        deliver: "",
        debug: "",
        visit: "",
        install: "",
        warehouse: "",
        outgoing: "",
        serial_no: "",
        saler: "",
        value: "",
        engineer: "",
        attached1: "",
        attached2: "",
        attached3: "",
    };

    $scope.units = [];
    $scope.names = [];
    $scope.addresses = [];
    $scope.phone_nos = [];

    $scope.images = [
        {selected: false, uri: ""},
        {selected: false, uri: ""},
        {selected: false, uri: ""},
    ];

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadData();
    });

    $scope.loadData = function () {
        API.getUsers({role: 'saler'})
            .success(function (salers) {
                $scope.salers = salers;
            })
            .error(function () {
                $rootScope.notify("获取销售人员列表失败！请检查您的网络！");
            });
        API.getUsers({role: 'engineer'})
            .success(function (engineers) {
                $scope.engineers = engineers;
            })
            .error(function () {
                $rootScope.notify("获取工程师列表失败！请检查您的网络！");
            });
        // API.getClientInfo()
        //     .success(function (lists) {
        //         lists.forEach(function (entry) {
        //             if ($scope.units.indexOf(entry.client.unit) == -1)
        //                 $scope.units.push(entry.client.unit);
        //             if ($scope.names.indexOf(entry.client.name) == -1)
        //                 $scope.names.push(entry.client.name);
        //             if ($scope.addresses.indexOf(entry.client.address) == -1)
        //                 $scope.addresses.push(entry.client.address);
        //             if ($scope.phone_nos.indexOf(entry.client.phone_no) == -1)
        //                 $scope.phone_nos.push(entry.client.phone_no);
        //         });
        //     })
        //     .error(function () {
        //         $rootScope.notify("获取客户信息列表失败！请检查您的网络！");
        //     });
    };

    $scope.newList = function() {
        if (!$scope.list.client.unit) {
            $rootScope.notify("客户单位不能为空！");
            return false;
        }

        if (!$scope.list.client.name) {
            $rootScope.notify("客户姓名不能为空！");
            return false;
        }

        if (!$scope.list.client.address) {
            $rootScope.notify("客户地址不能为空！");
            return false;
        }

        if (!$scope.list.client.phone_no) {
            $rootScope.notify("客户电话不能为空！");
            return false;
        }

        if (!$scope.list.saler) {
            $rootScope.notify("销售不能为空！");
            return false;
        }

        if (!$scope.list.value) {
            $rootScope.notify("分值不能为空！");
            return false;
        }

        if (isNaN($scope.list.value)) {
            $rootScope.notify("分值必须为纯数字！");
            return false;
        }

        if (!$scope.list.engineer) {
            $rootScope.notify("工程师不能为空！");
            return false;
        }

        var d0 = $q.defer(), d1 = $q.defer(), d2 = $q.defer();
        $rootScope.show("图片上传中...");
        if ($scope.images[0].selected) {
            API.upload($scope.images[0].uri)
                .then(function (res) {
                    // Success!
                    $scope.list.attached1 = JSON.parse(res.response).filename;
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
            $scope.list.attached1 = "";
            d0.resolve();
        }
        if ($scope.images[1].selected) {
            API.upload($scope.images[1].uri)
                .then(function (res) {
                    // Success!
                    $scope.list.attached2 = JSON.parse(res.response).filename;
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
            $scope.list.attached2 = "";
            d1.resolve();
        }
        if ($scope.images[2].selected) {
            API.upload($scope.images[2].uri)
                .then(function (res) {
                    // Success!
                    $scope.list.attached3 = JSON.parse(res.response).filename;
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
            $scope.list.attached3 = "";
            d2.resolve();
        }

        $q.all([d0.promise, d1.promise, d2.promise]).then(function(){
            $rootScope.hide();
            API.newList($scope.list)
                .success(function (list) {
                    $rootScope.notify("创建成功!");
                })
                .error(function () {
                    $rootScope.notify("创建失败！请检查您的网络！");
                });
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
            $scope.images[i].selected = true;
            $scope.images[i].uri = imageURI;
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
            $scope.images[i].selected = true;
            $scope.images[i].uri = results[0];
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
        if (i === 0)
            $scope.list.attached1 = "";
        else if (i === 1)
            $scope.list.attached2 = "";
        else if (i === 2)
            $scope.list.attached3 = "";
    };

});