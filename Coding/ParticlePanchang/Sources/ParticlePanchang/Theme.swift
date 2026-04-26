import SwiftUI

enum AppTheme {
    static let background = Color(red: 0.07, green: 0.10, blue: 0.11)
    static let card = Color(red: 0.11, green: 0.15, blue: 0.16)
    static let surface = Color(red: 0.15, green: 0.20, blue: 0.20)
    static let accent = Color(red: 0.96, green: 0.66, blue: 0.32)
    static let accentSoft = Color(red: 0.96, green: 0.84, blue: 0.66)
    static let textPrimary = Color(red: 0.98, green: 0.96, blue: 0.92)
    static let textSecondary = Color(red: 0.72, green: 0.74, blue: 0.72)
    static let teal = Color(red: 0.21, green: 0.42, blue: 0.42)

    static let backgroundGradient = LinearGradient(
        colors: [Color(red: 0.05, green: 0.08, blue: 0.09), Color(red: 0.13, green: 0.16, blue: 0.16)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}

enum AppFont {
    static func title() -> Font {
        .system(size: 30, weight: .semibold, design: .serif)
    }

    static func headline() -> Font {
        .system(size: 18, weight: .semibold, design: .serif)
    }

    static func body() -> Font {
        .system(size: 15, weight: .regular, design: .rounded)
    }

    static func caption() -> Font {
        .system(size: 12, weight: .medium, design: .rounded)
    }
}
