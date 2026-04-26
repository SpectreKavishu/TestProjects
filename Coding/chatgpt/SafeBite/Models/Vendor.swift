import Foundation
import CoreLocation

struct Vendor: Identifiable, Codable {
    var id: String
    var name: String
    var description: String?
    var latitude: Double
    var longitude: Double
    var address: String?
    var score: Double = 50.0
    var verified: Bool = false
    var createdAt: Date = Date()

    var location: CLLocationCoordinate2D { CLLocationCoordinate2D(latitude: latitude, longitude: longitude) }
}
