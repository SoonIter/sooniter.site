import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Terminal.module.css';
import { useSidebarData, useRouter } from '@rspress/core/runtime';
import { buildFileSystemFromSidebar, resolvePath, FileSystemNode } from './utils';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

type TerminalHistoryItem = {
  id: string;
  type: 'input' | 'output';
  content: React.ReactNode;
  path?: string; // For input, which path it was executed in
};

interface TerminalProps {
  onSwitchToGui: () => void;
}

const WelcomeMessage = () => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ color: '#27c93f', fontWeight: 'bold' }}>Welcome to SoonIter's Terminal v1.0.0</div>
    <div>Type <span style={{ color: '#fff', fontWeight: 'bold' }}>help</span> to see available commands.</div>
    <div>Type <span style={{ color: '#fff', fontWeight: 'bold' }}>gui</span> or click the traffic lights to switch to standard Web UI.</div>
    <div style={{ marginTop: 8, color: '#666' }}>System: Linux sooniter-server 6.8.0-generic x86_64</div>
    <div style={{ width: '100%', height: 1, background: '#333', margin: '10px 0' }} />
  </div>
);

export default function Terminal({ onSwitchToGui }: TerminalProps) {
  const sidebar = useSidebarData();
  const router = useRouter();
  
  // Build FS only once or when sidebar changes
  const fs = useMemo(() => buildFileSystemFromSidebar(sidebar), [sidebar]);

  const [history, setHistory] = useState<TerminalHistoryItem[]>([
    { id: 'init', type: 'output', content: <WelcomeMessage /> }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]); // [] = root
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus input on click
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const getPathString = (path: string[]) => {
    return path.length === 0 ? '~' : '~/' + path.join('/');
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) {
      setHistory(prev => [...prev, { id: Date.now().toString(), type: 'input', content: trimmed, path: getPathString(currentPath) }]);
      return;
    }

    // Add to command history
    setCmdHistory(prev => [...prev, trimmed]);
    setCmdIndex(-1);

    const [cmd, ...args] = trimmed.split(/\s+/);
    
    // Add input line to display history
    const inputEntry: TerminalHistoryItem = { 
      id: Date.now() + '-in', 
      type: 'input', 
      content: trimmed,
      path: getPathString(currentPath)
    };
    
    let outputEntry: TerminalHistoryItem | null = null;

    // Helper to get current directory node
    const getCurrentDirNode = () => {
      const { node } = resolvePath(fs, [], currentPath.length === 0 ? '/' : currentPath.join('/'));
      return node;
    };

    switch (cmd) {
      case 'help':
        outputEntry = {
          id: Date.now() + '-out',
          type: 'output',
          content: (
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px' }}>
              <span style={{ color: '#27c93f' }}>ls</span> <span>List directory contents</span>
              <span style={{ color: '#27c93f' }}>cd</span> <span>Change directory</span>
              <span style={{ color: '#27c93f' }}>cat</span> <span>View file content (preview)</span>
              <span style={{ color: '#27c93f' }}>open</span> <span>Open file in full Web UI</span>
              <span style={{ color: '#27c93f' }}>pwd</span> <span>Print working directory</span>
              <span style={{ color: '#27c93f' }}>clear</span> <span>Clear terminal screen</span>
              <span style={{ color: '#27c93f' }}>gui</span> <span>Switch to standard Web UI</span>
              <span style={{ color: '#27c93f' }}>whoami</span> <span>Print current user</span>
            </div>
          )
        };
        break;

      case 'clear':
        setHistory([]);
        return; // Early return to avoid adding input line if we cleared everything (optional, but standard behavior keeps input history visible usually. Here we clear screen).
        // Actually, usually 'clear' clears the view. Let's just reset history.
        // But we might want to keep the current input line? No, clear wipes it.
        break;

      case 'gui':
      case 'exit':
        onSwitchToGui();
        outputEntry = { id: Date.now() + '-out', type: 'output', content: 'Switching to GUI...' };
        break;

      case 'whoami':
        outputEntry = { id: Date.now() + '-out', type: 'output', content: 'guest' };
        break;

      case 'pwd':
        outputEntry = { id: Date.now() + '-out', type: 'output', content: '/' + currentPath.join('/') };
        break;

      case 'ls':
        const dirNode = getCurrentDirNode();
        if (dirNode && dirNode.children) {
          const items = Object.values(dirNode.children).map(child => (
            <span 
              key={child.name} 
              className={child.type === 'dir' ? styles['file-dir'] : styles['file-md']}
              style={{ marginRight: 20, display: 'inline-block' }}
            >
              {child.name}{child.type === 'dir' ? '/' : ''}
            </span>
          ));
          outputEntry = { id: Date.now() + '-out', type: 'output', content: <div>{items.length > 0 ? items : '(empty)'}</div> };
        } else {
          outputEntry = { id: Date.now() + '-out', type: 'output', content: `Error: Cannot list contents of current path.` };
        }
        break;

      case 'cd':
        const target = args[0];
        if (!target || target === '~') {
          setCurrentPath([]);
        } else {
          const { node, newPath } = resolvePath(fs, currentPath, target);
          if (node && node.type === 'dir') {
            setCurrentPath(newPath);
          } else {
            outputEntry = { 
              id: Date.now() + '-out', 
              type: 'output', 
              content: <span style={{ color: '#ff5f56' }}>cd: no such directory: {target}</span> 
            };
          }
        }
        break;

      case 'open':
        const fileToOpen = args[0];
        if (!fileToOpen) {
          outputEntry = { id: Date.now() + '-out', type: 'output', content: 'Usage: open <filename>' };
        } else {
          const { node } = resolvePath(fs, currentPath, fileToOpen);
          if (node && node.type === 'file' && node.link) {
            outputEntry = { id: Date.now() + '-out', type: 'output', content: `Opening ${fileToOpen}...` };
            // Use Rspress router or window location
            // If it's an external link or needs full reload, use window.location
            // Rspress router is better for SPA feeling if possible.
            // But wait, we are inside the Terminal component. We need to toggle GUI mode FIRST, then navigate?
            // Or just navigate and let the layout handle it.
            // We should probably toggle GUI mode as well, otherwise user stays in terminal.
            onSwitchToGui();
            router.push(node.link);
          } else {
            outputEntry = { 
              id: Date.now() + '-out', 
              type: 'output', 
              content: <span style={{ color: '#ff5f56' }}>open: file not found: {fileToOpen}</span> 
            };
          }
        }
        break;

      case 'cat':
        const fileToCat = args[0];
        if (!fileToCat) {
          outputEntry = { id: Date.now() + '-out', type: 'output', content: 'Usage: cat <filename>' };
        } else {
          const { node } = resolvePath(fs, currentPath, fileToCat);
          if (node && node.type === 'file') {
            outputEntry = { 
              id: Date.now() + '-out', 
              type: 'output', 
              content: <div style={{ whiteSpace: 'pre-wrap' }}>{node.content || '(no content)'}</div> 
            };
          } else {
             outputEntry = { 
              id: Date.now() + '-out', 
              type: 'output', 
              content: <span style={{ color: '#ff5f56' }}>cat: file not found: {fileToCat}</span> 
            };
          }
        }
        break;

      default:
        outputEntry = { 
          id: Date.now() + '-out', 
          type: 'output', 
          content: <span style={{ color: '#ff5f56' }}>zsh: command not found: {cmd}</span> 
        };
    }

    if (cmd !== 'clear') {
      setHistory(prev => outputEntry ? [...prev, inputEntry, outputEntry] : [...prev, inputEntry]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIndex = cmdIndex + 1;
        if (newIndex < cmdHistory.length) {
          setCmdIndex(newIndex);
          // history is pushed back, so last item is at length-1.
          // We want to go backwards from the end.
          const historyItem = cmdHistory[cmdHistory.length - 1 - newIndex];
          setInputVal(historyItem);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex > 0) {
        const newIndex = cmdIndex - 1;
        setCmdIndex(newIndex);
        const historyItem = cmdHistory[cmdHistory.length - 1 - newIndex];
        setInputVal(historyItem);
      } else if (cmdIndex === 0) {
        setCmdIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete
      const parts = inputVal.split(' ');
      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        const { node } = resolvePath(fs, [], currentPath.length === 0 ? '/' : currentPath.join('/'));
        if (node && node.children) {
          const matches = Object.keys(node.children).filter(name => name.startsWith(lastPart));
          if (matches.length === 1) {
            parts[parts.length - 1] = matches[0];
            setInputVal(parts.join(' '));
          }
        }
      }
    }
  };

  return (
    <div className={styles.terminalContainer} onClick={handleContainerClick}>
      <div className={styles.terminalHeader}>
        <div className={styles.trafficLights}>
          <div className={`${styles.trafficLight} ${styles.close}`} onClick={onSwitchToGui} title="Close Terminal (Switch to GUI)" />
          <div className={`${styles.trafficLight} ${styles.minimize}`} />
          <div className={`${styles.trafficLight} ${styles.maximize}`} />
        </div>
        <div className={styles.terminalTitle}>guest@sooniter-blog: {getPathString(currentPath)}</div>
        <button className={styles.exitButton} onClick={onSwitchToGui}>Switch to UI</button>
      </div>

      <div className={styles.terminalBody}>
        <AnimatePresence>
          {history.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              className={styles.outputLine}
            >
              {item.type === 'input' && (
                <div className={styles.commandLine}>
                  <span className={styles.prompt}>➜</span>
                  <span className={styles.directory}>{item.path}</span>
                  <span style={{ marginLeft: 8 }}>{item.content}</span>
                </div>
              )}
              {item.type === 'output' && (
                <div>{item.content}</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Current Input Line */}
        <div className={styles.commandLine}>
            <span className={styles.prompt}>➜</span>
            <span className={styles.directory}>{getPathString(currentPath)}</span>
            <div className={styles.inputArea} style={{ marginLeft: 8 }}>
              <input
                ref={inputRef}
                className={styles.hiddenInput}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
              <span className={styles.inputDisplay}>
                {inputVal}
                <span className={`${styles.cursor} ${inputVal.length > 0 ? '' : styles.typing}`}>&nbsp;</span>
              </span>
            </div>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
