import Foundation
import SwiftUI

final class PanchangStore: ObservableObject {
    @Published var location: PanchangLocation = .init(name: "Loading…", latitude: 0, longitude: 0, timezone: "Asia/Kolkata")
    @Published var days: [PanchangDay] = []
    @Published var selectedLocationName: String = "Pune, India"

    init() {
        loadSample()
    }

    var today: PanchangDay? {
        days.first
    }

    func loadSample() {
        guard let url = Bundle.module.url(forResource: "sample_panchang", withExtension: "json") else {
            return
        }

        do {
            let data = try Data(contentsOf: url)
            let response = try JSONDecoder().decode(PanchangResponse.self, from: data)
            DispatchQueue.main.async {
                self.location = response.location
                self.days = response.days
                self.selectedLocationName = response.location.name
            }
        } catch {
            print("Failed to load sample data: \(error)")
        }
    }

    func refresh() {
        // Placeholder for API refresh.
        loadSample()
    }
}
