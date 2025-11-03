# 🌪️ PanahON - BagyoWatch PH

A comprehensive React Native weather and typhoon tracking app for the Philippines. Stay informed about typhoon conditions, receive real-time alerts, and access essential safety tips.

## ✨ Features

### 🧭 Location Detection
- Automatic GPS location detection
- Reverse geocoding to show city/province
- Manual location selection option
- Auto-refresh when location changes

### ☁️ Weather & Typhoon Data
- Real-time weather from OpenWeatherMap API
- Temperature, humidity, wind speed & direction
- Weather condition icons
- Signal level calculation (0-5)
- 5-day weather forecast

### 🔔 Bagyo Alerts & Notifications
- Automatic alerts when signal levels increase
- Wind speed threshold detection
- Heavy rain and thunderstorm alerts
- Local notifications with vibration
- Custom Filipino/English alert messages
- Alert history stored locally

### 🌧️ Animated Weather Background
- Dynamic backgrounds based on weather conditions
- Rain animation overlays
- Thunder flash effects for storms
- Smooth transitions between conditions

### 🧍‍♂️ 2D Character Assistant
- Contextual character reactions by signal level
- Speech bubbles with safety messages
- Visual feedback for current conditions

### 🗺️ Map View
- Interactive map showing current location
- Typhoon coordinate markers
- Storm path visualization
- Pinch-to-zoom and pan support

### 📅 Forecast & Details
- 3-5 day weather forecast
- Temperature, humidity, precipitation
- Wind speed and direction
- Weather condition icons
- Scrollable forecast cards

### 🔔 Alert History
- Complete log of past alerts
- Signal level indicators
- Timestamp and location tracking
- Detailed weather information

### 🧰 Safety & Preparedness Tips
- Guidelines for each signal level (1-5)
- Emergency hotlines (NDRRMC, PAGASA, Red Cross)
- Essential items checklist
- Offline access to safety information

### ⚙️ Settings
- Toggle notifications on/off
- Sound effects control
- Theme selection (Light/Dark)
- Language toggle (Filipino/English)
- Reset app data option
- Access to safety tips

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/panahon.git
cd panahon
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure API Key**
   - Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Open `src/config/config.js`
   - Replace `YOUR_OPENWEATHER_API_KEY` with your actual API key

4. **Run the app**
```bash
npm start
# or
expo start
```

Then choose to run on:
- iOS simulator (press `i`)
- Android emulator (press `a`)
- Physical device (scan QR code with Expo Go app)

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **React Navigation** - Navigation library
- **React Context** - State management
- **AsyncStorage** - Local data persistence
- **Expo Location** - GPS and geolocation
- **Expo Notifications** - Push notifications
- **React Native Maps** - Map visualization
- **Axios** - HTTP client
- **date-fns** - Date formatting
- **OpenWeatherMap API** - Weather data

## 📁 Project Structure

```
panahon/
├── App.js                          # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── README.md                       # This file
├── src/
│   ├── config/
│   │   └── config.js               # API keys and configuration
│   ├── context/
│   │   ├── WeatherContext.js       # Weather state management
│   │   └── ThemeContext.js         # Theme management
│   ├── navigation/
│   │   └── Navigation.js           # App navigation setup
│   ├── screens/
│   │   ├── HomeScreen.js           # Main weather dashboard
│   │   ├── MapScreen.js            # Map view with location
│   │   ├── ForecastScreen.js       # 5-day forecast
│   │   ├── AlertsScreen.js         # Alert history
│   │   ├── SettingsScreen.js       # User preferences
│   │   └── SafetyTipsScreen.js     # Safety guidelines
│   ├── services/
│   │   ├── locationService.js      # GPS and geocoding
│   │   ├── weatherService.js       # Weather API calls
│   │   └── notificationService.js  # Alert notifications
│   └── components/
│       ├── AnimatedWeatherBackground.js  # Weather animations
│       ├── CharacterAssistant.js         # 2D assistant
│       └── AlertCard.js                  # Alert display
└── assets/                         # Images, icons, etc.
```

## 🌟 Key Features Explained

### Signal Level Calculation
Typhoon signal levels are automatically calculated based on wind speed:
- **Signal 0**: No alert (< 30 km/h)
- **Signal 1**: Strong Wind (30-60 km/h)
- **Signal 2**: Tropical Storm (60-100 km/h)
- **Signal 3**: Strong Typhoon (100-185 km/h)
- **Signal 4**: Very Strong Typhoon (185-220 km/h)
- **Signal 5**: Super Typhoon (> 220 km/h)

### Animated Backgrounds
Weather conditions trigger different animated backgrounds:
- **Clear**: Bright blue sky
- **Clouds**: Gray overcast
- **Rain/Drizzle**: Dark with rain animation
- **Thunderstorm**: Very dark with lightning flash effects

### Multi-language Support
The app supports both Filipino and English:
- Alert messages
- Safety tips
- UI labels
- Emergency instructions

## 🚀 Development

### Adding New Features
1. Create feature branch
2. Implement changes
3. Test on both iOS and Android
4. Submit pull request

### Code Style
- Use functional components and hooks
- Follow React Native best practices
- Maintain consistent code formatting
- Add comments for complex logic

## 📱 Permissions

The app requires the following permissions:
- **Location**: For weather data by location
- **Notifications**: For typhoon alerts
- **Storage**: For local data caching

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed by Crisvin Habitsuela for the Filipino people

## ⚠️ Disclaimer

This app provides weather information and alerts based on available data. Always follow official government advisories and evacuate when instructed by authorities during typhoon emergencies.

## 🙏 Credits

- **OpenWeatherMap** - Weather data API
- **PAGASA** - Official Philippine weather authority
- **NDRRMC** - National disaster management

---

**Stay Safe. Stay Informed. PanahON! 🌪️🇵🇭**

