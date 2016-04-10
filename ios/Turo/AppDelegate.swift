//
//  AppDelegate.swift
//  Turo
//
//  Created by James Hugman on 4/10/16.
//  Copyright © 2016 Turo. All rights reserved.
//

import Foundation

class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow? = nil

  //- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
  func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject : AnyObject]?) -> Bool {
    let jsCodeLocation = isSimulator ?
        NSURL(string: "http://localhost:8081/index.ios.bundle?platform=ios&dev=true")
      : NSBundle.mainBundle().URLForResource("main", withExtension: "jsbundle")

    let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "Turo", initialProperties: nil, launchOptions: launchOptions)

    let window = UIWindow(frame:UIScreen.mainScreen().bounds)

    let vc = UIViewController()
    vc.view = rootView
    window.rootViewController = vc
    self.window = window

    window.makeKeyAndVisible()
    return true
  }

  var isSimulator: Bool {
    return TARGET_OS_SIMULATOR > 0
  }
}