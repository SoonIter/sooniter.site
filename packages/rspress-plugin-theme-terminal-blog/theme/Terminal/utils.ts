import type { SidebarGroup, SidebarItem } from '@rspress/core';

export type FileSystemNode = {
  type: 'file' | 'dir';
  name: string;
  content?: string; // For 'cat' preview (optional)
  link?: string;    // Actual URL for 'open'
  children?: Record<string, FileSystemNode>;
};

export const buildFileSystemFromSidebar = (sidebar: (SidebarGroup | SidebarItem)[]): Record<string, FileSystemNode> => {
  const root: Record<string, FileSystemNode> = {};

  const processItem = (item: SidebarGroup | SidebarItem, parentDir: Record<string, FileSystemNode>) => {
    // text is the display name
    // link is the path
    const name = item.text || 'Untitled';
    
    // Simple sanitization for file names (remove emojis, spaces to dashes if desired, but spaces are cool in modern terminals)
    // Let's keep original names but maybe strip unsafe chars if strictly needed. 
    // For now, use the text as the filename.
    const safeName = name.trim();

    if ('items' in item && item.items && item.items.length > 0) {
      // It's a directory
      const dirNode: FileSystemNode = {
        type: 'dir',
        name: safeName,
        children: {},
      };
      parentDir[safeName] = dirNode;
      item.items.forEach(subItem => processItem(subItem, dirNode.children!));
    } else if ('link' in item && item.link) {
      // It's a file
      // Add .md extension to make it look like a file
      const fileName = safeName.endsWith('.md') ? safeName : `${safeName}.md`;
      
      parentDir[fileName] = {
        type: 'file',
        name: fileName,
        link: item.link,
        content: `# Preview of ${name}...
Link: ${item.link}
(Use 'open ${fileName}' to read full post)`,
      };
    }
  };

  sidebar.forEach(item => processItem(item, root));
  
  // Manually add some "system" files
  root['README.md'] = {
    type: 'file',
    name: 'README.md',
    content: `# Welcome to SoonIter Blog

This is a terminal-based interface.
Type \`help\` for commands.`,
    link: '/'
  };

  return root;
};

// Helper to resolve path
export const resolvePath = (fs: Record<string, FileSystemNode>, currentPath: string[], targetPath: string): { node: FileSystemNode | null, newPath: string[] } => {
  if (targetPath === '/') return { node: { type: 'dir', name: 'root', children: fs }, newPath: [] };
  
  // Handle relative paths
  const parts = targetPath.split('/').filter(p => p !== '');
  let tempPath = targetPath.startsWith('/') ? [] : [...currentPath];
  
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      if (tempPath.length > 0) tempPath.pop();
      continue;
    }
    tempPath.push(part);
  }

  // Navigate to find the node
  let current: FileSystemNode = { type: 'dir', name: 'root', children: fs };
  
  for (const part of tempPath) {
    if (current.type !== 'dir' || !current.children || !current.children[part]) {
      return { node: null, newPath: currentPath }; // Not found
    }
    current = current.children[part];
  }

  return { node: current, newPath: tempPath };
};
