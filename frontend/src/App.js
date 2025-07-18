import React, { useState, useEffect } from "react";
import {
  Container, Box, Typography, TextField, Button, Checkbox, FormControlLabel, Alert, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, AppBar, Toolbar, CssBaseline, createTheme, ThemeProvider, Avatar, Fade
} from "@mui/material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LoginIcon from '@mui/icons-material/Login';
import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = "http://localhost:8000";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // lacivert
      dark: '#0d133d',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5', // açık gri
      paper: '#fff',
    },
    secondary: {
      main: '#424242', // koyu gri
    },
    text: {
      primary: '#222',
      secondary: '#757575',
    },
  },
  shape: {
    borderRadius: 0, // düz köşe
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    fontWeightBold: 800,
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, letterSpacing: 1 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          transition: 'all 0.2s',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#0d133d',
            transform: 'none',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: '#f5f5f5',
          borderRadius: 0,
          transition: 'box-shadow 0.2s',
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '&.Mui-focused fieldset': {
              borderColor: '#1a237e',
              boxShadow: '0 0 0 2px #1a237e33',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0 2px 8px 0 rgba(26, 35, 126, 0.08)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background 0.2s',
          '&:hover': {
            background: '#e3e6f0',
          },
        },
      },
    },
  },
});

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true); // true: login, false: register
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  // Admin paneli için
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminAddName, setAdminAddName] = useState("");
  const [adminAddEmail, setAdminAddEmail] = useState("");
  const [adminAddUsername, setAdminAddUsername] = useState("");
  const [adminAddPassword, setAdminAddPassword] = useState("");
  const [adminAddIsAdmin, setAdminAddIsAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");
  const [adminDeleteId, setAdminDeleteId] = useState("");
  const [adminDeleteError, setAdminDeleteError] = useState("");
  const [adminDeleteSuccess, setAdminDeleteSuccess] = useState("");

  // Login sonrası token'ı localStorage'a kaydet
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Giriş başarısız");
      }
      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      // Kullanıcı bilgisi çek
      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const me = await meRes.json();
      setUser(me);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Kayıt başarısız");
      }
      setIsLogin(true);
      setEmail(""); setPassword(""); setUsername(""); setName("");
      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
    } catch (err) {
      setError(err.message);
    }
  };

  // Sayfa yenilendiğinde token'ı localStorage'dan yükle

  // Tüm API isteklerinde token'ı localStorage'dan al
  const getToken = () => localStorage.getItem('token');

  // Admin paneli: kullanıcıları çek
  useEffect(() => {
    if (user && token) {
      fetch(`${API_URL}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setAdminUsers(data);
        })
        .catch(() => setAdminUsers([]));
    }
  }, [user, token]);

  // Admin paneli: yeni kullanıcı ekle
  const handleAdminAddUser = async (e) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccess("");
    try {
      const res = await fetch(`${API_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: adminAddName,
          email: adminAddEmail,
          username: adminAddUsername,
          password: adminAddPassword,
          admin: adminAddIsAdmin,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Kullanıcı eklenemedi");
      }
      setAdminSuccess("Kullanıcı başarıyla eklendi!");
      setAdminAddName("");
      setAdminAddEmail("");
      setAdminAddUsername("");
      setAdminAddPassword("");
      setAdminAddIsAdmin(false);
      // Kullanıcı listesini güncelle
      fetch(`${API_URL}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setAdminUsers(data);
        });
    } catch (err) {
      setAdminError(err.message);
    }
  };

  // Kullanıcı Silme Fonksiyonu
  const handleAdminDeleteUser = async (e) => {
    e.preventDefault();
    setAdminDeleteError("");
    setAdminDeleteSuccess("");
    try {
      const res = await fetch(`${API_URL}/users/users/${adminDeleteId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Kullanıcı silinemedi");
      }
      setAdminDeleteSuccess("Kullanıcı başarıyla silindi!");
      setAdminDeleteId("");
      // Kullanıcı listesini güncelle
      fetch(`${API_URL}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setAdminUsers(data);
        });
    } catch (err) {
      setAdminDeleteError(err.message);
    }
  };

  // Çıkış fonksiyonu
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  // LOGO ve AVATAR ALANI (güncellendi)
  const Logo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, background: '#fff', borderRadius: '6px', p: '2px 8px', height: 44, boxShadow: '0 1px 4px 0 rgba(26,35,126,0.08)' }}>
      <img src="/koski-logo.png" alt="Koski Logo" style={{ height: 36, width: 'auto', display: 'block' }} />
    </Box>
  );
  const UserAvatar = () => (
    <Fade in={false}><Avatar sx={{ ml: 2, bgcolor: 'primary.dark', display: 'none' }}>A</Avatar></Fade>
  );

  // Degrade arka plan
  const backgroundStyle = {
    minHeight: '100vh',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    py: 4,
  };

  // Yönlendirme: Kullanıcı admin ise admin paneli, değilse ana sayfa
  if (user) {
    if (user.admin) {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={backgroundStyle}>
            <Container maxWidth="sm">
              <AppBar position="static" color="primary" elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
                <Toolbar>
                  <Logo />
                  <GroupIcon sx={{ mr: 1, fontSize: 32 }} />
                  <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 1 }}>Admin Paneli</Typography>
                  <UserAvatar />
                </Toolbar>
              </AppBar>
              <Paper elevation={6} sx={{ p: 5, borderRadius: 5, boxShadow: '0 8px 32px 0 rgba(255, 152, 0, 0.18)' }}>
                <Typography variant="h5" fontWeight={800} gutterBottom color="primary" sx={{ mb: 3 }}>Yeni Kullanıcı Ekle</Typography>
                <Box component="form" onSubmit={handleAdminAddUser} sx={{ mb: 4 }}>
                  <TextField label="Ad Soyad" value={adminAddName} onChange={e => setAdminAddName(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                  <TextField label="E-posta" value={adminAddEmail} onChange={e => setAdminAddEmail(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                  <TextField label="Kullanıcı Adı" value={adminAddUsername} onChange={e => setAdminAddUsername(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                  <TextField label="Şifre" type="password" value={adminAddPassword} onChange={e => setAdminAddPassword(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                  <FormControlLabel control={<Checkbox checked={adminAddIsAdmin} onChange={e => setAdminAddIsAdmin(e.target.checked)} />} label="Admin mi?" sx={{ mb: 2 }} />
                  <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontWeight: 800, py: 1.4, fontSize: 20, letterSpacing: 1, boxShadow: 3, borderRadius: 3, ':hover': { background: '#e65100', transform: 'scale(1.04)' } }} startIcon={<PersonAddAlt1Icon />}>Kullanıcı Ekle</Button>
                  {adminError && <Alert severity="error" sx={{ mt: 2 }}>{adminError}</Alert>}
                  {adminSuccess && <Alert severity="success" sx={{ mt: 2 }}>{adminSuccess}</Alert>}
                </Box>
                <Typography variant="h6" fontWeight={800} gutterBottom color="primary" sx={{ mb: 2 }}>Kullanıcılar (Salt Okunur)</Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 340, borderRadius: 3, boxShadow: 2 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow sx={{ background: '#ffe0b2' }}>
                        <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>Ad Soyad</TableCell>
                        <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>Kullanıcı Adı</TableCell>
                        <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>E-posta</TableCell>
                        <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>Admin</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(adminUsers) && adminUsers.length > 0 ? (
                        adminUsers.map((u, i) => (
                          <TableRow key={u.id} sx={{ background: i % 2 === 0 ? '#f5f5f5' : '#ffe0b2' }}>
                            <TableCell sx={{ fontWeight: 600 }}>{u.id}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{u.name}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{u.username}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{u.email}</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: u.admin ? '#ff9800' : '#757575' }}>{u.admin ? 'Evet' : 'Hayır'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">Kullanıcı yok veya liste alınamadı.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* Kullanıcı Silme Alanı */}
                <Box component="form" onSubmit={handleAdminDeleteUser} sx={{ mt: 4, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField label="Kullanıcı ID" value={adminDeleteId} onChange={e => setAdminDeleteId(e.target.value)} required type="number" sx={{ width: 160 }} />
                  <Button type="submit" variant="contained" color="secondary" sx={{ fontWeight: 700, borderRadius: 2, py: 1, px: 3 }} startIcon={<DeleteIcon />}>Kullanıcıyı Sil</Button>
                </Box>
                {adminDeleteError && <Alert severity="error" sx={{ mt: 1 }}>{adminDeleteError}</Alert>}
                {adminDeleteSuccess && <Alert severity="success" sx={{ mt: 1 }}>{adminDeleteSuccess}</Alert> 
                }
              </Paper>
            </Container>
          </Box>
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={backgroundStyle}>
            <Container maxWidth="sm">
              <AppBar position="static" color="primary" elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
                <Toolbar>
                  <Logo />
                  <LoginIcon sx={{ mr: 1, fontSize: 32 }} />
                  <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 1 }}>Ana Sayfa</Typography>
                  <UserAvatar />
                </Toolbar>
              </AppBar>
              <Paper elevation={6} sx={{ p: 5, borderRadius: 5, boxShadow: '0 8px 32px 0 rgba(255, 152, 0, 0.18)', mb: 4 }}>
                <Typography variant="h4" fontWeight={800} gutterBottom color="primary">Hoş geldin, {user.name}!</Typography>
                <Box sx={{ my: 3, p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700}>Profil Bilgilerin</Typography>
                  <Typography variant="body1">Ad Soyad: {user.name}</Typography>
                  <Typography variant="body1">Kullanıcı Adı: {user.username}</Typography>
                  <Typography variant="body1">E-posta: {user.email}</Typography>
                </Box>
                <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ fontWeight: 700, borderRadius: 2, mt: 2 }}>Çıkış Yap</Button>
                <Box sx={{ mt: 4, p: 2, background: '#fffde7', borderRadius: 2 }}>
                  <Typography variant="body2" color="secondary">Bu sayfada profil bilgilerinizi görebilir ve diğer kullanıcıları inceleyebilirsiniz.</Typography>
                </Box>
              </Paper>
              {/* Kullanıcı Listesi */}
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={800} gutterBottom color="primary">Tüm Kullanıcılar (Salt Okunur)</Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 340, borderRadius: 2, boxShadow: 1 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow sx={{ background: '#ffe0b2' }}>
                        <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>Ad Soyad</TableCell>
                        <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>Kullanıcı Adı</TableCell>
                        <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>E-posta</TableCell>
                        <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>Admin</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(adminUsers) && adminUsers.length > 0 ? (
                        adminUsers.map((u, i) => (
                          <TableRow key={u.id} sx={{ background: i % 2 === 0 ? '#f5f5f5' : '#ffe0b2' }}>
                            <TableCell sx={{ fontWeight: 600 }}>{u.id}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{u.name}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{u.username}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{u.email}</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: u.admin ? '#ff9800' : '#757575' }}>{u.admin ? 'Evet' : 'Hayır'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">Kullanıcı yok veya liste alınamadı.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Container>
          </Box>
        </ThemeProvider>
      );
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={backgroundStyle}>
        <Container maxWidth="sm">
          <AppBar position="static" color="primary" elevation={0} sx={{ borderRadius: 0, mb: 4, background: '#1A237E', boxShadow: 'none', minHeight: 64 }}>
            <Toolbar sx={{ minHeight: 64, px: 2 }}>
              <Logo />
              <LoginIcon sx={{ mr: 1, fontSize: 32 }} />
              <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 1 }}>{isLogin ? "Kullanıcı Girişi" : "Kayıt Ol"}</Typography>
              <UserAvatar />
            </Toolbar>
          </AppBar>
          <Paper elevation={0} sx={{ p: 5, borderRadius: 0, boxShadow: '0 2px 8px 0 rgba(26, 35, 126, 0.08)' }}>
            <Box component="form" onSubmit={isLogin ? handleLogin : handleRegister}>
              {!isLogin && (
                <>
                  <TextField label="Ad Soyad" value={name} onChange={e => setName(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                  <TextField label="E-posta" value={email} onChange={e => setEmail(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                </>
              )}
              <TextField label="Kullanıcı Adı" value={username} onChange={e => setUsername(e.target.value)} required fullWidth sx={{ mb: 2 }} />
              <TextField label="Şifre" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth sx={{ mb: 2 }} />
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontWeight: 800, py: 1.4, fontSize: 20, mb: 1, letterSpacing: 1, boxShadow: 3, borderRadius: 3, ':hover': { background: '#e65100', transform: 'scale(1.04)' } }} startIcon={isLogin ? <LoginIcon /> : <PersonAddAlt1Icon />}>
                {isLogin ? "Giriş Yap" : "Kayıt Ol"}
              </Button>
              <Button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); }} fullWidth sx={{ color: "#ff9800", textTransform: "none", fontWeight: 700, fontSize: 16, mt: 1 }}>
                {isLogin ? "Hesabın yok mu? Kayıt ol" : "Zaten hesabın var mı? Giriş yap"}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 