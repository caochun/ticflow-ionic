angular.module('ticflow.controllers')

.controller('NewVisitingCtrl', function ($rootScope, $scope, API, $window, $q, $ionicActionSheet, $cordovaCamera, $cordovaImagePicker, $ionicModal) {
	$scope.visiting = {
		year: "",
		season: "",
		week: "",
        saler: "",
		school: "",
		client_sort: "",
		new: "",
		department: "",
		name: "",
		phone: "",
		result: "",
		opportunity: "",
		money: "",
        attached1: "",
        attached2: "",
        attached3: "",
		comment: "",
	};

    $scope.images = [
        {selected: false, uri: ""},
        {selected: false, uri: ""},
        {selected: false, uri: ""},
    ];

	$scope.newVisiting = function() {
        if (!$scope.visiting.year) {
            $rootScope.notify("年份不能为空！");
            return false;
        }

        if (!$scope.visiting.season) {
            $rootScope.notify("季度不能为空！");
            return false;
        }

        if (!$scope.visiting.week) {
            $rootScope.notify("周不能为空！");
            return false;
        }

        if (!$scope.visiting.school) {
            $rootScope.notify("学校不能为空！");
            return false;
        }

        if (!$scope.visiting.client_sort) {
            $rootScope.notify("客户分类不能为空！");
            return false;
        }

        if (!$scope.visiting.new) {
            $rootScope.notify("新/老客户不能为空！");
            return false;
        }

        if (!$scope.visiting.department) {
            $rootScope.notify("院系名称不能为空！");
            return false;
        }

        if (!$scope.visiting.name) {
            $rootScope.notify("客户姓名不能为空！");
            return false;
        }

        if (!$scope.visiting.phone) {
            $rootScope.notify("联系方式不能为空！");
            return false;
        }

        if (!$scope.visiting.result) {
            $rootScope.notify("拜访结果不能为空！");
            return false;
        }

        if (!$scope.visiting.opportunity) {
            $rootScope.notify("有/无商机不能为空！");
            return false;
        }

        if (!$scope.visiting.money) {
            $rootScope.notify("预算金额不能为空！");
            return false;
        }

        if (isNaN($scope.visiting.money)) {
            $rootScope.notify("预算金额不合法！");
            return false;
        }

        $scope.visiting.saler = API.getId();

        var d0 = $q.defer(), d1 = $q.defer(), d2 = $q.defer();
        $rootScope.show("图片上传中...");

        if (!$scope.images[0].selected) {
            $scope.visiting.attached1 = "";
            d0.resolve();
        } else {
            API.upload($scope.images[0].uri)
                .then(function (res) {
                    // Success!
                    $scope.visiting.attached1 = JSON.parse(res.response).filename;
                    d0.resolve();
                }, function (err) {
                    // Error
                    $rootScope.hide();
                    $rootScope.notify("图片上传失败！请检查您的网络！");
                    return false;
                }, function (progress) {
                    // constant progress updates
                });
        }

        if (!$scope.images[1].selected) {
            $scope.visiting.attached2 = "";
            d1.resolve();
        } else {
            API.upload($scope.images[1].uri)
                .then(function (res) {
                    // Success!
                    $scope.visiting.attached2 = JSON.parse(res.response).filename;
                    d1.resolve();
                }, function (err) {
                    // Error
                    $rootScope.hide();
                    $rootScope.notify("图片上传失败！请检查您的网络！");
                    return false;
                }, function (progress) {
                    // constant progress updates
                });
        }

        if (!$scope.images[2].selected) {
            $scope.visiting.attached3 = "";
            d2.resolve();
        } else {
            API.upload($scope.images[2].uri)
                .then(function (res) {
                    // Success!
                    $scope.visiting.attached3 = JSON.parse(res.response).filename;
                    d2.resolve();
                }, function (err) {
                    // Error
                    $rootScope.hide();
                    $rootScope.notify("图片上传失败！请检查您的网络！");
                    return false;
                }, function (progress) {
                    // constant progress updates
                });
        }

        $q.all([d0.promise, d1.promise, d2.promise]).then(function(){
            $rootScope.hide();
            API.newVisiting($scope.visiting)
                .success(function (visiting) {
                    $rootScope.notify("创建成功!");
                    $window.location.href = ('#/menu/visiting');
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
});