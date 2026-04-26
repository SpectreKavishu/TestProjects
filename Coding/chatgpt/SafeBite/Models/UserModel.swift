import Foundation

struct UserModel: Identifiable, Codable {
    var id: String
    var name: String?
    var email: String?
    var isVendor: Bool = false
}
