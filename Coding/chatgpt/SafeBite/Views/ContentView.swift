import SwiftUI

struct ContentView: View {
    @EnvironmentObject var auth: AuthViewModel
    var body: some View {
        Group {
            if auth.user == nil { WelcomeView() } else { HomeView() }
        }
        .onAppear { AdManager.shared.initializeAds() }
    }
}

struct WelcomeView: View {
    @EnvironmentObject var auth: AuthViewModel
    var body: some View {
        VStack(spacing:20) {
            Spacer()
            Text("SafeBite").font(.largeTitle).fontWeight(.bold)
            Text("Find safe street food near you — crowd-sourced and AI-assisted.").font(.subheadline).multilineTextAlignment(.center).foregroundColor(.secondary)
            Spacer()
            Button(action: { auth.signInAnonymously() }) {
                Text("Continue").frame(maxWidth:.infinity).padding().background(Color.orange).foregroundColor(.white).cornerRadius(12).padding(.horizontal)
            }
            Spacer()
        }
    }
}
