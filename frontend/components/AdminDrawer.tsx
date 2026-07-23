"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
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
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import {
  Menu,
  BriefcaseBusiness,
  FileText,
  Mail,
  Newspaper,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { adminFetch } from "@/lib/adminFetch";

const drawerWidth = 240;
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getNewApplicationsCount(): Promise<number> {
  const res = await adminFetch(`${API_URL}/api/applications/stats`);
  if (!res.ok) return 0;
  const json = await res.json();
  return json.data?.newApplicationsCount ?? 0;
}

async function getNewMessagesCount(): Promise<number> {
  const res = await adminFetch(`${API_URL}/api/contacts/stats`);
  if (!res.ok) return 0;
  const json = await res.json();
  return json.data?.newMessagesCount ?? 0;
}

function buildNavSections(newApplications: number, newMessages: number) {
  return [
    {
      label: "Overview",
      items: [
        {
          text: "Dashboard",
          icon: <LayoutDashboard size={16} />,
          badge: null as number | null,
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
          badge: null as number | null,
          href: "/admin/dashboard/vacancies",
        },
        {
          text: "Applications",
          icon: <FileText size={16} />,
          badge: newApplications > 0 ? newApplications : null,
          href: "/admin/dashboard/applications",
        },
        {
          text: "Talent Pool",
          icon: <Users size={16} />,
          badge: null as number | null,
          href: "/admin/dashboard/talent-pool",
        },
      ],
    },
    {
      label: "Communications",
      items: [
        {
          text: "Messages",
          icon: <Mail size={16} />,
          badge: newMessages > 0 ? newMessages : null,
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
          badge: null as number | null,
          href: "/admin/dashboard/blogs",
        },
      ],
    },
    {
      label: "Admin",
      items: [
        {
          text: "Settings",
          icon: <Settings size={16} />,
          badge: null as number | null,
          href: "/admin/dashboard/settings",
        },
      ],
    },
  ];
}

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const newApplicationsQuery = useQuery({
    queryKey: ["applications", "stats", "nav-badge"],
    queryFn: getNewApplicationsCount,
    refetchInterval: 60_000,
  });
  const newMessagesQuery = useQuery({
    queryKey: ["contacts", "stats", "nav-badge"],
    queryFn: getNewMessagesCount,
    refetchInterval: 60_000,
  });
  const NAV_SECTIONS = React.useMemo(
    () => buildNavSections(newApplicationsQuery.data ?? 0, newMessagesQuery.data ?? 0),
    [newApplicationsQuery.data, newMessagesQuery.data]
  );

  const userEmail = session?.user?.email ?? "";
  const userName = session?.user?.name ?? userEmail.split("@")[0];
  const userInitials = userName
    .split(/[\s.@_-]+/)
    .slice(0, 2)
    .map((p: string) => p[0]?.toUpperCase() ?? "")
    .join("") || "AD";

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/admin/login");
  };
  const activeItem = React.useMemo(() => {
    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        if (pathname?.startsWith(item.href)) return item.text;
      }
    }
    return "";
  }, [pathname]);

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
                      <ListItemButton
                        component={Link}
                        href={item.href}
                        onClick={() => mobileOpen && handleDrawerClose()}
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
                              backgroundColor: "#c0392b",
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
              textTransform: "uppercase",
            }}
          >
            {userInitials}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                fontFamily: "var(--font-label)",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "white",
                lineHeight: 1.2,
              }}
            >
              {userName}
            </Typography>
            <Typography
              noWrap
              sx={{
                fontFamily: "var(--font-label)",
                fontSize: "0.625rem",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.2,
              }}
            >
              {userEmail}
            </Typography>
          </Box>
          <Tooltip title="Sign out" placement="top">
            <IconButton
              size="small"
              onClick={handleLogout}
              aria-label="Sign out"
              sx={{
                color: "rgba(255,255,255,0.5)",
                "&:hover": { color: "white", backgroundColor: "rgba(255,255,255,0.1)" },
                flexShrink: 0,
              }}
            >
              <LogOut size={14} />
            </IconButton>
          </Tooltip>
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
