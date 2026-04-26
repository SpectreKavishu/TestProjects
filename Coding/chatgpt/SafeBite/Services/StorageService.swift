import Foundation
import UIKit
import FirebaseStorage

class StorageService {
    static let shared = StorageService()
    private let storage = Storage.storage()

    func uploadImage(image: UIImage?, completion: @escaping (Result<URL, Error>) -> Void) {
        guard let image = image, let data = image.jpegData(compressionQuality: 0.7) else { completion(.failure(NSError(domain: "no-image", code: 0))); return }
        let id = UUID().uuidString
        let ref = storage.reference().child("images/").child("\(id).jpg")
        ref.putData(data, metadata: nil) { meta, err in
            if let err = err { completion(.failure(err)); return }
            ref.downloadURL { url, err in
                if let err = err { completion(.failure(err)); return }
                if let url = url { completion(.success(url)) } else { completion(.failure(NSError(domain:"no-url", code:0))) }
            }
        }
    }
}
