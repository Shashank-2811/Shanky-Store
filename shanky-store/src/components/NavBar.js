import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const ZEPTO_GREEN = "#43b02a";

const NavBar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{
      background: "#fff",
      color: ZEPTO_GREEN,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      borderRadius: 0,
      fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
      zIndex: 1200
    }}>
      <Toolbar sx={{ maxWidth: 1200, margin: "0 auto", width: "100%", minHeight: 64 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            color: ZEPTO_GREEN,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 1,
            fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
            cursor: 'pointer',
            '&:hover': { color: '#2e7d1f' }
          }}
        >
          Shanky Store
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button component={Link} to="/" sx={{
            color: ZEPTO_GREEN,
            fontWeight: 600,
            borderRadius: 24,
            px: 2,
            textTransform: 'none',
            '&:hover': { background: '#e0eafc', color: '#2e7d1f' }
          }}>Home</Button>
          <Button component={Link} to="/cart" sx={{
            color: ZEPTO_GREEN,
            fontWeight: 600,
            borderRadius: 24,
            px: 2,
            textTransform: 'none',
            '&:hover': { background: '#e0eafc', color: '#2e7d1f' }
          }}>🛒 Cart</Button>
          {user && user.role === "Admin" && (
            <Button component={Link} to="/admin" sx={{
              color: ZEPTO_GREEN,
              fontWeight: 600,
              borderRadius: 24,
              px: 2,
              textTransform: 'none',
              '&:hover': { background: '#e0eafc', color: '#2e7d1f' }
            }}>Admin</Button>
          )}
          {!token ? (
            <>
              <Button component={Link} to="/login" sx={{
                color: ZEPTO_GREEN,
                fontWeight: 600,
                borderRadius: 24,
                px: 2,
                textTransform: 'none',
                '&:hover': { background: '#e0eafc', color: '#2e7d1f' }
              }}>Login</Button>
              <Button component={Link} to="/register" sx={{
                color: ZEPTO_GREEN,
                fontWeight: 600,
                borderRadius: 24,
                px: 2,
                textTransform: 'none',
                '&:hover': { background: '#e0eafc', color: '#2e7d1f' }
              }}>Register</Button>
            </>
          ) : (
            <Button onClick={handleLogout} sx={{
              color: ZEPTO_GREEN,
              fontWeight: 600,
              borderRadius: 24,
              px: 2,
              textTransform: 'none',
              '&:hover': { background: '#e0eafc', color: '#2e7d1f' }
            }}>Logout</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;