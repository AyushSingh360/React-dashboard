# Employee Insights Dashboard

A high-performance React dashboard featuring custom virtualization, camera integration, and automated audit image merging. This project was built from scratch without any pre-made component libraries or utility libraries for core logic.

## Technical Compliance Checklist

- [x] **Zero UI Libraries**: Built exclusively with raw Tailwind CSS v4. No MUI, Ant Design, or Bootstrap.
- [x] **Zero Core Utilities**: Virtualization logic is 100% custom. No `react-window` or `react-virtualized`.
- [x] **Secure Auth**: Persistent context-based Auth Provider with route guards and session persistence.
- [x] **Data Visualization**: Salary distributions rendered using raw SVG elements.
- [x] **Identity Verification**: Native Camera API integration with HTML5 Canvas signature merging.
- [x] **Geospatial Mapping**: Leaflet implementation with custom city-to-coordinate lookup.
- [x] **Intentional Vulnerability**: One documented memory leak (see below).

## Deep-Dive Technical Logic

### 1. Custom Virtualization Math
The `VirtualGrid` component implements a high-performance windowing system to handle large employee datasets smoothly.
- **Scroll Tracking**: We listen to the `onScroll` event of a fixed-height container and store the `scrollTop` in state.
- **Index Calculation**:
    - `startIndex`: `Math.max(0, Math.floor(scrollTop / rowHeight) - buffer)`
    - `endIndex`: `Math.min(data.length, Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer)`
- **Dom Rendering**: We render a "spacer" div with the `totalHeight` (`data.length * rowHeight`) to maintain scrollbar integrity.
- **Absolute Positioning**: Visible rows are slice-selected and positioned absolutely using `top: index * rowHeight`. This prevents the browser from re-painting the entire list on every scroll tick.

### 2. The "Blob" Image Merging
The audit process culminates in a programmatic merge of the biometric photo and the digital signature.
1. **Source 1**: A 1280x720 JPEG frame captured from the `MediaDevices` stream.
2. **Source 2**: A transparent HTML5 Canvas containing the user's vectorized signature.
3. **Merging Process**:
    - Create a hidden off-screen `canvas` element.
    - Set dimensions to match the captured photo.
    - `ctx.drawImage(photoImg, 0, 0)`: Lay down the base photo.
    - `ctx.drawImage(signatureCanvas, 0, 0, w, h)`: Layer the signature on top, scaling it to fit the photo's aspect ratio.
4. **Export**: The result is exported via `toDataURL('image/png')`, resulting in a single flattened Base64 string representing the legal audit record.

### 3. City Coordinate Mapping
To avoid external geocoding API dependencies, I implemented a static lookup table in `Analytics.jsx`. This maps city names returned by the API (like "Mumbai", "Bangalore") to their exact [Latitude, Longitude] pairs, allowing Leaflet to plot markers accurately without network latency.

## Intentional Bug (Submission Requirement)

**Bug**: **Memory Leak** in `CameraCapture.jsx`.
**Location**: `src/components/CameraCapture.jsx`
**Why**: The `MediaStream` obtained via `getUserMedia` is stored in state but is **not** stopped in a `useEffect` cleanup function. If a user enables the camera but navigates away from the page before capturing or resetting, the camera hardware stays active (indicated by the green light), leaking system resources and violating privacy best-practices. This was chosen specifically to represent a common "real-world" async cleanup oversight.

## Setup & Credentials

1. `npm install`
2. `npm run dev`

**Credentials:**
- Username: `testuser`
- Password: `Test123`
