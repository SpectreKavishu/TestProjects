import Foundation

struct PanchangResponse: Decodable {
    let location: PanchangLocation
    let days: [PanchangDay]
}

struct PanchangLocation: Decodable {
    let name: String
    let latitude: Double
    let longitude: Double
    let timezone: String
}

struct PanchangDay: Identifiable, Decodable {
    let id: String
    let date: Date
    let weekday: String
    let tithi: String
    let nakshatra: String
    let yoga: String
    let karana: String
    let sunrise: String
    let sunset: String
    let moonrise: String
    let moonset: String
    let paksha: String
    let month: String
    let festivals: [String]
    let fasting: String
    let auspiciousWindow: String
    let notes: String

    enum CodingKeys: String, CodingKey {
        case date
        case weekday
        case tithi
        case nakshatra
        case yoga
        case karana
        case sunrise
        case sunset
        case moonrise
        case moonset
        case paksha
        case month
        case festivals
        case fasting
        case auspiciousWindow
        case notes
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let dateString = try container.decode(String.self, forKey: .date)
        self.id = dateString
        self.date = DateFormatter.panchangDateFormatter.date(from: dateString) ?? Date()
        self.weekday = try container.decode(String.self, forKey: .weekday)
        self.tithi = try container.decode(String.self, forKey: .tithi)
        self.nakshatra = try container.decode(String.self, forKey: .nakshatra)
        self.yoga = try container.decode(String.self, forKey: .yoga)
        self.karana = try container.decode(String.self, forKey: .karana)
        self.sunrise = try container.decode(String.self, forKey: .sunrise)
        self.sunset = try container.decode(String.self, forKey: .sunset)
        self.moonrise = try container.decode(String.self, forKey: .moonrise)
        self.moonset = try container.decode(String.self, forKey: .moonset)
        self.paksha = try container.decode(String.self, forKey: .paksha)
        self.month = try container.decode(String.self, forKey: .month)
        self.festivals = try container.decode([String].self, forKey: .festivals)
        self.fasting = try container.decode(String.self, forKey: .fasting)
        self.auspiciousWindow = try container.decode(String.self, forKey: .auspiciousWindow)
        self.notes = try container.decode(String.self, forKey: .notes)
    }

    var displayDate: String {
        DateFormatter.panchangDisplayFormatter.string(from: date)
    }
}

extension DateFormatter {
    static let panchangDateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.timeZone = TimeZone(identifier: "Asia/Kolkata")
        formatter.locale = Locale(identifier: "en_IN")
        return formatter
    }()

    static let panchangDisplayFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d, yyyy"
        formatter.timeZone = TimeZone(identifier: "Asia/Kolkata")
        formatter.locale = Locale(identifier: "en_IN")
        return formatter
    }()
}
