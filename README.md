# Employee Insights Dashboard

This is my submission for the dashboard assignment. It's a high-performance React app with a few custom-built pieces—most notably the virtualization and the identity audit system. 

The main goal here was to build everything from scratch without relying on external UI kits or helper libraries for the core logic. Everything you see is styled with raw Tailwind CSS.

## The Technical Bits

### Custom Scroller (Virtualization)
Since the dataset can get pretty big, I didn't want to just dump 100+ rows into the DOM. I built a custom virtualizer in `VirtualGrid.jsx`. 
- Basically, I track the `scrollTop` and only render what's actually visible in the viewport plus a small buffer of 5 rows.
- Everything is absolutely positioned, so the browser doesn't have to freak out and re-layout the whole table on every tiny scroll. 
- The scroller uses a big "spacer" div to keep the native scrollbar feel consistent.

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

## The "Intentional" Bug
As part of the requirements, I've left a **memory leak** in the `CameraCapture.jsx` component.
- **The Issue**: When you start the camera, the `MediaStream` gets saved to the component state, but I "forgot" to add a cleanup function in a `useEffect`.
- **The Result**: If you leave the page while the camera is still on, that stream never stops, so the camera stays active in the background. It's a classic async cleanup mistake.

## Getting Started

1. `npm install`
2. `npm run dev`

**Logins:**
- **User**: `testuser`
- **Pass**: `Test123`


