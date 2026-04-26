import SwiftUI

struct TodayView: View {
    @EnvironmentObject private var store: PanchangStore
    @State private var isVisible = false

    var body: some View {
        ZStack {
            BackgroundView()

            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    header

                    if let day = store.today {
                        TodayHeroCard(day: day)
                            .transition(.move(edge: .top).combined(with: .opacity))

                        InsightRow(day: day)
                            .transition(.opacity)

                        DetailQuickGrid(day: day)
                            .transition(.move(edge: .bottom).combined(with: .opacity))
                    } else {
                        EmptyStateCard()
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 32)
            }
        }
        .navigationTitle("app_title")
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
                        store.refresh()
                    }
                } label: {
                    Image(systemName: "arrow.clockwise")
                }
            }
        }
        .onAppear {
            withAnimation(.easeOut(duration: 0.6)) {
                isVisible = true
            }
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("today_title")
                .font(AppFont.title())
                .foregroundStyle(AppTheme.textPrimary)

            HStack(spacing: 12) {
                Text(store.selectedLocationName)
                Circle().frame(width: 4, height: 4)
                Text("time_ist")
            }
            .font(AppFont.caption())
            .foregroundStyle(AppTheme.textSecondary)
        }
        .padding(.top, 12)
        .opacity(isVisible ? 1 : 0)
        .offset(y: isVisible ? 0 : 12)
    }
}

private struct TodayHeroCard: View {
    let day: PanchangDay

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(day.weekday.uppercased())
                        .font(AppFont.caption())
                        .foregroundStyle(AppTheme.accentSoft)

                    Text(day.displayDate)
                        .font(AppFont.headline())
                        .foregroundStyle(AppTheme.textPrimary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 6) {
                    Text(day.month)
                        .font(AppFont.caption())
                        .foregroundStyle(AppTheme.textSecondary)
                    Text(day.paksha)
                        .font(AppFont.caption())
                        .foregroundStyle(AppTheme.textSecondary)
                }
            }

            Text(day.tithi)
                .font(.system(size: 26, weight: .semibold, design: .serif))
                .foregroundStyle(AppTheme.textPrimary)

            Text(day.fasting)
                .font(AppFont.body())
                .foregroundStyle(AppTheme.textSecondary)
                .lineSpacing(4)

            Divider()
                .background(AppTheme.textSecondary.opacity(0.3))

            HStack(spacing: 16) {
                InfoPill(title: "sunrise", value: day.sunrise)
                InfoPill(title: "sunset", value: day.sunset)
                InfoPill(title: "moonrise", value: day.moonrise)
            }
        }
        .padding(20)
        .background(AppTheme.card)
        .cornerRadius(24)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(AppTheme.accent.opacity(0.25), lineWidth: 1)
        )
        .shadow(color: Color.black.opacity(0.3), radius: 20, x: 0, y: 12)
    }
}

private struct InsightRow: View {
    let day: PanchangDay

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("key_observances")
                .font(AppFont.headline())
                .foregroundStyle(AppTheme.textPrimary)

            HStack(spacing: 12) {
                ForEach(day.festivals, id: \.self) { festival in
                    Text(festival)
                        .font(AppFont.caption())
                        .foregroundStyle(AppTheme.textPrimary)
                        .padding(.vertical, 8)
                        .padding(.horizontal, 12)
                        .background(AppTheme.surface)
                        .cornerRadius(16)
                }
            }
        }
    }
}

private struct DetailQuickGrid: View {
    let day: PanchangDay

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("astronomical_details")
                .font(AppFont.headline())
                .foregroundStyle(AppTheme.textPrimary)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                QuickStat(title: "nakshatra", value: day.nakshatra)
                QuickStat(title: "yoga", value: day.yoga)
                QuickStat(title: "karana", value: day.karana)
                QuickStat(title: "auspicious", value: day.auspiciousWindow)
            }
        }
    }
}

private struct QuickStat: View {
    let title: LocalizedStringKey
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(AppFont.caption())
                .foregroundStyle(AppTheme.textSecondary)
                .textCase(.uppercase)

            Text(value)
                .font(AppFont.body())
                .foregroundStyle(AppTheme.textPrimary)
                .lineLimit(2)
        }
        .padding(14)
        .background(AppTheme.surface)
        .cornerRadius(16)
    }
}

private struct InfoPill: View {
    let title: LocalizedStringKey
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(AppFont.caption())
                .foregroundStyle(AppTheme.textSecondary)
                .textCase(.uppercase)
            Text(value)
                .font(AppFont.body())
                .foregroundStyle(AppTheme.textPrimary)
        }
    }
}

private struct EmptyStateCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("no_data_title")
                .font(AppFont.headline())
                .foregroundStyle(AppTheme.textPrimary)
            Text("no_data_body")
                .font(AppFont.body())
                .foregroundStyle(AppTheme.textSecondary)
        }
        .padding(20)
        .background(AppTheme.card)
        .cornerRadius(20)
    }
}

#Preview {
    NavigationStack {
        TodayView()
            .environmentObject(PanchangStore())
    }
}
