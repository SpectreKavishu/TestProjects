import SwiftUI

struct UpcomingView: View {
    @EnvironmentObject private var store: PanchangStore

    var body: some View {
        ZStack {
            BackgroundView()

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("upcoming_title")
                        .font(AppFont.title())
                        .foregroundStyle(AppTheme.textPrimary)
                        .padding(.top, 12)

                    ForEach(store.days) { day in
                        NavigationLink {
                            DayDetailView(day: day)
                        } label: {
                            UpcomingCard(day: day)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 24)
            }
        }
        .navigationTitle("upcoming_title")
    }
}

private struct UpcomingCard: View {
    let day: PanchangDay

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(day.displayDate)
                        .font(AppFont.headline())
                        .foregroundStyle(AppTheme.textPrimary)
                    Text(day.weekday)
                        .font(AppFont.caption())
                        .foregroundStyle(AppTheme.textSecondary)
                }

                Spacer()

                Text(day.tithi)
                    .font(AppFont.caption())
                    .foregroundStyle(AppTheme.accentSoft)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(AppTheme.surface)
                    .cornerRadius(12)
            }

            Text(day.fasting)
                .font(AppFont.body())
                .foregroundStyle(AppTheme.textSecondary)
                .lineLimit(2)
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

#Preview {
    NavigationStack {
        UpcomingView()
            .environmentObject(PanchangStore())
    }
}
