import React, { useState, useEffect } from 'react';
import { ChevronRight, Sun, Moon, Star, Calendar, Bell, RefreshCw, Globe } from 'lucide-react';

export default function HinduCalendarApp() {
  const [panchangData, setPanchangData] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: 28.6139, lon: 77.2090, name: 'New Delhi' });
  const [scrollY, setScrollY] = useState(0);
  const [language, setLanguage] = useState('en'); // 'en' or 'hi'

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: language === 'hi' ? 'आपका स्थान' : 'Your Location'
          });
        },
        (error) => {
          console.log('Location error:', error);
        }
      );
    }
  }, [language]);

  // Fetch Panchang data
  useEffect(() => {
    fetchPanchangData();
  }, [location, language]);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    localStorage.setItem('appLanguage', newLang);
  };

  const translations = {
    en: {
      appTitle: 'Panchang',
      todayTithi: "Today's Tithi",
      endsAt: 'Ends at',
      nakshatra: 'Nakshatra',
      yoga: 'Yoga',
      karana: 'Karana',
      lord: 'Lord',
      sun: 'Sun',
      moon: 'Moon',
      auspiciousTimes: 'Auspicious Times',
      inauspiciousTimes: 'Inauspicious Times',
      rahuKaal: 'Rahu Kaal',
      gulikaKaal: 'Gulika Kaal',
      upcomingFestivals: 'Upcoming Festivals & Fasts',
      fasting: 'Fasting',
      loading: 'Loading Panchang...',
      error: 'Unable to Load Data',
      tryAgain: 'Try Again',
      brahmaVela: 'Brahma Muhurta',
      abhijitMuhurta: 'Abhijit Muhurta',
      vijayaMuhurta: 'Vijaya Muhurta',
      meditation: 'Meditation',
      auspicious: 'Auspicious',
      success: 'Success',
      festival: 'Festival',
      fast: 'Fasting',
      fullMoon: 'Full Moon',
      newMoon: 'New Moon',
      paksha: {
        shukla: 'Shukla Paksha',
        krishna: 'Krishna Paksha'
      }
    },
    hi: {
      appTitle: 'पंचांग',
      todayTithi: 'आज की तिथि',
      endsAt: 'समाप्ति',
      nakshatra: 'नक्षत्र',
      yoga: 'योग',
      karana: 'करण',
      lord: 'देवता',
      sun: 'सूर्य',
      moon: 'चंद्र',
      auspiciousTimes: 'शुभ मुहूर्त',
      inauspiciousTimes: 'अशुभ काल',
      rahuKaal: 'राहु काल',
      gulikaKaal: 'गुलिक काल',
      upcomingFestivals: 'आगामी त्यौहार और व्रत',
      fasting: 'उपवास',
      loading: 'पंचांग लोड हो रहा है...',
      error: 'डेटा लोड नहीं हो सका',
      tryAgain: 'पुनः प्रयास करें',
      brahmaVela: 'ब्रह्म मुहूर्त',
      abhijitMuhurta: 'अभिजीत मुहूर्त',
      vijayaMuhurta: 'विजय मुहूर्त',
      meditation: 'ध्यान',
      auspicious: 'शुभ',
      success: 'सफलता',
      festival: 'त्यौहार',
      fast: 'व्रत',
      fullMoon: 'पूर्णिमा',
      newMoon: 'अमावस्या',
      paksha: {
        shukla: 'शुक्ल पक्ष',
        krishna: 'कृष्ण पक्ष'
      }
    }
  };

  const t = translations[language];

  const fetchPanchangData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Using Free Astrology API with language support
      const API_KEY = 'YOUR_API_KEY_HERE';
      
      const response = await fetch('https://json.freeastrologyapi.com/complete-panchang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          year: year,
          month: month,
          date: date,
          hours: hours,
          minutes: minutes,
          seconds: 0,
          latitude: location.lat,
          longitude: location.lon,
          timezone: 5.5,
          language: language, // 'en' or 'hi'
          config: {
            observation_point: 'topocentric',
            ayanamsha: 'lahiri'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Panchang data');
      }

      const data = await response.json();
      setPanchangData(data);
      fetchUpcomingFestivals();
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Panchang:', err);
      setError(err.message);
      setLoading(false);
      loadSampleData();
    }
  };

  const fetchUpcomingFestivals = () => {
    const eventsEn = [
      {
        title: 'Maha Shivaratri',
        date: 'February 26, 2026',
        type: 'Festival',
        significance: 'Major festival dedicated to Lord Shiva',
        fasting: 'Complete fast with night vigil',
        color: '#FF6B35'
      },
      {
        title: 'Ekadashi',
        date: 'February 10, 2026',
        type: 'Fasting',
        significance: 'Jaya Ekadashi - auspicious for spiritual practices',
        fasting: 'No grains, cereals, or pulses',
        color: '#F7931E'
      },
      {
        title: 'Purnima',
        date: 'February 12, 2026',
        type: 'Full Moon',
        significance: 'Magha Purnima - sacred bath in holy rivers',
        fasting: 'Optional fasting until moonrise',
        color: '#4ECDC4'
      },
      {
        title: 'Holi',
        date: 'March 14, 2026',
        type: 'Festival',
        significance: 'Festival of colors celebrating victory of good over evil',
        fasting: 'No fasting - celebration day',
        color: '#FF006E'
      }
    ];

    const eventsHi = [
      {
        title: 'महा शिवरात्रि',
        date: '26 फरवरी, 2026',
        type: 'त्यौहार',
        significance: 'भगवान शिव को समर्पित प्रमुख त्यौहार',
        fasting: 'रात्रि जागरण के साथ पूर्ण उपवास',
        color: '#FF6B35'
      },
      {
        title: 'एकादशी',
        date: '10 फरवरी, 2026',
        type: 'व्रत',
        significance: 'जया एकादशी - आध्यात्मिक साधना के लिए शुभ',
        fasting: 'अनाज, अनाज या दालों का सेवन नहीं',
        color: '#F7931E'
      },
      {
        title: 'पूर्णिमा',
        date: '12 फरवरी, 2026',
        type: 'पूर्णिमा',
        significance: 'माघ पूर्णिमा - पवित्र नदियों में स्नान',
        fasting: 'चंद्रोदय तक वैकल्पिक उपवास',
        color: '#4ECDC4'
      },
      {
        title: 'होली',
        date: '14 मार्च, 2026',
        type: 'त्यौहार',
        significance: 'बुराई पर अच्छाई की जीत का उत्सव मनाने वाला रंगों का त्यौहार',
        fasting: 'उपवास नहीं - उत्सव का दिन',
        color: '#FF006E'
      }
    ];

    setUpcomingEvents(language === 'hi' ? eventsHi : eventsEn);
  };

  const loadSampleData = () => {
    const sampleDataEn = {
      day: 'Sunday',
      sunrise: '06:42:15',
      sunset: '18:15:30',
      moonrise: '15:30:20',
      moonset: '04:45:10',
      tithi: {
        details: {
          tithi_name: 'Dashami',
          tithi_number: 10
        },
        end_time: {
          hour: 14,
          minute: 23,
          second: 0
        }
      },
      paksha: 'Shukla Paksha',
      nakshatra: {
        details: {
          nak_name: 'Uttara Phalguni',
          deity: 'Aryaman'
        },
        end_time: {
          hour: 18,
          minute: 45,
          second: 0
        }
      },
      yog: {
        details: {
          yog_name: 'Shiva'
        }
      },
      karan: {
        details: {
          karan_name: 'Baalava'
        }
      },
      rahukaal: {
        start: '16:30:00',
        end: '18:00:00'
      },
      guliKaal: {
        start: '13:30:00',
        end: '15:00:00'
      },
      abhijit_muhurta: {
        start: '12:15',
        end: '13:03'
      }
    };

    const sampleDataHi = {
      day: 'रविवार',
      sunrise: '06:42:15',
      sunset: '18:15:30',
      moonrise: '15:30:20',
      moonset: '04:45:10',
      tithi: {
        details: {
          tithi_name: 'दशमी',
          tithi_number: 10
        },
        end_time: {
          hour: 14,
          minute: 23,
          second: 0
        }
      },
      paksha: 'शुक्ल पक्ष',
      nakshatra: {
        details: {
          nak_name: 'उत्तरा फाल्गुनी',
          deity: 'अर्यमा'
        },
        end_time: {
          hour: 18,
          minute: 45,
          second: 0
        }
      },
      yog: {
        details: {
          yog_name: 'शिव'
        }
      },
      karan: {
        details: {
          karan_name: 'बालव'
        }
      },
      rahukaal: {
        start: '16:30:00',
        end: '18:00:00'
      },
      guliKaal: {
        start: '13:30:00',
        end: '15:00:00'
      },
      abhijit_muhurta: {
        start: '12:15',
        end: '13:03'
      }
    };

    setPanchangData(language === 'hi' ? sampleDataHi : sampleDataEn);
  };

  if (loading && !panchangData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFEEDD 50%, #FFE4CC 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Crimson Text', serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={48} color="#FF6B35" style={{ animation: 'spin 2s linear infinite' }} />
          <p style={{ marginTop: '20px', color: '#8B4513', fontSize: '18px' }}>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error && !panchangData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFEEDD 50%, #FFE4CC 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Crimson Text', serif",
        padding: '24px'
      }}>
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '20px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#8B2835', marginBottom: '16px' }}>{t.error}</h2>
          <p style={{ color: '#5C3D2E', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={fetchPanchangData}
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif"
            }}
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (timeObj) => {
    if (!timeObj) return 'N/A';
    const hour = timeObj.hour || 0;
    const minute = timeObj.minute || 0;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const calculateTithiProgress = () => {
    if (!panchangData?.tithi?.end_time) return 50;
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const endHour = panchangData.tithi.end_time.hour + panchangData.tithi.end_time.minute / 60;
    const dayProgress = currentHour / 24;
    const tithiProgress = Math.min(100, dayProgress * 100);
    return tithiProgress;
  };

  const auspiciousTimes = [
    { 
      name: t.brahmaVela, 
      time: '04:48 - 05:36', 
      type: 'meditation' 
    },
    { 
      name: t.abhijitMuhurta, 
      time: panchangData?.abhijit_muhurta ? 
        `${panchangData.abhijit_muhurta.start} - ${panchangData.abhijit_muhurta.end}` : 
        '12:15 - 13:03',
      type: 'auspicious' 
    },
    { 
      name: t.vijayaMuhurta, 
      time: '14:30 - 15:18', 
      type: 'success' 
    }
  ];

  const formatDate = () => {
    const date = new Date();
    if (language === 'hi') {
      const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
      const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
      return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF8F0 0%, #FFEEDD 50%, #FFE4CC 100%)',
      fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Crimson Text', serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: `translateY(${scrollY * 0.3}px)`
      }} />
      
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(247,147,30,0.08) 0%, rgba(247,147,30,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: `translateY(${-scrollY * 0.2}px)`
      }} />

      {/* Header */}
      <header style={{
        padding: '60px 24px 24px 24px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '420px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <h1 style={{
              fontSize: language === 'hi' ? '36px' : '38px',
              fontWeight: '600',
              color: '#2C1810',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              {t.appTitle}
            </h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={toggleLanguage}
                style={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.2)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Globe size={16} />
                {language === 'en' ? 'हिं' : 'EN'}
              </button>
              <button
                onClick={fetchPanchangData}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <RefreshCw size={24} color="#8B4513" style={{ opacity: 0.7 }} />
              </button>
            </div>
          </div>
          <p style={{
            fontSize: '15px',
            color: '#8B4513',
            opacity: 0.8,
            margin: 0,
            fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif",
            fontWeight: '400'
          }}>
            {formatDate()}
          </p>
          <p style={{
            fontSize: '13px',
            color: '#8B4513',
            opacity: 0.6,
            margin: '4px 0 0 0',
            fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif"
          }}>
            📍 {location.name}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        padding: '0 24px 100px 24px',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          maxWidth: '420px',
          margin: '0 auto'
        }}>
          {/* Today's Panchang Card */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9F5 100%)',
            borderRadius: '24px',
            padding: '28px',
            marginBottom: '20px',
            boxShadow: '0 8px 32px rgba(139, 69, 19, 0.08), 0 2px 8px rgba(139, 69, 19, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            animation: 'fadeInUp 0.6s ease-out',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: language === 'hi' ? '22px' : '24px',
                fontWeight: '600',
                color: '#2C1810',
                margin: 0
              }}>
                {t.todayTithi}
              </h2>
              <div style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '600',
                fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif"
              }}>
                {panchangData?.paksha || t.paksha.shukla}
              </div>
            </div>

            <div style={{
              fontSize: language === 'hi' ? '38px' : '42px',
              fontWeight: '600',
              color: '#FF6B35',
              marginBottom: '8px',
              letterSpacing: '-0.02em'
            }}>
              {panchangData?.tithi?.details?.tithi_name || (language === 'hi' ? 'लोड हो रहा है...' : 'Loading...')}
            </div>

            <div style={{
              fontSize: '15px',
              color: '#8B4513',
              opacity: 0.7,
              marginBottom: '20px',
              fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif"
            }}>
              {t.endsAt} {formatTime(panchangData?.tithi?.end_time)}
            </div>

            {/* Progress bar */}
            <div style={{
              background: 'rgba(255, 107, 53, 0.1)',
              height: '6px',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '28px'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)',
                height: '100%',
                width: `${calculateTithiProgress()}%`,
                borderRadius: '3px',
                transition: 'width 1s ease-out'
              }} />
            </div>

            {/* Nakshatra and other details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(139, 69, 19, 0.1)'
            }}>
              <div>
                <div style={{
                  fontSize: '13px',
                  color: '#8B4513',
                  opacity: 0.6',
                  marginBottom: '4px',
                  fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif",
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {t.nakshatra}
                </div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '600',
                  color: '#2C1810'
                }}>
                  {panchangData?.nakshatra?.details?.nak_name || 'N/A'}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#8B4513',
                  opacity: 0.6,
                  fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif"
                }}>
                  {t.lord} {panchangData?.nakshatra?.details?.deity || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '13px',
                  color: '#8B4513',
                  opacity: 0.6,
                  marginBottom: '4px',
                  fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif",
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {t.yoga}
                </div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '600',
                  color: '#2C1810'
                }}>
                  {panchangData?.yog?.details?.yog_name || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '13px',
                  color: '#8B4513',
                  opacity: 0.6,
                  marginBottom: '4px',
                  fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif",
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {t.karana}
                </div>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '600',
                  color: '#2C1810'
                }}>
                  {panchangData?.karan?.details?.karan_name || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Sun and Moon Timings */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #FFF9E6 0%, #FFE4CC 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(255, 107, 53, 0.06)',
              animation: 'fadeInUp 0.6s ease-out 0.1s both'
            }}>
              <Sun size={28} color="#FF6B35" style={{ marginBottom: '12px' }} />
              <div style={{
                fontSize: '13px',
                color: '#8B4513',
                opacity: 0.7,
                marginBottom: '8px',
                fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif",
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {t.sun}
              </div>
              <div style={{
                fontSize: '15px',
                color: '#2C1810',
                fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif",
                lineHeight: '1.6'
              }}>
                <div>↑ {panchangData?.sunrise || 'N/A'}</div>
                <div>↓ {panchangData?.sunset || 'N/A'}</div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #E8F4F8 0%, #D4E9F0 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(78, 205, 196, 0.06)',
              animation: 'fadeInUp 0.6s ease-out 0.2s both'
            }}>
              <Moon size={28} color="#4ECDC4" style={{ marginBottom: '12px' }} />
              <div style={{
                fontSize: '13px',
                color: '#2C5F6F',
                opacity: 0.7,
                marginBottom: '8px',
                fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif",
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {t.moon}
              </div>
              <div style={{
                fontSize: '15px',
                color: '#2C1810',
                fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif",
                lineHeight: '1.6'
              }}>
                <div>↑ {panchangData?.moonrise || 'N/A'}</div>
                <div>↓ {panchangData?.moonset || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Auspicious Times */}
          <div style={{
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: language === 'hi' ? '20px' : '22px',
              fontWeight: '600',
              color: '#2C1810',
              marginBottom: '16px',
              paddingLeft: '4px'
            }}>
              {t.auspiciousTimes}
            </h3>

            {auspiciousTimes.map((time, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9F5 100%)',
                  borderRadius: '18px',
                  padding: '20px 24px',
                  marginBottom: '12px',
                  boxShadow: '0 4px 16px rgba(139, 69, 19, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  animation: `fadeInUp 0.6s ease-out ${0.3 + index * 0.1}s both`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '600',
                    color: '#2C1810',
                    marginBottom: '2px'
                  }}>
                    {time.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#8B4513',
                    opacity: 0.7,
                    fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif"
                  }}>
                    {time.time}
                  </div>
                </div>
                <Star size={20} color="#F7931E" fill="#F7931E" opacity={0.8} />
              </div>
            ))}
          </div>

          {/* Inauspicious Times */}
          <div style={{
            background: 'linear-gradient(135deg, #FFE8E8 0%, #FFD4D4 100%)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 4px 16px rgba(255, 107, 53, 0.06)',
            animation: 'fadeInUp 0.6s ease-out 0.6s both'
          }}>
            <h4 style={{
              fontSize: '17px',
              fontWeight: '600',
              color: '#8B2835',
              marginBottom: '16px',
              margin: 0
            }}>
              {t.inauspiciousTimes}
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              fontSize: '15px',
              fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif"
            }}>
              <div>
                <div style={{
                  fontSize: '13px',
                  color: '#8B2835',
                  opacity: 0.7,
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {t.rahuKaal}
                </div>
                <div style={{ color: '#5C1B23', fontWeight: '500' }}>
                  {panchangData?.rahukaal ? 
                    `${panchangData.rahukaal.start} - ${panchangData.rahukaal.end}` : 
                    'N/A'}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '13px',
                  color: '#8B2835',
                  opacity: 0.7,
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {t.gulikaKaal}
                </div>
                <div style={{ color: '#5C1B23', fontWeight: '500' }}>
                  {panchangData?.guliKaal ? 
                    `${panchangData.guliKaal.start} - ${panchangData.guliKaal.end}` : 
                    'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: language === 'hi' ? '20px' : '22px',
              fontWeight: '600',
              color: '#2C1810',
              marginBottom: '16px',
              paddingLeft: '4px'
            }}>
              {t.upcomingFestivals}
            </h3>

            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9F5 100%)',
                  borderRadius: '20px',
                  padding: '24px',
                  marginBottom: '16px',
                  boxShadow: '0 6px 24px rgba(139, 69, 19, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  animation: `fadeInUp 0.6s ease-out ${0.7 + index * 0.1}s both`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '5px',
                  background: event.color
                }} />
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#2C1810',
                      marginBottom: '4px'
                    }}>
                      {event.title}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#8B4513',
                      opacity: 0.7,
                      fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif"
                    }}>
                      {event.date}
                    </div>
                  </div>
                  <div style={{
                    background: event.color,
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: '600',
                    fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif"
                  }}>
                    {event.type}
                  </div>
                </div>

                <p style={{
                  fontSize: '15px',
                  color: '#5C3D2E',
                  lineHeight: '1.6',
                  margin: '0 0 12px 0',
                  fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif"
                }}>
                  {event.significance}
                </p>

                <div style={{
                  background: 'rgba(139, 69, 19, 0.05)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#5C3D2E',
                  fontFamily: language === 'hi' ? "'Tiro Devanagari Hindi', serif" : "'Lora', serif",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ opacity: 0.7 }}>🍽️</span>
                  <span><strong>{t.fasting}:</strong> {event.fasting}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Lora:wght@400;500;600&family=Tiro+Devanagari+Hindi:wght@400;500;600&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}
