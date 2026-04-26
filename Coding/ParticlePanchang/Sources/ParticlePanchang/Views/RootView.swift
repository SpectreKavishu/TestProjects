import SwiftUI

struct RootView: View {
    var body: some View {
        TabView {
            NavigationStack {
                TodayView()
            }
            .tabItem {
                Label("tab_today", systemImage: "sun.max.fill")
            }

            NavigationStack {
                UpcomingView()
            }
            .tabItem {
                Label("tab_upcoming", systemImage: "calendar")
            }

            NavigationStack {
                SettingsView()
            }
            .tabItem {
                Label("tab_settings", systemImage: "slider.horizontal.3")
            }
        }
        .tint(AppTheme.accent)
    }
}

struct BackgroundView: View {
    var body: some View {
        ZStack {
            AppTheme.backgroundGradient
                .ignoresSafeArea()

            Circle()
                .fill(AppTheme.teal.opacity(0.35))
                .frame(width: 280, height: 280)
                .blur(radius: 40)
                .offset(x: -120, y: -220)

            RoundedRectangle(cornerRadius: 80, style: .continuous)
                .fill(AppTheme.accent.opacity(0.18))
                .frame(width: 240, height: 240)
                .blur(radius: 50)
                .offset(x: 140, y: 260)
        }
    }
}

#Preview {
    RootView()
        .environmentObject(PanchangStore())
}
