import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup(){
    const [searchParams] = useSearchParams();
    const {signup} = useAuth();
    const navigate = useNavigate();

    const [role, setRole] = useState(searchParams.get("role") === "employer" ? "employer" : "maid");
    const [form, setForm] = useState({name: "", email: "", password: "", phone: ""});
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const user = await signup({...form, role});
            //branch point
            navigate(user.role === "maid" ? "/create-profile" : "browse");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed, Please try again.");
        }finally{
            setSubmitting(false);
        }
    };

    return(
        <div className="container" style={{ maxWidth: 460, padding: "48px 20px"}}>
            <h1 style={{textAlign: "center"}}>Create Your Account</h1>

            <div
            role = "radiogroup"
            aria-label="i am a..."
            style={{display: "flex", gap: 10, marginBottom: 28}}
            >
                {[
                    { value: "maid", label: "House manager"},
                    { value: "employer", label: "Employer"},
                ].map((opt) =>(
                    <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={role === opt.value}
                    onClick={() => setRole(opt.value)}
                    className="btn"
                    style={{
                        flex: 1,
                        background: role=== opt.value ? "var(--color-primary)" : "var(--color-surface)",
                        color: role === opt.value ? "white" : "var(--color-ink)",
                        border: "1px solid var(--color-border)",
                    }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="card" style={{padding: 24}}>
                <div className="field">
                    <label htmlFor="name">Full Name</label>
                    <input id= "name" name= "name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input id= "email" name= "email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="field">
                    <label htmlFor="phone">Phone Number</label>
                    <input id= "phone" name= "phone" value={form.phone} onChange={handleChange} placeholder="07** *** ***" required />
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" minLength={6} value={form.password} onChange={handleChange} required />
                </div>

                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
                    {submitting ? "Creating account…" : `Sign up as ${role === "maid" ? "house manager" : "employer"}`}
                </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 18 }}>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}
