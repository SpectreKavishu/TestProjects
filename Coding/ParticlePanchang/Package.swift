// swift-tools-version: 6.2
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "ParticlePanchang",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .executable(name: "ParticlePanchang", targets: ["ParticlePanchang"])
    ],
    targets: [
        .executableTarget(
            name: "ParticlePanchang",
            resources: [
                .process("Resources")
            ]
        )
    ]
)
