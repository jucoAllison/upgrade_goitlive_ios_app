// import UIKit
// import React
// import React_RCTAppDelegate
// import ReactAppDependencyProvider
// import Firebase

// @main
// class AppDelegate: UIResponder, UIApplicationDelegate {
//   var window: UIWindow?

//   var reactNativeDelegate: ReactNativeDelegate?
//   var reactNativeFactory: RCTReactNativeFactory?

//   func application(
//     _ application: UIApplication,
//     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
//   ) -> Bool {
    
//       // Add me --- \/
//   FirebaseApp.configure()
//   // Add me --- /\



//     let delegate = ReactNativeDelegate()
//     let factory = RCTReactNativeFactory(delegate: delegate)
//     delegate.dependencyProvider = RCTAppDependencyProvider()

//     reactNativeDelegate = delegate
//     reactNativeFactory = factory

//     window = UIWindow(frame: UIScreen.main.bounds)

//     factory.startReactNative(
//       withModuleName: "GoitLive",
//       in: window,
//       launchOptions: launchOptions
//     )

//     return true
//   }
// }

// class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
//   override func sourceURL(for bridge: RCTBridge) -> URL? {
//     self.bundleURL()
//   }

//   override func bundleURL() -> URL? {
// #if DEBUG
//     RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
// #else
//     Bundle.main.url(forResource: "main", withExtension: "jsbundle")
// #endif
//   }
// }






import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    
    // Configure Firebase
    FirebaseApp.configure()
    
    // Set up push notifications
    configurePushNotifications(application)
    
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "GoitLive",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
  
  // MARK: - Push Notification Configuration
  
  func configurePushNotifications(_ application: UIApplication) {
    // Set UNUserNotificationCenter delegate
    UNUserNotificationCenter.current().delegate = self
    
    // Request notification permissions
    let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
    UNUserNotificationCenter.current().requestAuthorization(
      options: authOptions,
      completionHandler: { granted, error in
        if let error = error {
          print("Error requesting notification permissions: \(error.localizedDescription)")
        }
        print("Notification permissions granted: \(granted)")
      }
    )
    
    // Register for remote notifications
    application.registerForRemoteNotifications()
  }
  
  // MARK: - Remote Notification Methods
  
  func application(_ application: UIApplication, 
                   didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    // Pass device token to React Native Push Notification IOS
    // Note: You'll need to bridge this to RCTPushNotificationManager if needed
    let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
    let token = tokenParts.joined()
    print("Device Token: \(token)")
    
    // Also pass to Messaging if using Firebase directly
    Messaging.messaging().apnsToken = deviceToken
  }
  
  func application(_ application: UIApplication, 
                   didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register for remote notifications: \(error.localizedDescription)")
  }
  
  func application(_ application: UIApplication, 
                   didReceiveRemoteNotification userInfo: [AnyHashable: Any],
                   fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    // Handle received remote notification
    print("Received remote notification: \(userInfo)")
    
    // Let Firebase handle the notification if it's from Firebase
    if FirebaseApp.app() != nil {
      Messaging.messaging().appDidReceiveMessage(userInfo)
    }
    
    completionHandler(.newData)
  }
  
  // MARK: - UNUserNotificationCenterDelegate Methods
  
  // Foreground notifications handling - required for iOS 10+
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    let userInfo = notification.request.content.userInfo
    
    // Print message ID if from Firebase
    if let messageID = userInfo["gcm.message_id"] {
      print("Message ID: \(messageID)")
    }
    
    // Print full message
    print("Will present notification: \(userInfo)")
    
    // Change this to your preferred presentation option
    completionHandler([[.banner, .sound, .badge]])
  }
  
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              didReceive response: UNNotificationResponse,
                              withCompletionHandler completionHandler: @escaping () -> Void) {
    let userInfo = response.notification.request.content.userInfo
    
    // Print message ID if from Firebase
    if let messageID = userInfo["gcm.message_id"] {
      print("Message ID: \(messageID)")
    }
    
    // Print full message
    print("Did receive notification response: \(userInfo)")
    
    completionHandler()
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}