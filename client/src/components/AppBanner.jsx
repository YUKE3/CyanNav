import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
} from "@mui/material";
import { Menu as MenuIcon, Home, Store } from "@mui/icons-material"; // Corrected the import for MenuIcon
import { useTheme } from "@mui/material/styles";
import logo from "../assets/cyannav_logo.svg";
import LoginLogo from "../assets/cyannav_logo_wo_name.png";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";

function AppBanner() {
    const location = useLocation();
    const { pathname } = location;
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    // Route to different pages
    const navigate = useNavigate();
    const theme = useTheme(); // Access the theme

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const [profilePicUrl, setProfilePicUrl] = useState(LoginLogo);

    useEffect(() => {
        // Convert buffer from auth.user.picture to a Blob
        if (auth.user && auth.user.picture) {
            const arrayBuffer = new Uint8Array(auth.user.picture.data).buffer;
            let blobType = "image/jpeg"; // Default to JPEG

            // Check if the buffer is a PNG by checking the first byte
            if (auth.user.picture.data[0] === 137) {
                blobType = "image/png";
            }

            const blob = new Blob([arrayBuffer], { type: blobType });
            const imageUrl = URL.createObjectURL(blob);
            setProfilePicUrl(imageUrl);

            // Clean up the object URL on unmount
            return () => {
                URL.revokeObjectURL(imageUrl);
            };
        }
    }, [auth.user]);

    // Handle menu opening and closing
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Handle navigating to different on clicking on buttons
    const handleIconClick = () => {
        store.toggleBrowsePage("home");
        navigate("/browsepage");
    };
    const handleAccountSettingClick = () => {
        navigate("/profile");
        setAnchorElUser(null);
    };
    const handleLogoutClick = async () => {
        await auth.logoutUser();
        navigate("/login");
        setAnchorElUser(null);
    };

    // Change the current display subpage
    const handleHome = () => {
        if (!auth.loggedIn) {
            // Redirect to the Marketplace page if not logged in
            store.toggleBrowsePage("store"); // Set the page to the marketplace
            navigate("/browsepage"); // Assuming "/browsepage" is the route for the Marketplace
        } else {
            // Continue with normal operation if logged in
            store.toggleBrowsePage("home"); // Set the page to My Maps
            navigate("/browsepage"); // Assuming "/browsepage" is also the route for My Maps
        }
    };

    const handleStore = () => {
        store.toggleBrowsePage("store"); //togglebrowseHome : false
        navigate("/browsepage");
        // Calls global store function
    };

    useEffect(() => {}, []);

    if (
        pathname === "/" ||
        pathname === "/login/" ||
        pathname === "/login" ||
        pathname === "/register/" ||
        pathname === "/register" ||
        pathname === "/forget/" ||
        pathname === "/forget"
    ) {
        return null;
    }

    return (
        <AppBar
            position="relative"
            sx={{
                backgroundColor: theme.palette.background.default,
                width: "100%",
                zIndex: 2,
            }}
        >
            <Container maxWidth="false">
                <Toolbar disableGutters>
                    {/* Hamburger Menu for smaller screens */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}>
                        <IconButton
                            size="large"
                            aria-label="open navigation menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                        >
                            <MenuItem onClick={handleHome}>
                                <IconButton
                                    disabled={!auth.loggedIn}
                                    id="myMapsBtn"
                                    sx={{
                                        color:
                                            store.togglebrowseHome === true &&
                                            pathname === "/browsepage"
                                                ? "black"
                                                : theme.palette.text.secondary,
                                        mr: 1,
                                    }}
                                >
                                    <Home />
                                </IconButton>
                                <Typography textAlign="center">
                                    My Maps
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleStore}>
                                <IconButton
                                    id="marketplaceBtn"
                                    sx={{
                                        color:
                                            store.togglebrowseHome !== true &&
                                            pathname === "/browsepage"
                                                ? "black"
                                                : theme.palette.text.secondary,
                                        mr: 1,
                                    }}
                                >
                                    <Store />
                                </IconButton>
                                <Typography textAlign="center">
                                    Marketplace
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>

                    {/* Logo */}
                    <Button
                        id="logoBtn"
                        onClick={() => {
                            handleIconClick();
                        }}
                        sx={{ mr: "16px" }}
                    >
                        <Box
                            component="img"
                            sx={{
                                width: "175px",
                                borderRadius: 1,
                                ml: "-16px",
                                mr: "-16px",
                            }}
                            src={logo}
                        />
                    </Button>

                    {/* Home and Store Buttons for larger screens */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                            mr: 2,
                        }}
                    >
                        <Tooltip title="My Maps">
                            <IconButton
                                disabled={!auth.loggedIn}
                                sx={{
                                    color:
                                        store.togglebrowseHome === true &&
                                        pathname === "/browsepage"
                                            ? "black"
                                            : theme.palette.text.secondary,
                                }}
                                onClick={handleHome}
                            >
                                <Home sx={{ fontSize: "30px" }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Marketplace">
                            <IconButton
                                id="marketplaceBtn"
                                sx={{
                                    color:
                                        store.togglebrowseHome !== true &&
                                        pathname === "/browsepage"
                                            ? "black"
                                            : theme.palette.text.secondary,
                                }}
                                onClick={handleStore}
                            >
                                <Store sx={{ fontSize: "30px" }} />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* Title and Author of map */}
                    {pathname.includes("/mapview/") && (
                        <Typography
                            variant="h6"
                            sx={{
                                flexGrow: 1,
                                maxWidth: { xs: 100, sm: 500 },
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: { xs: "none", sm: "block" },
                            }}
                        >
                            {store.currentMap !== null ? (
                                <span>
                                    <strong>Map Title:</strong>{" "}
                                    {store.currentMap.title}
                                </span>
                            ) : (
                                ""
                            )}
                        </Typography>
                    )}

                    {/* Spacer to push the user avatar to the right */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* User Avatar and Menu */}
                    {auth.loggedIn && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Tooltip title="Open Menu">
                                <IconButton
                                    id="settingsDropdown"
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        alt="User Avatar"
                                        src={profilePicUrl}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <Box
                                    sx={{
                                        maxWidth: 200,
                                        p: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        p: "15px",
                                    }}
                                >
                                    <Typography sx={{ fontWeight: "bold" }}>
                                        Username:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {auth.user != null
                                            ? auth.user.username
                                            : ""}
                                    </Typography>
                                </Box>
                                <MenuItem
                                    id="settingsDropdownOption"
                                    key={"Account Settings"}
                                    onClick={handleAccountSettingClick}
                                >
                                    <Typography textAlign="center">
                                        Account Settings
                                    </Typography>
                                </MenuItem>
                                <MenuItem
                                    id="logoutBtn"
                                    key={"Logout"}
                                    onClick={handleLogoutClick}
                                >
                                    <Typography textAlign="center">
                                        Logout
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}

                    {/* When the user continues as guest */}
                    {!auth.loggedIn && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/login")}
                                sx={{ mr: 1 }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/register")}
                            >
                                Register
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default AppBanner;
