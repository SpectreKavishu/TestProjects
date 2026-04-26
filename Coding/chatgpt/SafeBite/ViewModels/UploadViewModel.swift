import Foundation
import UIKit
import Combine

class UploadViewModel: ObservableObject {
    @Published var uploading = false
    @Published var resultScore: Double?
    private var storage = StorageService.shared
    private var firestore = FirestoreService.shared
    private var scorer = CoreMLScorer.shared

    func uploadReview(vendorId: String, image: UIImage?, rating: Int, comment: String?) {
        uploading = true
        var aiScore: Double? = nil
        if let img = image { aiScore = scorer.score(image: img) }
        storage.uploadImage(image: image) { res in
            switch res {
            case .success(let url):
                let review = Review(id: UUID().uuidString, vendorId: vendorId, userId: "anon", rating: rating, comment: comment, imageUrl: url.absoluteString, aiScore: aiScore, createdAt: Date())
                self.firestore.addReview(review: review) { r in
                    DispatchQueue.main.async { self.uploading = false; if case .success = r { self.resultScore = aiScore } }
                }
            case .failure:
                let review = Review(id: UUID().uuidString, vendorId: vendorId, userId: "anon", rating: rating, comment: comment, imageUrl: nil, aiScore: aiScore, createdAt: Date())
                self.firestore.addReview(review: review) { r in
                    DispatchQueue.main.async { self.uploading = false; if case .success = r { self.resultScore = aiScore } }
                }
            }
        }
    }
}
