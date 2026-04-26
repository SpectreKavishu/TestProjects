import SwiftUI
import CoreLocation
import MapKit

struct HomeView: View {
    @StateObject var vm = VendorViewModel()
    @State private var region = MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: 19.0760, longitude: 72.8777), span: MKCoordinateSpan(latitudeDelta: 0.02, longitudeDelta: 0.02))
    @State private var showUpload = false
    var body: some View {
        NavigationView {
            VStack {
                MapView(vendors: vm.vendors, region: $region).frame(height: 260).cornerRadius(16).padding()
                HStack { Text("Nearby Vendors").font(.headline); Spacer(); Button(action: { showUpload = true }) { Text("Report") } }.padding(.horizontal)
                ScrollView { LazyVStack(spacing:12) { ForEach(vm.vendors) { v in VendorCardView(vendor: v).padding(.horizontal) } } }
            }
            .navigationBarTitleDisplayMode(.inline).navigationTitle("SafeBite").sheet(isPresented: $showUpload) { UploadView() }
            .onAppear { let loc = CLLocationCoordinate2D(latitude: 19.0760, longitude: 72.8777); vm.fetchNearby(location: loc) }
        }
    }
}
