import Foundation
import UIKit

class CoreMLScorer {
    static let shared = CoreMLScorer()

    func score(image: UIImage) -> Double {
        guard let cg = image.cgImage else { return 50 }
        let width = cg.width
        let height = cg.height
        let bytesPerRow = width * 4
        let totalBytes = height * bytesPerRow
        guard let data = calloc(totalBytes, 1) else { return 50 }
        defer { free(data) }
        let colorSpace = CGColorSpaceCreateDeviceRGB()
        guard let ctx = CGContext(data: data, width: width, height: height, bitsPerComponent: 8, bytesPerRow: bytesPerRow, space: colorSpace, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { return 50 }
        ctx.draw(cg, in: CGRect(x: 0, y: 0, width: width, height: height))
        let ptr = data.assumingMemoryBound(to: UInt8.self)
        var sumBrightness: Double = 0
        for i in stride(from: 0, to: totalBytes, by: 4) {
            let r = Double(ptr[i])
            let g = Double(ptr[i+1])
            let b = Double(ptr[i+2])
            let brightness = (r + g + b) / 3.0
            sumBrightness += brightness
        }
        let pxCount = Double(width * height)
        let avgBrightness = sumBrightness / pxCount
        let norm = (avgBrightness / 255.0) * 100.0
        let score = min(max(norm, 20), 95)
        return score
    }
}
