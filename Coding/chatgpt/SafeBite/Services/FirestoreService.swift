import Foundation
import FirebaseFirestore
import CoreLocation

class FirestoreService {
    static let shared = FirestoreService()
    private init() {}
    private let db = Firestore.firestore()

    func fetchVendors(around location: CLLocationCoordinate2D, radiusKm: Double, completion: @escaping (Result<[Vendor], Error>) -> Void) {
        db.collection("vendors").getDocuments { snapshot, error in
            if let error = error { completion(.failure(error)); return }
            guard let docs = snapshot?.documents else { completion(.success([])); return }
            let vendors: [Vendor] = docs.compactMap { doc in try? doc.data(as: Vendor.self) }
            let filtered = vendors.filter { v in
                let d = distanceKm(lat1: location.latitude, lon1: location.longitude, lat2: v.latitude, lon2: v.longitude)
                return d <= radiusKm
            }
            completion(.success(filtered))
        }
    }

    func addReview(review: Review, completion: @escaping (Result<Void, Error>) -> Void) {
        do {
            try db.collection("reviews").document(review.id).setData(from: review) { err in
                if let err = err { completion(.failure(err)) } else { completion(.success(())) }
            }
        } catch { completion(.failure(error)) }
    }

    private func distanceKm(lat1: Double, lon1: Double, lat2: Double, lon2: Double) -> Double {
        let R = 6371.0
        let dLat = (lat2 - lat1) * Double.pi / 180.0
        let dLon = (lon2 - lon1) * Double.pi / 180.0
        let a = sin(dLat/2)*sin(dLat/2) + cos(lat1*Double.pi/180)*cos(lat2*Double.pi/180)*sin(dLon/2)*sin(dLon/2)
        let c = 2 * atan2(sqrt(a), sqrt(1-a))
        return R * c
    }
}
