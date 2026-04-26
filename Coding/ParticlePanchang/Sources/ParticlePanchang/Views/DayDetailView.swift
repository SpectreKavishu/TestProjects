import SwiftUI

struct DayDetailView: View {
    let day: PanchangDay

    var body: some View {
        ZStack {
            BackgroundView()

            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(day.displayDate)
                            .font(AppFont.title())
                            .foregroundStyle(AppTheme.textPrimary)
                        Text(day.weekday)
                            .font(AppFont.caption())
                            .foregroundStyle(AppTheme.textSecondary)
                    }

                    SectionCard(title: "section_tithi") {
                        Text(day.tithi)
                            .font(AppFont.headline())
                        Text(day.fasting)
                            .font(AppFont.body())
                            .foregroundStyle(AppTheme.textSecondary)
                    }

                    SectionCard(title: "section_panchang") {
                        DetailRow(label: "nakshatra", value: day.nakshatra)
                        DetailRow(label: "yoga", value: day.yoga)
                        DetailRow(label: "karana", value: day.karana)
                        DetailRow(label: "paksha", value: day.paksha)
                        DetailRow(label: "month", value: day.month)
                    }

                    SectionCard(title: "section_sun_moon") {
                        DetailRow(label: "sunrise", value: day.sunrise)
                        DetailRow(label: "sunset", value: day.sunset)
                        DetailRow(label: "moonrise", value: day.moonrise)
                        DetailRow(label: "moonset", value: day.moonset)
                    }

                    SectionCard(title: "section_auspicious") {
                        Text(day.auspiciousWindow)
                            .font(AppFont.headline())
                        Text(day.notes)
                            .font(AppFont.body())
                            .foregroundStyle(AppTheme.textSecondary)
                    }

                    if !day.festivals.isEmpty {
                        SectionCard(title: "section_festivals") {
                            ForEach(day.festivals, id: \.self) { festival in
                                Text(festival)
                                    .font(AppFont.body())
                                    .foregroundStyle(AppTheme.textPrimary)
                            }
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 32)
            }
        }
        .navigationTitle("day_details_title")
    }
}

#Preview {
    NavigationStack {
        DayDetailView(day: PanchangStore().days.first!)
    }
}
