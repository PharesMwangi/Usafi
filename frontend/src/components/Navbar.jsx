import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate ("/");
    };

    const homeLink = !user ? '/' : user.role === "maid" ? "/create-profile" : "/browse";

    return(
        <header>
            <div
            className="container"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 20px",
            }}
            >
                <Link
                to={homeLink}
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--color-primary-dark)",
                }}
                >
                    Usafi
                </Link>

                <nav style={{display: "flex", alignItems: "center", gap: 18}}>
                    {user?.role === "employer" && (
                        <>
                            <Link to="/browse">Browse</Link>
                            <Link to="/chat">Messages</Link>
                        </>
                    )}
                    {user?.role === "maid" && (
                        <>
                            <Link to="/create-profile">My profile</Link>
                            <Link to="/chat">Messages</Link>
                        </>
                    )}
                    {user ? (
                        <button className="btn btn-ghost" onClick={handleLogout}>
                            Log-out
                        </button>
                    ) : (
                        <>
                            <Link to="/login">Log in</Link>
                            <Link to="/signup" className="btn btn-accent">
                                Sign-up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
            <div className="weave-divider" />
        </header>
    );
}