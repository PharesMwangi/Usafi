import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login(){
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({email: "", password: ""});
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const user = await login(form);
            navigate(user.role === "maid" ? "/create-profile" : "/browse");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Check your details.");
        }finally{
            setSubmitting(false);
        }
    };

    return(
        <div className="container" style={{maxWidth: 420, padding: "48px 20px"}}>
            <h1 style={{ textAlign: "center"}}>Welcome Back</h1>

            <form onSubmit={handleSubmit} className="card" style={{padding: 24}}>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
                </div>

                {error && <p className="error-text">{error}</p> }

                <button type="submit" className="btn btn-primary" style={{width: "100%"}} disabled= {submitting}>
                    {submitting ? "logging in..." : "Log in"}
                </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 18}}>
                No Account Yet? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}