import { Link } from "react-router-dom";

const SKILL_LABELS = {
    cooking: "Cooking",
    childcare: "Childcare",
    laundry: "Laundry",
    general_cleaning: "General cleaning",
    elderly_care: "Elderly care",
    deep_cleaning: "Deep cleaning",
};

export default function MaidCard ({ profile }){
    const { _id, user, county, town, skills = [], experienceYears, availability, expectedPayMin, expectedPayMax } = profile;

    return(
        <Link
        to={`/profiles/${_id}`}
        className="card"
        style={{ display: "block", padding: 18, color: "inherit" }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start"}}>
                <h3 style={{margin: 0, fontSize: "1.15rem"}}>{user?.name || "profile"}</h3>
                <span className="badge">{experienceYears} yr{experienceYears === 1 ? "" : "s"} exp.</span>
            </div>

            <p style={{ color: "var(--color-ink-soft)", margin: "6px 0 12px", fontSize: "0.92rem" }}>
                {town ? `${town}, ` : ""}
                {county}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {skills.slice(0, 3).map((s) => (
                    <span key={s} className="badge" style={{ background: "var(--color-bg)" }}>
                        {SKILL_LABELS[s] || s}
                    </span>
                ))}
                {skills.length > 3 && <span className="badge">+{skills.length - 3} more</span>}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "var(--color-ink-soft)" }}>
                <span>{availability === "live_in" ? "Live-in" : availability === "live_out" ? "Live-out" : "Live-in or out"}</span>
                {(expectedPayMin || expectedPayMax) && (
                    <span>KES {expectedPayMin?.toLocaleString()}–{expectedPayMax?.toLocaleString()}</span>
                )}
            </div>
        </Link>
    );
}