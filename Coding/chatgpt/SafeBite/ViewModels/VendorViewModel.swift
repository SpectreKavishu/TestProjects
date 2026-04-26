import Foundation
import Combine
import CoreLocation

class VendorViewModel: ObservableObject {
    @Published var vendors: [Vendor] = []
    @Published var loading = false
    private var service = FirestoreService.shared

    func fetchNearby(location: CLLocationCoordinate2D, radiusKm: Double = 3.0) {
        loading = true
        service.fetchVendors(around: location, radiusKm: radiusKm) { result in
            DispatchQueue.main.async {
                self.loading = false
                switch result {
                case .success(let vs): self.vendors = vs
                case .failure(let e): print("fetch error", e)
                }
            }
        }
    }
}
