import SwiftUI

struct SectionCard<Content: View>: View {
    let title: LocalizedStringKey
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(AppFont.caption())
                .foregroundStyle(AppTheme.accentSoft)
                .textCase(.uppercase)

            content
        }
        .padding(18)
        .background(AppTheme.card)
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(AppTheme.accent.opacity(0.2), lineWidth: 1)
        )
    }
}

struct DetailRow: View {
    let label: LocalizedStringKey
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .font(AppFont.body())
                .foregroundStyle(AppTheme.textSecondary)
            Spacer()
            Text(value)
                .font(AppFont.body())
                .foregroundStyle(AppTheme.textPrimary)
        }
    }
}
