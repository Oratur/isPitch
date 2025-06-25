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

interface AnalysisSidebarProps {
  fileName: string;
  basePath: string; // Ex: /analysis/some-id
}

const navItems = [
  { text: 'Transcrição', href: 'transcription', icon: <FileText size={20} /> },
  { text: 'Métricas', href: 'analytics', icon: <BarChart2 size={20} /> },
];

export function AnalysisSidebar({ fileName, basePath }: AnalysisSidebarProps) {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'transcription';

  return (
    <Box
      component="aside"
      sx={{
        width: 280,
        borderRight: '1px solid',
        borderColor: 'divider',
        p: 2,
        backgroundColor: 'background.paper',
        display: { xs: 'none', md: 'flex' }, // Esconde em telas pequenas
        flexDirection: 'column',
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" noWrap>Análise de Áudio</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Arquivo: <strong>{fileName}</strong>
        </Typography>
      </Box>

      <List component="nav">
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={`${basePath}?view=${item.href}`}
              selected={currentView === item.href}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}