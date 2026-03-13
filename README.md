# Employee Insights Dashboard

A high-performance React dashboard featuring custom virtualization, camera integration, and automated audit image merging.

## Core Features

- **Auth System**: Built with React Context API and `localStorage` persistence.
- **Virtualized List**: Custom-built high-performance table with manual scrolling math.
- **Audit Process**: Integrated camera capture via MediaDevices API with HTML5 Canvas signature overlay.
- **Analytics**: Raw SVG-based data visualization and Leaflet maps for location tracking.

## Architecture

The project follows a modular structure:
- `src/context`: Auth state management.
- `src/components`: UI components (VirtualGrid, Camera, etc.).
- `src/pages`: Main application screens guarded by `ProtectedRoute`.
- `src/index.css`: Tailwind CSS v4 styling.

## Technical Explanations

### Virtualization Math
The `VirtualGrid` component handles large datasets by rendering only the visible window plus a small buffer.
- `startIndex`: `Math.floor(scrollTop / rowHeight) - buffer`
- `endIndex`: `Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer`
- Rows are absolutely positioned using `top: index * rowHeight`.

### Image Merging
The final audit image is created by:
1. Drawing the captured JPEG photo onto a hidden off-screen canvas.
2. Layering the signature canvas data on top using `drawImage`.
3. Exporting the result as a Base64 string using `canvas.toDataURL()`.

### City Coordinate Mapping
Since we're not using a geocoding API, I've implemented a manual coordinate lookup table for major Indian cities:
```javascript
const CITY_COORDINATES = {
  'Mumbai': [19.0760, 72.8777],
  'Delhi': [28.6139, 77.2090],
  // ... (Full list in src/pages/Analytics.jsx)
};
```

## Intentional Bug

**Bug**: Potential Memory Leak in `CameraCapture` component.
**Explanation**: The camera's `MediaStream` is not properly cleaned up when the user navigates away from the `/details` page before completing the capture or if the component unmounts unexpectedly. The `useEffect` cleanup function is missing, which could keep the camera active in the background.

## Setup

1. `npm install`
2. `npm run dev`

**Credentials:**
- Username: `testuser`
- Password: `Test123`
