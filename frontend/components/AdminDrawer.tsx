"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import {
  Menu,
  BriefcaseBusiness,
  FileText,
  Mail,
  Newspaper,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";

const drawerWidth = 240;

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      {
        text: "Dashboard",
        icon: <LayoutDashboard size={16} />,
        badge: null,
        href: "/admin/dashboard/overview",
      },
    ],
  },
  {
    label: "Recruitment",
    items: [
      {
        text: "Jobs & Vacancies",
        icon: <BriefcaseBusiness size={16} />,
        badge: null,
        href: "/admin/dashboard/vacancies",
      },
      {
        text: "Applications",
        icon: <FileText size={16} />,
        badge: "12",
        href: "/admin/dashboard/applications",
      },
    ],
  },
  {
    label: "Communications",
    items: [
      {
        text: "Messages",
        icon: <Mail size={16} />,
        badge: "5",
        href: "/admin/dashboard/messages",
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        text: "Blog & News",
        icon: <Newspaper size={16} />,
        badge: null,
        href: "/admin/dashboard/blogs",
      },
    ],
  },
];

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState("Jobs & Vacancies");

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-primary)",
        color: "white",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          px: 2,
          pt: 2.5,
          pb: 2,
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "white",
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}
        >
          Glowing partner
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-label)",
            fontSize: "0.6rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            mt: 0.3,
          }}
        >
          Admin Panel
        </Typography>
      </Box>

      {/* Nav sections */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          py: 1,
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "#dacece",
            borderRadius: "99px",
          },
        }}
      >
        {NAV_SECTIONS.map((section) => (
          <Box key={section.label}>
            {/* Section label */}
            <Typography
              sx={{
                fontFamily: "var(--font-label)",
                fontSize: "0.55rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                px: 2,
                pt: 2,
                pb: 0.5,
              }}
            >
              {section.label}
            </Typography>

            <List disablePadding>
              {section.items.map((item) => {
                const isActive = activeItem === item.text;
                return (
                  <ListItem key={item.text} disablePadding>
                    <Link href={item.href}>
                      <ListItemButton
                        onClick={() => setActiveItem(item.text)}
                        sx={{
                          px: 2,
                          py: 0.9,
                          borderLeft: isActive
                            ? "3px solid var(--color-secondary)"
                            : "3px solid transparent",
                          backgroundColor: isActive
                            ? "rgba(255,255,255,0.13)"
                            : "transparent",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.08)",
                          },
                          transition: "all 0.15s",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 32,
                            color: isActive ? "white" : "rgba(255,255,255,0.7)",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          slotProps={{
                            primary: {
                              sx: {
                                fontFamily: "var(--font-label)",
                                fontSize: "0.8125rem",
                                fontWeight: isActive ? 500 : 400,
                                color: isActive
                                  ? "white"
                                  : "rgba(255,255,255,0.75)",
                              },
                            },
                          }}
                        />
                        {/* Badge */}
                        {item.badge && (
                          <Box
                            sx={{
                              backgroundColor: "var(--color-secondary)",
                              color: "white",
                              fontSize: "0.6rem",
                              fontWeight: 600,
                              fontFamily: "var(--font-label)",
                              px: 0.8,
                              py: 0.1,
                              borderRadius: "8px",
                              lineHeight: 1.6,
                            }}
                          >
                            {item.badge}
                          </Box>
                        )}
                      </ListItemButton>
                    </Link>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Bottom user pill */}
      <Box
        sx={{
          p: 1.5,
          borderTop: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: "8px",
            px: 1,
            py: 0.75,
          }}
        >
          {/* Avatar */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: "var(--color-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.6875rem",
              fontWeight: 600,
              fontFamily: "var(--font-label)",
              color: "white",
              flexShrink: 0,
            }}
          >
            AD
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-label)",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "white",
                lineHeight: 1.2,
              }}
            >
              Admin
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-label)",
                fontSize: "0.625rem",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.2,
              }}
            >
              Super Admin
            </Typography>
          </Box>
          <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "white",
          borderBottom: "0.5px solid rgba(20,86,82,0.15)",
          color: "var(--color-on-surface)",
        }}
      >
        <Toolbar sx={{ minHeight: "52px !important", px: { xs: 2, sm: 2.5 } }}>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              color: "var(--color-primary)",
            }}
          >
            <Menu size={20} />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--color-primary)",
              letterSpacing: "0.01em",
              flex: 1,
            }}
          >
            {activeItem}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer nav */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="admin navigation"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "var(--color-primary)",
              borderRight: "none",
            },
          }}
          slotProps={{ root: { keepMounted: true } }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "var(--color-primary)",
              borderRight: "none",
              "&::-webkit-scrollbar": { width: "3px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: "var(--color-secondary)",
                borderRadius: "99px",
              },
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
