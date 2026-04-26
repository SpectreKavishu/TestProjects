import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var store: PanchangStore

    var body: some View {
        ZStack {
            BackgroundView()

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("settings_title")
                        .font(AppFont.title())
                        .foregroundStyle(AppTheme.textPrimary)
                        .padding(.top, 12)

                    SectionCard(title: "location_title") {
                        Text(store.selectedLocationName)
                            .font(AppFont.headline())
                            .foregroundStyle(AppTheme.textPrimary)
                        Text(String(format: NSLocalizedString("timezone_label", bundle: .module, comment: ""), store.location.timezone))
                            .font(AppFont.caption())
                            .foregroundStyle(AppTheme.textSecondary)
                        Text("gps_coming")
                            .font(AppFont.body())
                            .foregroundStyle(AppTheme.textSecondary)
                    }

                    SectionCard(title: "data_source_title") {
                        Text("data_source_name")
                            .font(AppFont.headline())
                            .foregroundStyle(AppTheme.textPrimary)
                        Text("data_source_body")
                            .font(AppFont.body())
                            .foregroundStyle(AppTheme.textSecondary)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 32)
            }
        }
        .navigationTitle("settings_title")
    }
}

#Preview {
    NavigationStack {
        SettingsView()
            .environmentObject(PanchangStore())
    }
}
