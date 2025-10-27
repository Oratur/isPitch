// 'use client';

// import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
// import { FileAudio, FileText, LayoutGrid } from 'lucide-react';
// import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';

// const DRAWER_WIDTH = 280;

// interface AnalysisSidebarProps {
//   fileName: string;
//   basePath: string;
// }

// export function AnalysisSidebar({ fileName, basePath }: AnalysisSidebarProps) {
//   const searchParams = useSearchParams();
//   const currentView = searchParams.get('view') || 'transcription';

//   const navItems = [
//     { text: 'Transcrição', icon: <FileText />, view: 'transcription' },
//     { text: 'Análise', icon: <LayoutGrid />, view: 'analytics' },
//   ];

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: DRAWER_WIDTH,
//         flexShrink: 0,
//         ['& .MuiDrawer-paper']: {
//           width: DRAWER_WIDTH,
//           boxSizing: 'border-box',
//           position: 'relative', 
//           borderRight: 'none',
//         },
//       }}
//     >
//       <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
//         <FileAudio className="text-gray-500" />
//         <Typography variant="body2" color="text.secondary" noWrap>
//           {fileName}
//         </Typography>
//       </Box>
//       <Divider />
//       <List>
//         {navItems.map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <ListItemButton
//               component={Link}
//               href={`${basePath}?view=${item.view}`}
//               selected={currentView === item.view}
//               sx={{
//                 '&.Mui-selected': {
//                   backgroundColor: 'action.selected',
//                   borderRight: 3,
//                   borderColor: 'primary.main',
//                   '&:hover': {
//                     backgroundColor: 'action.hover',
//                   }
//                 },
//               }}
//             >
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </Drawer>
//   );
// }
'use client';

import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FileText, BarChart2 } from 'lucide-react';
import MyBox from './MyBox';
import theme from '@/styles/theme';

interface AnalysisSidebarProps {
  fileName: string;
  basePath: string; // Ex: /analysis/some-id
}

export function AnalysisSidebar({ fileName, basePath }: AnalysisSidebarProps) {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'transcription';

  const navItems = [
    { text: 'Transcrição', href: 'transcription', icon: <FileText size={20} color={theme.palette.purple.light1} /> },
    { text: 'Métricas', href: 'analytics', icon: <BarChart2 size={20} color={theme.palette.purple.light1}/> },
  ];


  return (
    <MyBox
      variant="sideBar"
      component="aside"
      sx={{
        display: { xs: 'none', md: 'flex' }, // Esconde em telas pequenas
        borderColor: theme.palette.purple.light1 // borda direita da Sidebar
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" noWrap>
          Análise de Áudio
        </Typography>
        <Typography variant="body2" noWrap>
          Arquivo: <strong>{fileName}</strong>
        </Typography>
      </Box>

      <List component="nav" sx={{ width: '100%' }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              href={`${basePath}?view=${item.href}`}
              selected={currentView === item.href}
              sx={{
                borderRadius: '8px',
                transition: 'all 0.3s ease',

                // Texto padrão
                '& .MuiListItemText-primary': {
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: theme.palette.purple.light1,
                },

                // Quando selecionado
                '&.Mui-selected': {
                  backgroundColor: 'rgba(127, 19, 236, 0.15)', // Roxo com transparência
                  borderLeft: '4px solid #7F13EC',
                  paddingLeft: 'calc(16px - 4px)', // Ajusta padding para a borda não deslocar

                  '& .MuiListItemText-primary': {
                    fontWeight: 700,
                    color: theme.palette.purple.contrastText,
                  },

                  '& .MuiListItemIcon-root': {
                    color: '#7F13EC',
                  },

                  '&:hover': {
                    backgroundColor: 'rgba(127, 19, 236, 0.25)',
                  },
                },

                // Hover quando não selecionado
                '&:hover:not(.Mui-selected)': {
                  backgroundColor: 'rgba(127, 19, 236, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </MyBox>
  );
}