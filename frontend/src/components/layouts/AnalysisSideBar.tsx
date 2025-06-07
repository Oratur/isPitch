'use client';

import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { FileAudio, FileText, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Logo } from './Logo';

const DRAWER_WIDTH = 280;

interface AnalysisSidebarProps {
  fileName: string;
  basePath: string; // ex: /analysis/123
}

export function AnalysisSidebar({ fileName, basePath }: AnalysisSidebarProps) {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'transcription'; 

  const navItems = [
    { text: 'Transcrição', icon: <FileText />, view: 'transcription' },
    { text: 'Análise', icon: <LayoutGrid />, view: 'analytics' },
  ];

  const drawerContent = (
    <div>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Logo/>
      </Toolbar>

      <Divider />
     
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FileAudio className="text-gray-500" />
        <Typography variant="body2" color="text.secondary" noWrap>
          {fileName}
        </Typography>
      </Box>

      <Divider />

      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={`${basePath}?view=${item.view}`}
              selected={currentView === item.view}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                  borderRight: 3,
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        ['& .MuiDrawer-paper']: { 
          width: DRAWER_WIDTH, 
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}