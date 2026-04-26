import Foundation
import FirebaseAuth
import Combine

class AuthViewModel: ObservableObject {
    @Published var user: UserModel?
    private var handle: AuthStateDidChangeListenerHandle?

    init() {
        handle = Auth.auth().addStateDidChangeListener { [weak self] _, user in
            guard let self = self else { return }
            if let u = user { self.user = UserModel(id: u.uid, name: u.displayName, email: u.email) } else { self.user = nil }
        }
    }

    deinit { if let handle = handle { Auth.auth().removeStateDidChangeListener(handle) } }

    func signInAnonymously() { Auth.auth().signInAnonymously { res, err in if let err = err { print("Auth error:", err) } } }
    func signOut() { do { try Auth.auth().signOut(); self.user = nil } catch { print("SignOut error", error) } }
}
