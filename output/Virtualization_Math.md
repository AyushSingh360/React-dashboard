# Technical Explanation: Virtualization Math

The Employee Insights Dashboard uses a custom **Virtual Windowing (Virtualization)** implementation to render large datasets efficiently. Instead of rendering thousands of DOM nodes, the application only renders the items visible in the viewport, significantly reducing memory usage and re-layout time.

## Core Concepts

The virtualization logic is implemented in `src/components/VirtualGrid.jsx`. It relies on fixed row heights to calculate which elements should be visible at any given scroll position.

### 1. Variables and Constants
- **`H` (Container Height)**: The visible height of the scrollable area (Fixed at `600px`).
- **`h` (Row Height)**: The height of a single employee row (Fixed at `72px`).
- **`S` (Scroll Top)**: The current vertical scroll position of the container, tracked via the `onScroll` event.
- **`Data`**: The full array of employee objects.
- **`buffer`**: A small number of extra rows rendered above and below the viewport to prevent flickering during fast scrolls (set to `5`).

### 2. The Calculations

#### Start Index
We determine the first item to render by dividing the current scroll position by the height of each row.
> `startIndex = max(0, floor(S / h) - buffer)`

#### End Index
We determine the last item to render by adding the container height to the scroll position, then dividing by the row height.
> `endIndex = min(Data.length, ceil((S + H) / h) + buffer)`

#### Visible Set
The application slices the data array using these indices:
> `visibleData = Data.slice(startIndex, endIndex)`

### 3. Positioning and Rendering

To create the illusion of a smooth, continuous list:
1. **Total Height**: We place a transparent "spacer" div inside the scroll container with a height of `Data.length * h`. This ensures the browser's native scrollbar behaves accurately for the full dataset.
2. **Absolute Positioning**: Each row in the `visibleData` set is absolutely positioned using its original index in the dataset:
   > `top: (absoluteIndex * h)px`

## Why This Approach?

- **Performance**: DOM operations are expensive. By limiting the number of nodes to ~15-20 (viewport + buffer), we maintain a consistent **60 FPS** regardless of whether the dataset contains 100 or 100,000 items.
- **Memory Efficiency**: Browser memory usage stays flat because the number of active React components remains constant as you scroll.
- **Native Feel**: By using a spacer div and absolute positioning, we retain native touch and mouse wheel scrolling physics without needing complex re-implementation.
