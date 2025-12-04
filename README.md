# Audio Player with Waveform Visualization

Modern web audio player with interactive waveform visualization built with React and D3.js.

## Features

- **Audio File Upload** - via file picker or drag-and-drop
- **Waveform Visualization** - interactive waveform chart using D3.js
- **Track Navigation**:
  - Drag cursor for precise navigation
  - Click anywhere on the waveform to jump to position
- **Playback Controls**:
  - Play / Pause / Stop
  - Volume control
  - Display current time and track duration
- **Responsive Interface** - works on all devices

## Technologies

- **React 19** - UI framework
- **TypeScript** - type safety and code quality
- **D3.js** - data visualization and charting
- **Web Audio API** - audio processing and playback
- **SCSS Modules** - isolated component styles
- **Vite** - fast build tool and dev server

## Installation and Usage

### Requirements
- Node.js 18+
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```
Application will open at [http://localhost:5173](http://localhost:5173)

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Project Structure

```
my-audio-player/
├── src/
│   ├── components/          # React components
│   │   ├── Player/         # Main player component
│   │   │   ├── SoundDriver/    # Audio management (Web Audio API)
│   │   │   └── Drawer/         # Waveform visualization (D3.js)
│   │   ├── PlayerControls/     # Control buttons
│   │   ├── VolumeControl/      # Volume slider
│   │   ├── WaveformContainer/  # Chart container
│   │   ├── FileUpload/         # File picker upload
│   │   ├── DragAndDrop/        # Drag & drop zone
│   │   └── TrackInfo/          # Track information display
│   ├── pages/              # Application pages
│   │   ├── HomePage/           # Home page (file upload)
│   │   └── PlayerPage/         # Player page
│   ├── context/            # React Context
│   │   └── AudioContext.tsx    # Global audio state
│   ├── utils/              # Utilities
│   │   ├── formatTime.ts       # Time formatting
│   │   ├── throttle.ts         # Function throttling
│   │   └── validateAudioFile.ts # File validation
│   ├── types/              # TypeScript types
│   └── styles/             # Global styles
└── package.json
```

## Architecture

### SoundDriver
Audio management class using Web Audio API:
- Audio file decoding
- Playback, pause, stop
- Time navigation (seek)
- Volume control
- Synchronization with visualization

### Drawer
Interactive visualization class with D3.js:
- Waveform rendering
- Animated playback cursor
- Drag-and-drop cursor navigation
- Click-to-seek on waveform
- Timeline with time markers

### Implementation Details

#### Performance Optimization
- **GPU Acceleration** - using `will-change` and `isolation` for cursor
- **Throttling** - limiting update frequency during drag (8ms)
- **React.memo** - preventing unnecessary re-renders
- **d3.timer Animation** - smooth cursor updates

#### State Management
- Context API for global audio file state
- useRef for storing SoundDriver instance
- Proper resource cleanup on unmount

#### Event Handling
- Transparent overlay on top of waveform for click handling
- Protection against accidental clicks during drag
- Correct coordinate handling with margin offset

## Key Components

### Player
Main player component managing:
- SoundDriver and Drawer initialization
- Audio file loading
- Loading state
- Coordination between UI and audio

### PlayerControls
Playback control panel:
- Play - start/resume playback
- Pause - pause playback
- Stop - stop and reset position
- New Audio - load new file

### WaveformContainer
Visualization container with loading state support

### VolumeControl
Volume slider (0-1)

### TrackInfo
Display information:
- File name
- Current time / total duration

## Supported Formats

All audio formats supported by the browser:
- MP3
- WAV
- OGG
- M4A
- FLAC
- AAC

## Browser Compatibility

Project uses Web Audio API and requires a modern browser:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Adding New Features
1. Create component in `src/components/`
2. Add types in `src/types/`
3. Use SCSS modules for styles
4. Update Context if needed

### Working with Audio
SoundDriver uses Web Audio API:
```typescript
const driver = new SoundDriver(audioFile);
await driver.init(container);
driver.drawChart();
await driver.play();
```

### Working with Visualization
Drawer uses D3.js for rendering:
```typescript
const drawer = new Drawer(audioBuffer, container, onSeek);
drawer.init(); // render waveform
drawer.startAnimation(() => getCurrentTime()); // animate cursor
```

## License

MIT

## Version

2.0.0
