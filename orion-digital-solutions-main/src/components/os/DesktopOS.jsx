import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calculator from '../apps/Calculator';
import Notes from '../apps/Notes';
import Terminal from '../apps/Terminal';
import Mail from '../apps/Mail';
import Calendar from '../apps/Calendar';
import FileExplorer from '../apps/FileExplorer';
import PhotoViewer from '../apps/PhotoViewer';
import CodeEditor from '../apps/CodeEditor';
import Settings from '../apps/Settings';
import ChatbotApp from '../../pages/Chatbot'; 
import Typernova from '../apps/Typernova';





import WindowTitleBar from './WindowTitleBar';
import '../../styles/windows.css';

const DesktopOS = () => {
  // Load saved state from localStorage
  const loadState = () => {
    try {
      const savedState = localStorage.getItem('hypernovaOSState');
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return null;
  };

  // Save state to localStorage with debounce
  const saveState = (state) => {
    try {
      localStorage.setItem('hypernovaOSState', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  };

  // Available applications
  const apps = [
    { 
      id: 1, 
      name: 'File Explorer', 
      icon: '📁',
      component: FileExplorer,
      defaultSize: { width: 900, height: 600 },
      canResize: true,
      category: 'system'
    },

    
    { 
      id: 3, 
      name: 'Settings', 
      icon: '⚙️',
      component: Settings,
      defaultSize: { width: 1000, height: 700 },
      canResize: true,
      category: 'system'
    },
    { 
      id: 4, 
      name: 'Calculator', 
      icon: '🧮', 
      component: Calculator, 
      defaultSize: { width: 400, height: 600 },
      canResize: false,
      category: 'utilities'
    },
    { 
      id: 5, 
      name: 'Terminal', 
      icon: '⌨️', 
      component: Terminal, 
      defaultSize: { width: 800, height: 500 },
      canResize: true,
      category: 'development'
    },
    { 
      id: 6, 
      name: 'Notes', 
      icon: '📝', 
      component: Notes, 
      defaultSize: { width: 800, height: 600 },
      canResize: true,
      category: 'utilities'
    },
    { 
      id: 7, 
      name: 'Mail', 
      icon: '✉️', 
      component: Mail, 
      defaultSize: { width: 1000, height: 600 },
      canResize: true,
      category: 'internet'
    },
    { 
      id: 8, 
      name: 'Calendar', 
      icon: '📅', 
      component: Calendar, 
      defaultSize: { width: 900, height: 600 },
      canResize: true,
      category: 'utilities'
    },
    { 
      id: 9, 
      name: 'Photo Viewer', 
      icon: '🖼️', 
      component: PhotoViewer, 
      defaultSize: { width: 800, height: 600 },
      canResize: true,
      category: 'media'
    },
    { 
      id: 10, 
      name: 'Code Editor', 
      icon: '💻', 
      component: CodeEditor, 
      defaultSize: { width: 800, height: 600 },
      canResize: true,
      category: 'development'
    },

   { 
      id: 11, 
      name: 'Orion Ai', 
      icon: '🤖', 
      component: ChatbotApp, 
      defaultSize: { width: 800, height: 600 },
      canResize: true,
      category: 'development'
    },

   { 
      id: 12, 
      name: 'Typernova', 
      icon: '📝', 
      component: Typernova, 
      defaultSize: { width: 800, height: 600 },
      canResize: true,
      category: 'development'
    }


  ];

  // Categories for start menu
  const appCategories = [
    { id: 'all', name: 'All apps' },
    { id: 'system', name: 'System' },
    { id: 'utilities', name: 'Utilities' },
    { id: 'media', name: 'Media' },
    { id: 'development', name: 'Development' },
    { id: 'internet', name: 'Internet' }
  ];

  // Load initial state or set defaults
  const savedState = loadState();
  const initialState = {
    activeWindows: [],
    focusedWindow: null,
    isStartMenuOpen: false,
    currentTime: new Date().toLocaleTimeString(),
    windowPositions: {},
    windowSizes: {},
    minimizedWindows: [],
    maximizedWindows: [],
    previousWindowStates: {},
    wallpaper: 'default',
    theme: 'dark',
    accentColor: '#3b82f6',
    showPowerOptions: false,
    showDesktop: false,
    searchQuery: "",
    selectedCategory: 'all',
    notifications: [],
    volume: 70,
    brightness: 80,
    batteryLevel: 87,
    isCharging: false,
    networkStatus: 'connected',
    selectedImage: null,
    recentFiles: [],
    desktopIcons: true,
    taskbarPosition: 'bottom',
    animationEnabled: true,
    transparencyEnabled: true,
    startMenuLayout: 'grid',
    fileExplorerView: 'icons'
  };

  const [state, setState] = useState({ ...initialState, ...savedState });
  const [dragStartPosition, setDragStartPosition] = useState(null);
  const [windowStartPosition, setWindowStartPosition] = useState(null);
  const [resizingWindow, setResizingWindow] = useState(null);
  const [resizeStartSize, setResizeStartSize] = useState(null);
  const [resizeStartPosition, setResizeStartPosition] = useState(null);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showNetworkControl, setShowNetworkControl] = useState(false);
  const [showBatteryInfo, setShowBatteryInfo] = useState(false);
  const [showClockCalendar, setShowClockCalendar] = useState(false);
  const [showActionCenter, setShowActionCenter] = useState(false);
  const [showFileContextMenu, setShowFileContextMenu] = useState(false);
  const [fileContextMenuPosition, setFileContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDesktopContextMenu, setShowDesktopContextMenu] = useState(false);
  const [desktopContextMenuPosition, setDesktopContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showTaskbarContextMenu, setShowTaskbarContextMenu] = useState(false);
  const [taskbarContextMenuPosition, setTaskbarContextMenuPosition] = useState({ x: 0, y: 0 });
  const [dragOverDesktop, setDragOverDesktop] = useState(false);

  const desktopRef = useRef(null);
  const taskbarRef = useRef(null);
  const startMenuRef = useRef(null);
  const notificationCenterRef = useRef(null);
  const actionCenterRef = useRef(null);

  // Save state whenever it changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      saveState(state);
    }, 500);

    return () => clearTimeout(timer);
  }, [state]);

  // Effect for updating time
  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => ({
        ...prev,
        currentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Effect for battery simulation
  useEffect(() => {
    const batteryTimer = setInterval(() => {
      setState(prev => {
        const newLevel = prev.isCharging 
          ? Math.min(100, prev.batteryLevel + 1)
          : Math.max(0, prev.batteryLevel - 0.2);
        
        return {
          ...prev,
          batteryLevel: newLevel,
          isCharging: newLevel >= 100 ? false : prev.isCharging
        };
      });
    }, 60000);

    return () => clearInterval(batteryTimer);
  }, []);
   


  // Effect for handling clicks outside of menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (startMenuRef.current && !startMenuRef.current.contains(e.target) && 
          !e.target.closest('.start-button')) {
        setState(prev => ({ ...prev, isStartMenuOpen: false }));
      }
      
      if (notificationCenterRef.current && !notificationCenterRef.current.contains(e.target) && 
          !e.target.closest('.notification-center-button')) {
        setShowNotificationCenter(false);
      }
      
      if (actionCenterRef.current && !actionCenterRef.current.contains(e.target) && 
          !e.target.closest('.action-center-button')) {
        setShowActionCenter(false);
      }
      
      if (!e.target.closest('.context-menu')) {
        setShowContextMenu(false);
        setShowDesktopContextMenu(false);
        setShowTaskbarContextMenu(false);
        setShowFileContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  

  // Filter apps based on search and category
  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(state.searchQuery.toLowerCase()) &&
    (state.selectedCategory === 'all' || app.category === state.selectedCategory)
  );

  // Window management functions
  const openWindow = (appId, file = null) => {
    const app = apps.find(a => a.id === appId);
    
    setState(prev => {
      const isMinimized = prev.minimizedWindows.includes(appId);
      const isAlreadyOpen = prev.activeWindows.includes(appId);
      
      // If window is minimized, restore it
      if (isMinimized) {
        return {
          ...prev,
          minimizedWindows: prev.minimizedWindows.filter(id => id !== appId),
          focusedWindow: appId,
          isStartMenuOpen: false
        };
      }
      
      // If window is not open, add it
      if (!isAlreadyOpen) {
        const newPositions = { ...prev.windowPositions };
        const newSizes = { ...prev.windowSizes };
        
        // Set initial position if not set
        if (!newPositions[appId]) {
          newPositions[appId] = {
            x: 50 + (prev.activeWindows.length * 30),
            y: 50 + (prev.activeWindows.length * 30)
          };
        }
        
        // Set initial size if not set
        if (!newSizes[appId] && app.defaultSize) {
          newSizes[appId] = app.defaultSize;
        }
        
        // Add to recent files if opening with a file
        let newRecentFiles = [...prev.recentFiles];
        if (file) {
          newRecentFiles = [file, ...prev.recentFiles.filter(f => f.path !== file.path)].slice(0, 10);
        }
        
        return {
          ...prev,
          activeWindows: [...prev.activeWindows, appId],
          windowPositions: newPositions,
          windowSizes: newSizes,
          focusedWindow: appId,
          isStartMenuOpen: false,
          recentFiles: newRecentFiles
        };
      }
      
      // If window is already open and not minimized, just focus it
      return {
        ...prev,
        focusedWindow: appId,
        isStartMenuOpen: false
      };
    });
  };

  const closeWindow = (e, appId) => {
    e.stopPropagation();
    
    setState(prev => {
      const newActiveWindows = prev.activeWindows.filter(id => id !== appId);
      const newMinimizedWindows = prev.minimizedWindows.filter(id => id !== appId);
      const newMaximizedWindows = prev.maximizedWindows.filter(id => id !== appId);
      
      let newFocusedWindow = prev.focusedWindow;
      if (prev.focusedWindow === appId) {
        const remainingWindows = newActiveWindows.filter(id => !newMinimizedWindows.includes(id));
        newFocusedWindow = remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1] : null;
      }
      
      return {
        ...prev,
        activeWindows: newActiveWindows,
        minimizedWindows: newMinimizedWindows,
        maximizedWindows: newMaximizedWindows,
        focusedWindow: newFocusedWindow
      };
    });
  };

  const minimizeWindow = (e, appId) => {
    e.stopPropagation();
    
    setState(prev => {
      if (!prev.minimizedWindows.includes(appId)) {
        const newMinimizedWindows = [...prev.minimizedWindows, appId];
        
        let newFocusedWindow = prev.focusedWindow;
        if (prev.focusedWindow === appId) {
          const remainingWindows = prev.activeWindows.filter(
            id => !newMinimizedWindows.includes(id)
          );
          newFocusedWindow = remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1] : null;
        }
        
        return {
          ...prev,
          minimizedWindows: newMinimizedWindows,
          focusedWindow: newFocusedWindow
        };
      }
      return prev;
    });
  };

  const maximizeWindow = (e, appId) => {
    e.stopPropagation();
    
    setState(prev => {
      if (prev.maximizedWindows.includes(appId)) {
        // Restore previous state
        const prevState = prev.previousWindowStates[appId];
        if (prevState) {
          const newPositions = { ...prev.windowPositions };
          const newSizes = { ...prev.windowSizes };
          
          newPositions[appId] = prevState.position;
          newSizes[appId] = prevState.size;
          
          return {
            ...prev,
            windowPositions: newPositions,
            windowSizes: newSizes,
            maximizedWindows: prev.maximizedWindows.filter(id => id !== appId)
          };
        }
        
        return {
          ...prev,
          maximizedWindows: prev.maximizedWindows.filter(id => id !== appId)
        };
      } else {
        // Save current state and maximize
        const newPreviousStates = { ...prev.previousWindowStates };
        const newPositions = { ...prev.windowPositions };
        const newSizes = { ...prev.windowSizes };
        
        newPreviousStates[appId] = {
          position: prev.windowPositions[appId] || { x: 50, y: 50 },
          size: prev.windowSizes[appId] || { width: 800, height: 500 }
        };
        
        newPositions[appId] = { x: 0, y: 0 };
        newSizes[appId] = { 
          width: window.innerWidth, 
          height: window.innerHeight - (prev.taskbarPosition === 'bottom' ? 48 : 0) 
        };
        
        return {
          ...prev,
          previousWindowStates: newPreviousStates,
          windowPositions: newPositions,
          windowSizes: newSizes,
          maximizedWindows: [...prev.maximizedWindows, appId]
        };
      }
    });
  };

  const handleDragStart = (e, appId) => {
    if (state.maximizedWindows.includes(appId)) return;
    
    const position = state.windowPositions[appId] || { x: 50, y: 50 };
    setDragStartPosition({ x: e.clientX, y: e.clientY });
    setWindowStartPosition(position);
    
    setState(prev => ({
      ...prev,
      focusedWindow: appId
    }));
  };

  const handleDrag = (e, appId) => {
    if (!dragStartPosition || !windowStartPosition || state.maximizedWindows.includes(appId)) return;

    const deltaX = e.clientX - dragStartPosition.x;
    const deltaY = e.clientY - dragStartPosition.y;

    const newX = windowStartPosition.x + deltaX;
    const newY = windowStartPosition.y + deltaY;

    const size = state.windowSizes[appId] || { width: 800, height: 500 };
    const boundedX = Math.max(0, Math.min(newX, window.innerWidth - size.width));
    const boundedY = Math.max(0, Math.min(newY, window.innerHeight - size.height - (state.taskbarPosition === 'bottom' ? 48 : 0)));

    setState(prev => ({
      ...prev,
      windowPositions: {
        ...prev.windowPositions,
        [appId]: { x: boundedX, y: boundedY }
      }
    }));
  };

  const handleDragEnd = () => {
    setDragStartPosition(null);
    setWindowStartPosition(null);
  };

  const startResize = (e, appId, direction) => {
    e.stopPropagation();
    const app = apps.find(a => a.id === appId);
    if (!app.canResize) return;
    
    setResizingWindow(appId);
    setResizeDirection(direction);
    setResizeStartSize(state.windowSizes[appId] || app.defaultSize || { width: 800, height: 500 });
    setResizeStartPosition({ x: e.clientX, y: e.clientY });
    
    setState(prev => ({
      ...prev,
      focusedWindow: appId
    }));
  };

  const handleResize = (e) => {
    if (!resizingWindow || !resizeStartSize || !resizeStartPosition) return;
    
    const deltaX = e.clientX - resizeStartPosition.x;
    const deltaY = e.clientY - resizeStartPosition.y;
    
    let newWidth = resizeStartSize.width;
    let newHeight = resizeStartSize.height;
    
    // Minimum window size
    const minWidth = 300;
    const minHeight = 200;
    
    // Handle different resize directions
    if (resizeDirection.includes('right')) {
      newWidth = Math.max(minWidth, resizeStartSize.width + deltaX);
    }
    
    if (resizeDirection.includes('left')) {
      const newLeftWidth = Math.max(minWidth, resizeStartSize.width - deltaX);
      const newX = state.windowPositions[resizingWindow].x + (resizeStartSize.width - newLeftWidth);
      
      // Only update if we have space to move left
      if (newX >= 0) {
        newWidth = newLeftWidth;
        setState(prev => ({
          ...prev,
          windowPositions: {
            ...prev.windowPositions,
            [resizingWindow]: {
              ...prev.windowPositions[resizingWindow],
              x: newX
            }
          }
        }));
      }
    }
    
    if (resizeDirection.includes('bottom')) {
      newHeight = Math.max(minHeight, resizeStartSize.height + deltaY);
    }
    
    if (resizeDirection.includes('top')) {
      const newTopHeight = Math.max(minHeight, resizeStartSize.height - deltaY);
      const newY = state.windowPositions[resizingWindow].y + (resizeStartSize.height - newTopHeight);
      
      // Only update if we have space to move up
      if (newY >= 0) {
        newHeight = newTopHeight;
        setState(prev => ({
          ...prev,
          windowPositions: {
            ...prev.windowPositions,
            [resizingWindow]: {
              ...prev.windowPositions[resizingWindow],
              y: newY
            }
          }
        }));
      }
    }
    
    setState(prev => ({
      ...prev,
      windowSizes: {
        ...prev.windowSizes,
        [resizingWindow]: {
          width: newWidth,
          height: newHeight
        }
      }
    }));
  };

  const endResize = () => {
    setResizingWindow(null);
    setResizeDirection(null);
    setResizeStartSize(null);
    setResizeStartPosition(null);
  };

  // Add event listeners for resize
  useEffect(() => {
    if (resizingWindow) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', endResize);
      return () => {
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', endResize);
      };
    }
  }, [resizingWindow, resizeStartSize, resizeStartPosition, resizeDirection]);

  const toggleShowDesktop = () => {
    setState(prev => {
      const newShowDesktop = !prev.showDesktop;
      
      if (newShowDesktop) {
        // Minimize all windows when showing desktop
        return {
          ...prev,
          showDesktop: newShowDesktop,
          minimizedWindows: [...prev.minimizedWindows, ...prev.activeWindows.filter(id => !prev.minimizedWindows.includes(id))]
        };
      } else {
        // Restore previously minimized windows
        return {
          ...prev,
          showDesktop: newShowDesktop,
          minimizedWindows: []
        };
      }
    });
  };

  const handlePowerAction = (action) => {
    switch (action) {
      case 'shutdown':
        // Handle shutdown
        alert('System shutting down...');
        break;
      case 'restart':
        // Handle restart
        alert('System restarting...');
        break;
      case 'sleep':
        // Handle sleep
        alert('System going to sleep...');
        break;
      case 'logout':
        // Handle logout
        localStorage.removeItem('hypernovaOSState');
        window.location.reload();
        break;
      default:
        break;
    }
    
    setState(prev => ({
      ...prev,
      showPowerOptions: false
    }));
  };

  const changeWallpaper = (newWallpaper) => {
    setState(prev => ({
      ...prev,
      wallpaper: newWallpaper
    }));
  };

  const changeTheme = (newTheme) => {
    setState(prev => ({
      ...prev,
      theme: newTheme
    }));
  };

  const changeAccentColor = (color) => {
    setState(prev => ({
      ...prev,
      accentColor: color
    }));
  };

  const toggleDesktopIcons = () => {
    setState(prev => ({
      ...prev,
      desktopIcons: !prev.desktopIcons
    }));
  };

  const changeTaskbarPosition = (position) => {
    setState(prev => ({
      ...prev,
      taskbarPosition: position
    }));
  };

  const toggleAnimations = () => {
    setState(prev => ({
      ...prev,
      animationEnabled: !prev.animationEnabled
    }));
  };

  const toggleTransparency = () => {
    setState(prev => ({
      ...prev,
      transparencyEnabled: !prev.transparencyEnabled
    }));
  };

  const changeStartMenuLayout = (layout) => {
    setState(prev => ({
      ...prev,
      startMenuLayout: layout
    }));
  };

  const changeFileExplorerView = (view) => {
    setState(prev => ({
      ...prev,
      fileExplorerView: view
    }));
  };

  // Arrange windows functions
  const arrangeWindows = (type) => {
    const visibleWindows = state.activeWindows.filter(id => !state.minimizedWindows.includes(id));
    
    if (visibleWindows.length === 0) return;
    
    setState(prev => {
      const newPositions = {...prev.windowPositions};
      const newSizes = {...prev.windowSizes};
      
      if (type === 'cascade') {
        visibleWindows.forEach((id, index) => {
          newPositions[id] = {
            x: 50 + (index * 30),
            y: 50 + (index * 30)
          };
          
          const app = apps.find(a => a.id === id);
          newSizes[id] = app.defaultSize || { width: 800, height: 500 };
        });
      } else if (type === 'stack') {
        const windowWidth = window.innerWidth / Math.min(visibleWindows.length, 3);
        
        visibleWindows.forEach((id, index) => {
          newPositions[id] = {
            x: (index % 3) * windowWidth,
            y: Math.floor(index / 3) * 200
          };
          
          newSizes[id] = {
            width: windowWidth,
            height: 300
          };
        });
      } else if (type === 'side-by-side') {
        if (visibleWindows.length === 2) {
          const windowWidth = window.innerWidth / 2;
          
          visibleWindows.forEach((id, index) => {
            newPositions[id] = {
              x: index * windowWidth,
              y: 0
            };
            
            newSizes[id] = {
              width: windowWidth,
              height: window.innerHeight - (prev.taskbarPosition === 'bottom' ? 48 : 0)
            };
          });
        }
      }
      
      return {
        ...prev,
        windowPositions: newPositions,
        windowSizes: newSizes,
        maximizedWindows: []
      };
    });
  };

  // Context menu handlers
  const handleDesktopContextMenu = (e) => {
    e.preventDefault();
    setDesktopContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowDesktopContextMenu(true);
    setShowContextMenu(false);
    setShowFileContextMenu(false);
    setShowTaskbarContextMenu(false);
  };

  const handleTaskbarContextMenu = (e) => {
    e.preventDefault();
    setTaskbarContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowTaskbarContextMenu(true);
    setShowContextMenu(false);
    setShowFileContextMenu(false);
    setShowDesktopContextMenu(false);
  };

  const handleFileContextMenu = (e, file) => {
    e.preventDefault();
    e.stopPropagation();
    setFileContextMenuPosition({ x: e.clientX, y: e.clientY });
    setSelectedFile(file);
    setShowFileContextMenu(true);
    setShowContextMenu(false);
    setShowDesktopContextMenu(false);
    setShowTaskbarContextMenu(false);
  };

  const handleDragOverDesktop = (e) => {
    e.preventDefault();
    setDragOverDesktop(true);
  };

  const handleDragLeaveDesktop = () => {
    setDragOverDesktop(false);
  };

  const handleDropOnDesktop = (e) => {
    e.preventDefault();
    setDragOverDesktop(false);
    // Handle file drop logic here
  };

  // Notification functions
  const addNotification = (title, message, icon = 'ℹ️') => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      icon,
      time: new Date().toLocaleTimeString(),
      read: false
    };
    
    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications].slice(0, 50)
    }));
  };

  const markNotificationAsRead = (id) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    }));
  };

  const clearAllNotifications = () => {
    setState(prev => ({
      ...prev,
      notifications: []
    }));
  };

  // Wallpaper styles
  const wallpaperStyles = {
    default: 'bg-gradient-to-br from-blue-900 to-purple-900',
    nature: 'bg-[url("/wallpapers/nature.jpg")] bg-cover bg-center',
    abstract: 'bg-[url("/wallpapers/abstract.jpg")] bg-cover bg-center',
    dark: 'bg-[url("/wallpapers/dark.jpg")] bg-cover bg-center',
    light: 'bg-[url("/wallpapers/light.jpg")] bg-cover bg-center',
    space: 'bg-[url("/wallpapers/space.jpg")] bg-cover bg-center',
    city: 'bg-[url("/wallpapers/city.jpg")] bg-cover bg-center'
  };

  // Theme styles
  const themeStyles = {
    dark: {
      window: 'bg-[#2a2b2e] text-white',
      taskbar: 'bg-[#1a1b1e]/95',
      startMenu: 'bg-gradient-to-br from-[#22252A] to-[#1A1C1F]',
      contextMenu: 'bg-[#2a2b2e] text-white',
      hover: 'hover:bg-white/10',
      active: 'bg-white/20',
      border: 'border-white/10'
    },
    light: {
      window: 'bg-[#f5f5f5] text-black',
      taskbar: 'bg-[#e5e5e5]/95',
      startMenu: 'bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0]',
      contextMenu: 'bg-[#f5f5f5] text-black',
      hover: 'hover:bg-black/10',
      active: 'bg-black/20',
      border: 'border-black/10'
    },
    blue: {
      window: 'bg-[#2a3b5e] text-white',
      taskbar: 'bg-[#1a2b4e]/95',
      startMenu: 'bg-gradient-to-br from-[#223355] to-[#1a2b4e]',
      contextMenu: 'bg-[#2a3b5e] text-white',
      hover: 'hover:bg-white/10',
      active: 'bg-white/20',
      border: 'border-white/10'
    }
  };

  // Accent color styles
  const accentColorStyles = {
    backgroundColor: state.accentColor,
    borderColor: state.accentColor,
    hoverColor: `${state.accentColor}80`
  };

  return (
    <div 
      className={`fixed inset-0 w-screen h-screen overflow-hidden select-none ${wallpaperStyles[state.wallpaper]}`}
      onContextMenu={handleDesktopContextMenu}
      onDragOver={handleDragOverDesktop}
      onDragLeave={handleDragLeaveDesktop}
      onDrop={handleDropOnDesktop}
      ref={desktopRef}
    >
      {/* Desktop Background */}
      <div className="absolute inset-0">
        {/* Desktop Icons - Aligned to left side */}
        {state.desktopIcons && (
          <div className="desktop-icons flex flex-col items-start gap-4 p-4">
            {apps.map(app => (
              <motion.div
                key={app.id}
                className={`desktop-icon flex items-center gap-3 p-2 cursor-pointer ${themeStyles[state.theme].hover} rounded-lg backdrop-blur-sm transition-colors group w-48`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openWindow(app.id)}
                onContextMenu={(e) => handleFileContextMenu(e, { name: app.name, type: 'app', icon: app.icon })}
              >
                <span className="text-3xl group-hover:drop-shadow-glow">{app.icon}</span>
                <span className={`text-sm font-medium ${themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'text-black/90 group-hover:text-black' : 'text-white/90 group-hover:text-white'}`}>
                  {app.name}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Drag overlay */}
        {dragOverDesktop && (
          <div className="absolute inset-0 border-4 border-dashed border-white/50 bg-black/20 flex items-center justify-center">
            <div className="text-white text-2xl font-bold backdrop-blur-md p-4 rounded-lg">
              Drop files here
            </div>
          </div>
        )}

        {/* Active Windows */}
        <AnimatePresence>
          {state.activeWindows.filter(id => !state.minimizedWindows.includes(id)).map((appId) => {
            const app = apps.find(a => a.id === appId);
            const isFocused = state.focusedWindow === appId;
            const position = state.windowPositions[appId] || { x: 50, y: 50 };
            const size = state.windowSizes[appId] || { width: 800, height: 500 };
            const canResize = app.canResize !== false;
            const isMaximized = state.maximizedWindows.includes(appId);
            
            return (
              <motion.div
                key={appId}
                data-window-id={appId}
                className={`absolute ${themeStyles[state.theme].window} overflow-hidden draggable-window
                  ${isFocused ? 'z-20 shadow-2xl' : 'z-10 shadow-lg'}
                  ${isMaximized ? 'window-maximized' : 'rounded-lg window-transition'}
                  ${dragStartPosition ? 'window-dragging' : ''}
                  ${state.transparencyEnabled ? 'bg-opacity-90' : ''}`}
                style={{ 
                  top: isMaximized ? 0 : position.y,
                  left: isMaximized ? 0 : position.x,
                  width: isMaximized ? '100%' : size.width,
                  height: isMaximized ? `calc(100% - ${state.taskbarPosition === 'bottom' ? '48px' : '0px'})` : size.height,
                  border: isFocused ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.2)'
                }}
                initial={state.animationEnabled ? { scale: 0.5, opacity: 0 } : false}
                animate={state.animationEnabled ? { scale: 1, opacity: 1 } : false}
                exit={state.animationEnabled ? { scale: 0.5, opacity: 0 } : false}
                transition={state.animationEnabled ? { type: "spring", stiffness: 500, damping: 30 } : false}
                onClick={() => setState(prev => ({ ...prev, focusedWindow: appId }))}
                drag={!isMaximized}
                dragMomentum={false}
                onDragStart={(e) => handleDragStart(e, appId)}
                onDrag={(e) => handleDrag(e, appId)}
                onDragEnd={handleDragEnd}
                dragConstraints={{
                  left: 0,
                  right: window.innerWidth - size.width,
                  top: 0,
                  bottom: window.innerHeight - size.height - (state.taskbarPosition === 'bottom' ? 48 : 0)
                }}
              >
                <WindowTitleBar
                  app={app}
                  appId={appId}
                  isFocused={isFocused}
                  isMaximized={isMaximized}
                  onMinimize={(e) => minimizeWindow(e, appId)}
                  onMaximize={(e) => maximizeWindow(e, appId)}
                  onClose={(e) => closeWindow(e, appId)}
                  theme={state.theme}
                  accentColor={state.accentColor}
                />
                
                <div 
                  className="window-content overflow-hidden" 
                  style={{ 
                    height: isMaximized 
                      ? `calc(100% - 40px)` 
                      : size.height - 40,
                    backgroundColor: themeStyles[state.theme].window.includes('bg-[#f5f5f5]') 
                      ? '#f5f5f5' 
                      : '#2a2b2e'
                  }}
                >
                  {React.createElement(app.component, {
                    theme: state.theme,
                    onOpenFile: (file) => {
                      if (file.type === 'image') {
                        setState(prev => ({
                          ...prev,
                          selectedImage: file
                        }));
                        openWindow(9); // Open Photo Viewer
                      } else {
                        // Handle other file types
                        addNotification('File Opened', `Opening ${file.name}`, '📄');
                      }
                    },
                    onContextMenu: handleFileContextMenu,
                    fileView: state.fileExplorerView,
                    accentColor: state.accentColor
                  })}
                </div>
                
                {/* Resize handles */}
                {canResize && !isMaximized && (
                  <>
                    <div 
                      className="resize-handle resize-handle-right" 
                      onMouseDown={(e) => startResize(e, appId, 'right')}
                    />
                    <div 
                      className="resize-handle resize-handle-bottom" 
                      onMouseDown={(e) => startResize(e, appId, 'bottom')}
                    />
                    <div 
                      className="resize-handle resize-handle-left" 
                      onMouseDown={(e) => startResize(e, appId, 'left')}
                    />
                    <div 
                      className="resize-handle resize-handle-top" 
                      onMouseDown={(e) => startResize(e, appId, 'top')}
                    />
                    <div 
                      className="resize-handle resize-handle-bottom-right" 
                      onMouseDown={(e) => startResize(e, appId, 'bottom-right')}
                    />
                    <div 
                      className="resize-handle resize-handle-bottom-left" 
                      onMouseDown={(e) => startResize(e, appId, 'bottom-left')}
                    />
                    <div 
                      className="resize-handle resize-handle-top-right" 
                      onMouseDown={(e) => startResize(e, appId, 'top-right')}
                    />
                    <div 
                      className="resize-handle resize-handle-top-left" 
                      onMouseDown={(e) => startResize(e, appId, 'top-left')}
                    />
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Taskbar */}
        <div 
          className={`taskbar fixed ${state.taskbarPosition === 'bottom' ? 'bottom-0 left-0 right-0 h-12' : 
            state.taskbarPosition === 'top' ? 'top-0 left-0 right-0 h-12' :
            state.taskbarPosition === 'left' ? 'top-0 left-0 bottom-0 w-12 flex-col' :
            'top-0 right-0 bottom-0 w-12 flex-col'} 
          ${themeStyles[state.theme].taskbar} backdrop-blur-md border-t ${themeStyles[state.theme].border} flex items-center px-2 z-50`}
          ref={taskbarRef}
          onContextMenu={handleTaskbarContextMenu}
        >
          {/* Start Button */}
          <motion.button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md h-10 ${
              state.isStartMenuOpen ? themeStyles[state.theme].active : themeStyles[state.theme].hover
            } start-button`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setState(prev => ({ ...prev, isStartMenuOpen: !prev.isStartMenuOpen }))}
          >
            <span className="text-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" strokeOpacity="0.3" stroke={themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'black' : 'white'}/>
                <circle cx="12" cy="12" r="6.5" strokeOpacity="0.5" stroke={themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'black' : 'white'}/>
                <circle cx="12" cy="12" r="2.5" fill={themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'black' : 'white'} />
                <circle cx="17" cy="12" r="0.7" fill={themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'black' : 'white'} />
                <circle cx="7" cy="12" r="0.7" fill={themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'black' : 'white'} />
              </svg>
            </span>
          </motion.button>

          {/* Search Bar in Taskbar */}
          {state.taskbarPosition === 'bottom' || state.taskbarPosition === 'top' ? (
            <div className="ml-3 w-64">
              <input
                type="text"
                placeholder="Search..."
                className={`w-full px-3 py-1 rounded-md ${
                  themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' 
                    ? 'bg-black/10 focus:ring-black/30 placeholder-black/50' 
                    : 'bg-white/10 focus:ring-white/30 placeholder-white/50'
                } focus:outline-none focus:ring-2`}
                value={state.searchQuery}
                onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
            </div>
          ) : null}

          {/* Task View Button */}
          <motion.button
            className={`ml-2 p-2 rounded-md ${themeStyles[state.theme].hover}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleShowDesktop}
            title="Show desktop"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </motion.button>

          {/* Arrange Windows Buttons */}
          {state.taskbarPosition === 'bottom' || state.taskbarPosition === 'top' ? (
            <div className="ml-2 flex">
              <motion.button
                className={`p-2 rounded-md ${themeStyles[state.theme].hover}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => arrangeWindows('cascade')}
                title="Cascade windows"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
              </motion.button>
              <motion.button
                className={`p-2 rounded-md ${themeStyles[state.theme].hover}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => arrangeWindows('stack')}
                title="Stack windows"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </motion.button>
              <motion.button
                className={`p-2 rounded-md ${themeStyles[state.theme].hover}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => arrangeWindows('side-by-side')}
                title="Side by side"
                disabled={state.activeWindows.filter(id => !state.minimizedWindows.includes(id)).length !== 2}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          ) : null}

          {/* Active Apps */}
          <div className={`flex-1 flex ${state.taskbarPosition === 'left' || state.taskbarPosition === 'right' ? 'flex-col' : ''} items-center gap-1 px-2`}>
            {state.activeWindows.map(appId => {
              const app = apps.find(a => a.id === appId);
              const isFocused = state.focusedWindow === appId;
              const isMinimized = state.minimizedWindows.includes(appId);

              return (
                <motion.button
                  key={appId}
                  className={`flex items-center gap-2 px-3 h-10 rounded-md ${
                    isFocused ? themeStyles[state.theme].active : 
                    isMinimized ? (themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'opacity-50 hover:opacity-100 hover:bg-black/10' : 'opacity-50 hover:opacity-100 hover:bg-white/10') : 
                    themeStyles[state.theme].hover
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openWindow(appId)}
                >
                  <span>{app.icon}</span>
                  {(state.taskbarPosition === 'bottom' || state.taskbarPosition === 'top') && (
                    <span className={`text-sm ${
                      themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'text-black/90' : 'text-white/90'
                    }`}>{app.name}</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* System Tray */}
          <div className={`flex ${state.taskbarPosition === 'left' || state.taskbarPosition === 'right' ? 'flex-col' : ''} items-center gap-4 px-4`}>
            {/* Network Status */}
            <div className="relative">
              <motion.button
                className={`p-1 rounded-md ${themeStyles[state.theme].hover} network-button`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNetworkControl(!showNetworkControl)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  {state.networkStatus === 'connected' ? (
                    <path fillRule="evenodd" d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 11-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414zM7.879 6.464a1 1 0 010 1.414 3 3 0 000 4.243 1 1 0 11-1.415 1.414 5 5 0 010-7.07 1 1 0 011.415 0zm4.242 0a1 1 0 011.415 0 5 5 0 010 7.07 1 1 0 01-1.415-1.414 3 3 0 000-4.243 1 1 0 010-1.414zM10 9a1 1 0 011 1v.01a1 1 0 11-2 0V10a1 1 0 011-1z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M2.28 3.06a1 1 0 011.415 0L6.05 5.83a7.028 7.028 0 012.196-.646 1 1 0 11.262 1.99 5.03 5.03 0 00-1.572.48l1.414 1.414a3.029 3.029 0 011.572-.48 1 1 0 11.262 1.99 1.03 1.03 0 00-.33.123l1.456 1.456a1 1 0 01-1.414 1.414L2.28 4.475a1 1 0 010-1.414zM5.724 7.638a1 1 0 011.39-.278c.19.127.322.3.386.498a1 1 0 11-1.885.666 1 1 0 01.11-.886zm3.114 4.335a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 011.414 1.414l-1.414 1.414zm-6.028-6.028a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 011.414 1.414l-1.414 1.414zM10 13a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  )}
                </svg>
              </motion.button>
              
              {showNetworkControl && (
                <motion.div
                  className={`absolute ${state.taskbarPosition === 'bottom' ? 'bottom-10 right-0' : 'top-10 right-0'} w-64 p-4 rounded-md shadow-lg ${
                    themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'
                  } z-50`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <h3 className="font-medium mb-2">Network</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Wi-Fi</span>
                      <button 
                        className={`px-3 py-1 rounded-md ${state.networkStatus === 'connected' ? 'bg-green-500' : 'bg-gray-500'}`}
                        onClick={() => setState(prev => ({
                          ...prev,
                          networkStatus: prev.networkStatus === 'connected' ? 'disconnected' : 'connected'
                        }))}
                      >
                        {state.networkStatus === 'connected' ? 'Connected' : 'Disconnected'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Airplane Mode</span>
                      <button className="px-3 py-1 bg-gray-500 rounded-md">Off</button>
                    </div>
                    <div className="pt-2">
                      <button 
                        className={`w-full text-left px-3 py-1 rounded-md ${themeStyles[state.theme].hover}`}
                        onClick={() => openWindow(3)}
                      >
                        Network Settings
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Volume Control */}
            <div className="relative">
              <motion.button
                className={`p-1 rounded-md ${themeStyles[state.theme].hover} volume-button`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVolumeControl(!showVolumeControl)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  {state.volume === 0 ? (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  ) : state.volume < 50 ? (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12 9a1 1 0 100 2V9z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  )}
                </svg>
              </motion.button>
              
              {showVolumeControl && (
                <motion.div
                  className={`absolute ${state.taskbarPosition === 'bottom' ? 'bottom-10 right-0' : 'top-10 right-0'} w-64 p-4 rounded-md shadow-lg ${
                    themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'
                  } z-50`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <h3 className="font-medium mb-2">Volume</h3>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={state.volume}
                    onChange={(e) => setState(prev => ({ ...prev, volume: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2">
                    <button 
                      className={`px-3 py-1 rounded-md ${themeStyles[state.theme].hover}`}
                      onClick={() => setState(prev => ({ ...prev, volume: Math.max(0, prev.volume - 10) }))}
                    >
                      -
                    </button>
                    <span>{state.volume}%</span>
                    <button 
                      className={`px-3 py-1 rounded-md ${themeStyles[state.theme].hover}`}
                      onClick={() => setState(prev => ({ ...prev, volume: Math.min(100, prev.volume + 10) }))}
                    >
                      +
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Battery Status */}
            <div className="relative">
              <motion.button
                className={`p-1 rounded-md ${themeStyles[state.theme].hover} battery-button`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBatteryInfo(!showBatteryInfo)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h8V6z" clipRule="evenodd" />
                  {state.batteryLevel > 80 ? (
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h8V6z" clipRule="evenodd" />
                  ) : state.batteryLevel > 60 ? (
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h4V6h4z" clipRule="evenodd" />
                  ) : state.batteryLevel > 40 ? (
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h2V6h6z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h1V6h7z" clipRule="evenodd" />
                  )}
                </svg>
              </motion.button>
              
              {showBatteryInfo && (
                <motion.div
                  className={`absolute ${state.taskbarPosition === 'bottom' ? 'bottom-10 right-0' : 'top-10 right-0'} w-64 p-4 rounded-md shadow-lg ${
                    themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'
                  } z-50`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <h3 className="font-medium mb-2">Battery</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-8 border rounded flex items-center p-0.5">
                      <div 
                        className={`h-full rounded-sm ${state.batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${state.batteryLevel}%` }}
                      />
                    </div>
                    <span>{state.batteryLevel}%</span>
                    {state.isCharging && <span className="text-sm">Charging</span>}
                  </div>
                  <div className="mt-2">
                    <button 
                      className={`w-full text-left px-3 py-1 rounded-md ${themeStyles[state.theme].hover}`}
                      onClick={() => setState(prev => ({ ...prev, isCharging: !prev.isCharging }))}
                    >
                      {state.isCharging ? 'Stop Charging' : 'Start Charging'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Clock and Calendar */}
            <div className="relative">
              <motion.button
                className={`p-1 rounded-md ${themeStyles[state.theme].hover} clock-button`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowClockCalendar(!showClockCalendar)}
              >
                <span className={`text-sm ${
                  themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'text-black/90' : 'text-white/90'
                }`}>{state.currentTime}</span>
              </motion.button>
              
              {showClockCalendar && (
                <motion.div
                  className={`absolute ${state.taskbarPosition === 'bottom' ? 'bottom-10 right-0' : 'top-10 right-0'} w-64 p-4 rounded-md shadow-lg ${
                    themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'
                  } z-50`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <h3 className="font-medium mb-2 text-center">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <div className="text-center text-2xl font-bold mb-4">
                    {state.currentTime}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                      <div key={day} className="text-xs font-medium">{day}</div>
                    ))}
                    {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`p-1 text-xs rounded-full ${i + 1 === new Date().getDate() ? 'bg-blue-500 text-white' : ''}`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button 
                      className={`w-full text-left px-3 py-1 rounded-md ${themeStyles[state.theme].hover}`}
                      onClick={() => openWindow(8)}
                    >
                      Open Calendar
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Notification Center */}
            <div className="relative">
              <motion.button
                className={`p-1 rounded-md ${themeStyles[state.theme].hover} notification-center-button`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  {state.notifications.some(n => !n.read) && (
                    <circle cx="16" cy="4" r="4" fill="red" />
                  )}
                </svg>
              </motion.button>
              
              {showNotificationCenter && (
                <motion.div
                  ref={notificationCenterRef}
                  className={`absolute ${state.taskbarPosition === 'bottom' ? 'bottom-10 right-0' : 'top-10 right-0'} w-80 h-96 rounded-md shadow-lg ${
                    themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'
                  } z-50 flex flex-col`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-medium">Notifications</h3>
                    <button 
                      className="text-sm"
                      onClick={clearAllNotifications}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {state.notifications.length > 0 ? (
                      state.notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-3 border-b ${!notification.read ? 'bg-blue-500/10' : ''}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{notification.icon}</span>
                            <div>
                              <div className="font-medium">{notification.title}</div>
                              <div className="text-sm">{notification.message}</div>
                              <div className="text-xs opacity-50 mt-1">{notification.time}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Action Center */}
            <div className="relative">
              <motion.button
                className={`p-1 rounded-md ${themeStyles[state.theme].hover} action-center-button`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowActionCenter(!showActionCenter)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </motion.button>
              
              {showActionCenter && (
                <motion.div
                  ref={actionCenterRef}
                  className={`absolute ${state.taskbarPosition === 'bottom' ? 'bottom-10 right-0' : 'top-10 right-0'} w-80 rounded-md shadow-lg ${
                    themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'
                  } z-50 p-3`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <h3 className="font-medium mb-3">Quick Settings</h3>
                  <div className="grid grid-cols-4 gap-3">
                    <button 
                      className={`flex flex-col items-center p-2 rounded-md ${themeStyles[state.theme].hover}`}
                      onClick={toggleShowDesktop}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs mt-1">Desktop</span>
                    </button>
                    <button 
                      className={`flex flex-col items-center p-2 rounded-md ${themeStyles[state.theme].hover}`}
                      onClick={() => setState(prev => ({ ...prev, networkStatus: prev.networkStatus === 'connected' ? 'disconnected' : 'connected' }))}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        {state.networkStatus === 'connected' ? (
                          <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M2.28 3.06a1 1 0 011.415 0L6.05 5.83a7.028 7.028 0 012.196-.646 1 1 0 11.262 1.99 5.03 5.03 0 00-1.572.48l1.414 1.414a3.029 3.029 0 011.572-.48 1 1 0 11.262 1.99 1.03 1.03 0 00-.33.123l1.456 1.456a1 1 0 01-1.414 1.414L2.28 4.475a1 1 0 010-1.414zM5.724 7.638a1 1 0 011.39-.278c.19.127.322.3.386.498a1 1 0 11-1.885.666 1 1 0 01.11-.886zm3.114 4.335a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 011.414 1.414l-1.414 1.414zm-6.028-6.028a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 011.414 1.414l-1.414 1.414zM10 13a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        )}
                      </svg>
                      <span className="text-xs mt-1">Wi-Fi</span>
                    </button>
                    <button 
                      className={`flex flex-col items-center p-2 rounded-md ${themeStyles[state.theme].hover}`}
                      onClick={() => setState(prev => ({ ...prev, volume: prev.volume === 0 ? 70 : 0 }))}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        {state.volume === 0 ? (
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        )}
                      </svg>
                      <span className="text-xs mt-1">{state.volume === 0 ? 'Mute' : 'Sound'}</span>
                    </button>
                    <button 
                      className={`flex flex-col items-center p-2 rounded-md ${themeStyles[state.theme].hover}`}
                      onClick={() => setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        {state.theme === 'dark' ? (
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        ) : (
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        )}
                      </svg>
                      <span className="text-xs mt-1">{state.theme === 'dark' ? 'Light' : 'Dark'}</span>
                    </button>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span>Brightness</span>
                      <span>{state.brightness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={state.brightness}
                      onChange={(e) => setState(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Power Options */}
            <div className="relative">
              <motion.button
                className={`p-1 rounded-md ${themeStyles[state.theme].hover}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setState(prev => ({ ...prev, showPowerOptions: !prev.showPowerOptions }))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </motion.button>
              
              {state.showPowerOptions && (
                <motion.div
                  className={`absolute ${state.taskbarPosition === 'bottom' ? 'bottom-10 right-0' : 'top-10 right-0'} w-48 py-1 rounded-md shadow-lg ${
                    themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'
                  } z-50`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
                    onClick={() => handlePowerAction('shutdown')}
                  >
                    Shut down
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
                    onClick={() => handlePowerAction('restart')}
                  >
                    Restart
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
                    onClick={() => handlePowerAction('sleep')}
                  >
                    Sleep
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
                    onClick={() => handlePowerAction('logout')}
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Start Menu */}
        <AnimatePresence>
          {state.isStartMenuOpen && (
            <motion.div
              ref={startMenuRef}
              className={`fixed ${state.taskbarPosition === 'bottom' ? 'bottom-12 left-4' : 
                state.taskbarPosition === 'top' ? 'top-12 left-4' :
                state.taskbarPosition === 'left' ? 'bottom-4 left-12' :
                'bottom-4 right-12'} 
              w-[420px] h-[600px] ${themeStyles[state.theme].startMenu} backdrop-blur-3xl rounded-3xl shadow-2xl border ${
                themeStyles[state.theme].border
              } z-50 overflow-hidden flex flex-col`}
              initial={state.animationEnabled ? { opacity: 0, y: state.taskbarPosition === 'bottom' ? 50 : -50, scale: 0.85 } : false}
              animate={state.animationEnabled ? { opacity: 1, y: 0, scale: 1 } : false}
              exit={state.animationEnabled ? { opacity: 0, y: state.taskbarPosition === 'bottom' ? 30 : -30, scale: 0.9 } : false}
              transition={state.animationEnabled ? { type: "spring", stiffness: 140, damping: 20 } : false}
            >
              {/* Watermark */}
              <div className="px-5 pt-5 pb-2 flex justify-between items-center">
                <span className={`text-xs font-semibold select-none ${
                  themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'text-black/40' : 'text-white/40'
                }`}>Hypernova OS v1.0</span>
              </div>

              {/* Search Bar */}
              <div className="px-5 pb-3">
                <input
                  type="text"
                  placeholder="Search apps..."
                  className={`w-full p-2 rounded-xl ${
                    themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' 
                      ? 'bg-black/10 focus:ring-black/30 placeholder-black/50' 
                      : 'bg-white/10 focus:ring-white/30 placeholder-white/50'
                  } focus:outline-none focus:ring-2`}
                  value={state.searchQuery}
                  onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                />
              </div>

              {/* Categories */}
              <div className="px-5 pb-2">
                <div className="flex overflow-x-auto pb-2">
                  {appCategories.map(category => (
                    <button
                      key={category.id}
                      className={`px-3 py-1 rounded-full whitespace-nowrap mr-2 ${
                        state.selectedCategory === category.id 
                          ? `text-white bg-[${state.accentColor}]`
                          : themeStyles[state.theme].hover
                      }`}
                      onClick={() => setState(prev => ({ ...prev, selectedCategory: category.id }))}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apps Grid */}
              <div className="flex-1 p-5 pt-0 overflow-y-auto">
                {state.startMenuLayout === 'grid' ? (
                  <div className="grid grid-cols-3 gap-5">
                    {filteredApps.length > 0 ? (
                      filteredApps.map(app => (
                        <motion.button
                          key={app.id}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${themeStyles[state.theme].hover} transition duration-300 ease-in-out shadow-lg`}
                          whileHover={{
                            scale: 1.15,
                            boxShadow: themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' 
                              ? "0px 16px 40px rgba(0,0,0,0.15)" 
                              : "0px 16px 40px rgba(255,255,255,0.15)",
                            transition: { type: "spring", stiffness: 400, damping: 20 }
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openWindow(app.id)}
                        >
                          <span className="text-4xl">{app.icon}</span>
                          <span className={`text-sm text-center ${
                            themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'text-black/90' : 'text-white/90'
                          }`}>{app.name}</span>
                        </motion.button>
                      ))
                    ) : (
                      <div className={`col-span-3 text-center py-10 ${
                        themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'text-black/50' : 'text-white/50'
                      }`}>No apps found</div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredApps.length > 0 ? (
                      filteredApps.map(app => (
                        <motion.button
                          key={app.id}
                          className={`flex items-center gap-3 w-full p-3 rounded-xl ${themeStyles[state.theme].hover}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openWindow(app.id)}
                        >
                          <span className="text-2xl">{app.icon}</span>
                          <span className={`text-sm ${
                            themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'text-black/90' : 'text-white/90'
                          }`}>{app.name}</span>
                        </motion.button>
                      ))
                    ) : (
                      <div className={`text-center py-10 ${
                        themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'text-black/50' : 'text-white/50'
                      }`}>No apps found</div>
                    )}
                  </div>
                )}
              </div>

              {/* User and Power Options */}
              <div className={`border-t ${themeStyles[state.theme].border} p-4 flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: state.accentColor }}
                  >
                    <span className="text-sm">U</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    themeStyles[state.theme].window === 'bg-[#f5f5f5] text-black' ? 'text-black/90' : 'text-white/90'
                  }`}>User</span>
                </div>
                <button
                  className={`p-2 rounded-full ${themeStyles[state.theme].hover}`}
                  onClick={() => handlePowerAction('shutdown')}
                  title="Power"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Context Menu */}
        {showDesktopContextMenu && (
          <motion.div
            className={`fixed ${themeStyles[state.theme].contextMenu} shadow-xl rounded-md z-50 context-menu`}
            style={{
              top: desktopContextMenuPosition.y,
              left: desktopContextMenuPosition.x
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowDesktopContextMenu(false);
                openWindow(1); // File Explorer
              }}
            >
              Open File Explorer
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowDesktopContextMenu(false);
                setState(prev => ({ ...prev, isStartMenuOpen: true }));
              }}
            >
              Open Start Menu
            </button>
            <div className="border-t border-gray-200/10"></div>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowDesktopContextMenu(false);
                toggleShowDesktop();
              }}
            >
              {state.showDesktop ? 'Show Windows' : 'Show Desktop'}
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowDesktopContextMenu(false);
                toggleDesktopIcons();
              }}
            >
              {state.desktopIcons ? 'Hide Desktop Icons' : 'Show Desktop Icons'}
            </button>
            <div className="border-t border-gray-200/10"></div>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowDesktopContextMenu(false);
                openWindow(3); // Settings
              }}
            >
              Display Settings
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowDesktopContextMenu(false);
                openWindow(12); // Task Manager
              }}
            >
              Task Manager
            </button>
          </motion.div>
        )}

        {/* File Context Menu */}
        {showFileContextMenu && selectedFile && (
          <motion.div
            className={`fixed ${themeStyles[state.theme].contextMenu} shadow-xl rounded-md z-50 context-menu`}
            style={{
              top: fileContextMenuPosition.y,
              left: fileContextMenuPosition.x
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-200/10">
              <span className="text-lg">{selectedFile.icon}</span>
              <span className="font-medium">{selectedFile.name}</span>
            </div>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowFileContextMenu(false);
                if (selectedFile.type === 'app') {
                  const app = apps.find(a => a.name === selectedFile.name);
                  if (app) openWindow(app.id);
                }
              }}
            >
              Open
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowFileContextMenu(false);
                // Implement pin to taskbar
                addNotification('Pinned to Taskbar', `${selectedFile.name} has been pinned to taskbar`, '📌');
              }}
            >
              Pin to Taskbar
            </button>
            <div className="border-t border-gray-200/10"></div>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowFileContextMenu(false);
                // Implement rename functionality
                addNotification('Rename', `Renaming ${selectedFile.name}`, '✏️');
              }}
            >
              Rename
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowFileContextMenu(false);
                // Implement delete functionality
                addNotification('Deleted', `${selectedFile.name} has been moved to recycle bin`, '🗑️');
              }}
            >
              Delete
            </button>
            <div className="border-t border-gray-200/10"></div>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowFileContextMenu(false);
                // Implement properties functionality
                addNotification('Properties', `Showing properties for ${selectedFile.name}`, '📋');
              }}
            >
              Properties
            </button>
          </motion.div>
        )}

        {/* Taskbar Context Menu */}
        {showTaskbarContextMenu && (
          <motion.div
            className={`fixed ${themeStyles[state.theme].contextMenu} shadow-xl rounded-md z-50 context-menu`}
            style={{
              top: taskbarContextMenuPosition.y,
              left: taskbarContextMenuPosition.x
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowTaskbarContextMenu(false);
                setState(prev => ({ ...prev, isStartMenuOpen: true }));
              }}
            >
              Open Start Menu
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowTaskbarContextMenu(false);
                toggleShowDesktop();
              }}
            >
              {state.showDesktop ? 'Show Windows' : 'Show Desktop'}
            </button>
            <div className="border-t border-gray-200/10"></div>
            <div className="px-4 py-1 text-xs opacity-50">Taskbar Position</div>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${state.taskbarPosition === 'bottom' ? themeStyles[state.theme].active : themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowTaskbarContextMenu(false);
                changeTaskbarPosition('bottom');
              }}
            >
              Bottom
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${state.taskbarPosition === 'top' ? themeStyles[state.theme].active : themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowTaskbarContextMenu(false);
                changeTaskbarPosition('top');
              }}
            >
              Top
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${state.taskbarPosition === 'left' ? themeStyles[state.theme].active : themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowTaskbarContextMenu(false);
                changeTaskbarPosition('left');
              }}
            >
              Left
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${state.taskbarPosition === 'right' ? themeStyles[state.theme].active : themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowTaskbarContextMenu(false);
                changeTaskbarPosition('right');
              }}
            >
              Right
            </button>
            <div className="border-t border-gray-200/10"></div>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${themeStyles[state.theme].hover}`}
              onClick={() => {
                setShowTaskbarContextMenu(false);
                openWindow(3); // Settings
              }}
            >
              Taskbar Settings
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DesktopOS;