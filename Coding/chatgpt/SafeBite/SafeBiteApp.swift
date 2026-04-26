import SwiftUI
import Firebase

@main
struct SafeBiteApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    @StateObject var authVM = AuthViewModel()
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authVM)
        }
    }
}

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        FirebaseApp.configure()
        return true
    }
}
