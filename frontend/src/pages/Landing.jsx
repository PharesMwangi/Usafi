import {Link}  from "react-router-dom";

export default function Landing(){
    return(
        <div className="container" style={{padding: "72px 20px", textAlign: "center"}}>
            <h1>Find trusted house manager. Or find your next job.</h1>
            <p style={{fontSize: "1.15rem", color: "var(--color-ink-soft", maxWidth: 560, margin: "0 auto 36px"}}>
                Usafi connects house managers with employers across kenya - build profiles,
                browse candidates and message directly. No middlemen.
            </p>

            <div style={{ display: "flex", gap:16, justifyContent: "center", flexWrap: "wrap"}}>
                <Link to="/signup?role=maid" className="btn btn-primary" style={{ padding: "14px 28px"}}>
                I'm Looking for work.
                </Link>
                <Link to="/signup?role=employer" className="btn btn-primary" style={{ padding: "14px 28px"}}>
                I'm hiring
                </Link>
            </div>
            
            <p style={{ marginTop:28, fontSize: "0.9rem"}}>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}