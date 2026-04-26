import SwiftUI

@main
struct ParticlePanchangApp: App {
    @StateObject private var store = PanchangStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(store)
        }
    }
}
