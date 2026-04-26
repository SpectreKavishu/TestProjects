import Foundation

struct Review: Identifiable, Codable {
    var id: String
    var vendorId: String
    var userId: String
    var rating: Int
    var comment: String?
    var imageUrl: String?
    var aiScore: Double?
    var createdAt: Date = Date()
}
