# Employee Insights Dashboard

[GitHub Repository Link](https://github.com/AyushSingh360/React-dashboard.git)


This is my submission for the dashboard assignment. It's a high-performance React app with a few custom-built pieces—most notably the virtualization and the identity audit system. 

The main goal here was to build everything from scratch without relying on external UI kits or helper libraries for the core logic. Everything you see is styled with raw Tailwind CSS.

### Custom Scroller (Virtualization Math)
To maintain 60FPS performance with large datasets, I implemented a custom 'Windowing' system. 

**The Virtualization Math:**
1. **Container Height (`H`)**: Constant (600px).
2. **Row Height (`h`)**: Constant (72px).
3. **Scroll Position (`S`)**: Tracked via `scrollTop` on the container.
4. **StartIndex**: `floor(S / h) - buffer`. We calculate how many items are already scrolled out of view.
5. **EndIndex**: `ceil((S + H) / h) + buffer`. We calculate how many items can fit in the viewport plus the ones scrolled out.
6. **Positioning**: Each visible item is placed at `top: (index * h)px`.
7. **Total Height**: A 'spacer' div is set to `TotalRows * h` to trick the browser into showing a realistic scrollbar.


### Audit Image Merging
For the employee verification, I'm using a mix of a couple of things. The camera frame is captured as a JPEG, and I've got a signature canvas sitting on top of it.
- To get the final image, I spin up a hidden canvas in memory.
- I draw the photo first, then layer the signature on top using `drawImage`.
- It exports as one flattened Base64 string so it’s easy to store and show later in the analytics section.

### City & Map Mapping
I used Leaflet for the map, but since I didn't want to mess around with geocoding APIs, I just mapped out the coordinates for the major Indian cities manually in a lookup table in `Analytics.jsx`. It's fast and avoids unnecessary network calls.

## Rules I Followed
- **No UI Libs**: No MUI, Bootstrap, or anything else. Just raw Tailwind and standard CSS.
- **No Virtualization Libs**: The scrolling math is 100% my own.
- **Data Viz**: The salary chart is rendered using raw SVG elements (`<rect>`, `<text>`, etc.).

## The Intentional Bug

**What is it?**  
A camera stream leak. When the Audit Modal starts the camera, it initializes a `MediaStream`.

**Where is it?**  
In `src/components/CameraCapture.jsx`. Specifically, the component lacks a `useEffect` cleanup function or an unmount handler that calls `track.stop()` on the stream.

**Why did I choose it?**  
I chose this because it’s a very common real-world issue in React applications dealing with hardware APIs. It clearly demonstrates the importance of component lifecycle management and resource cleanup. From a demonstration standpoint, it's also "visible" because the camera light remains on even after navigating away, making it easy to point out in a technical review.


## Getting Started

1. `npm install`
2. `npm run dev`

**Logins:**
- **User**: `testuser`
- **Pass**: `Test123`


