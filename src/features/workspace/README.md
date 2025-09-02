# Workspace Feature - Refactored Architecture

This directory contains the refactored workspace feature for the MusicVid application. The code has been restructured to be more scalable, maintainable, and friendly to changes.

## Architecture Overview

The workspace feature is organized into the following structure:

```
workspace/
├── types/           # Type definitions for the workspace
├── utils/           # Utility functions for timeline operations
├── hooks/           # Custom React hooks for state management
├── actions/         # Business logic for word CRUD operations
├── components/      # UI components (organized by feature)
│   ├── timeline/    # Timeline-related components
│   ├── video/       # Video-related components
│   └── controls/    # Control components
├── state/          # Global state management
└── styles/         # Styling and presets
```

## Key Improvements

### 1. **Modular Components**

#### Timeline Components (`components/timeline/`)

- **Timeline**: Main timeline component
- **TimelineSegment**: Individual timeline segment component
- **TimelineGrid**: Grid and lane separators component
- **TimelinePlayhead**: Playhead component

#### Video Components (`components/video/`)

- **VideoPanel**: Video preview panel component

#### Control Components (`components/controls/`)

- **WordCrudBar**: Word creation, editing, and deletion controls
- **ControlsBar**: General playback and zoom controls
- **Toolbox**: Tool selection and text input controls

### 2. **Custom Hooks**

- **useTimelineDrag**: Handles timeline drag operations
- **usePlayheadDrag**: Handles playhead drag operations
- **useEditor**: Global editor state management

### 3. **Type Safety**

- Comprehensive TypeScript types for all components and operations
- Clear interfaces for props and state
- Constants for magic numbers and configuration

### 4. **Utility Functions**

- **timelineUtils**: Pure functions for timeline calculations
- **wordCrud**: Business logic for word operations
- Reusable functions across components

## Usage

### Basic Timeline Usage

```tsx
import { Timeline, useEditor } from "@/features/workspace";

function MyWorkspace() {
  const { project, initialTranscript } = useWorkspaceData();

  return (
    <EditorProvider project={project} initialTranscript={initialTranscript}>
      <Timeline />
    </EditorProvider>
  );
}
```

### Using Custom Hooks

```tsx
import { useEditor } from "@/features/workspace";

function MyComponent() {
  const { currentTimeMs, seekToMs, videoRef } = useEditor();

  return (
    <div>
      <span>Current time: {currentTimeMs}ms</span>
    </div>
  );
}
```

### Word Operations

```tsx
import { addWord, deleteWord, updateWordText } from "@/features/workspace";

function MyWordOperations() {
  const { transcript, setTranscript } = useEditor();

  const handleAddWord = () => {
    const result = addWord(
      transcript,
      currentTimeMs,
      selectedIndex,
      "New Word"
    );
    setTranscript(result.next);
  };

  const handleDeleteWord = () => {
    const result = deleteWord(transcript, selectedIndex);
    setTranscript(result.next);
  };
}
```

## Benefits of the Refactoring

### 1. **Scalability**

- Components are small and focused
- Easy to add new features without breaking existing code
- Clear separation of concerns
- Logical folder structure makes navigation intuitive

### 2. **Maintainability**

- Each component has a single responsibility
- Business logic is separated from UI components
- Easy to test individual components
- Related components are grouped together

### 3. **Reusability**

- Custom hooks can be reused across components
- Utility functions are pure and testable
- Constants prevent magic numbers
- Components can be easily imported from their respective folders

### 4. **Type Safety**

- Full TypeScript support
- Clear interfaces for all props and state
- Compile-time error checking

### 5. **Performance**

- Optimized re-renders with proper memoization
- Efficient state updates
- Minimal DOM manipulation

### 6. **Organization**

- **Logical grouping**: Components are organized by feature (timeline, video, controls)
- **Clear imports**: Easy to find and import specific components
- **Scalable structure**: Easy to add new component categories
- **Consistent patterns**: All components follow the same organizational patterns

## Migration Guide

If you're migrating from the old workspace code:

1. **Import Changes**: Use the new index exports or import from specific folders
2. **Component Props**: Check the new type definitions
3. **Hook Usage**: Replace direct state access with custom hooks
4. **Utility Functions**: Use the new utility functions instead of inline logic

## Folder Structure Benefits

### **timeline/` Components**

- All timeline-related UI components in one place
- Easy to find and modify timeline functionality
- Clear separation from other UI concerns

### **video/` Components**

- Video playback and preview components grouped together
- Easy to extend video functionality
- Clear separation of video concerns

### **controls/` Components**

- All user interaction controls in one place
- Easy to add new control types
- Clear organization of user interface elements

## Future Enhancements

The refactored architecture makes it easy to add:

- **Undo/Redo functionality**
- **Keyboard shortcuts**
- **Multiple timeline tracks**
- **Advanced video effects**
- **Real-time collaboration**
- **Performance optimizations**
- **New component categories** (e.g., `effects/`, `filters/`, `export/`)

## Contributing

When adding new features:

1. **Follow the existing patterns**
2. **Create new types if needed**
3. **Use custom hooks for complex logic**
4. **Keep components small and focused**
5. **Add proper TypeScript types**
6. **Organize components in appropriate folders**
7. **Update this documentation**
