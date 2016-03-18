# ticflow-ionic

This is the frontend implented by ionic for ticflow. The backend is in [ticflow-backend](https://github.com/caochun/ticflow-backend).

## To run

To run ticflow on your device, first install [ionic](http://ionicframework.com/getting-started/).

Then, clone this repository and run

```
$ cd ticflow-ionic
```

```
$ npm install
```

Then run the following command to run ticflow in your browser.

```
$ ionic serve
```

To run ticflow on real ios / android devices instead, run

```
$ ionic platform add ios (android)
```

```
$ ionic build ios
```

Then you will find .xcodeproj or .apk file in the repo. Open with xcode or install with adb. That's it!