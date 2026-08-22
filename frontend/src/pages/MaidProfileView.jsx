import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const SKILL_LABELS = {
    cooking: "Cooking",
    childcare: "Childcare",
    laundry: "Laundry",
    general_cleaning: "General cleaning",
    elderly_care: "Elderly care",
    deep_cleaning: "Deep cleaning",
};

export default function MaidProfileView(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        api
          .get(`/profiles/${id}`)
          .then((res) => setProfile(res.data.profile))
          .catch(() => setError("Profile not found."))
          .finally(() => setLoading(false));
    }, [id]);

    const handleMessage = async () => {
        setStarting(true);
        try {
          const res = await api.post("/conversations", { recipientId: profile.user._id });
          navigate(`/chat?conversation=${res.data.conversation._id}`);
        } catch (err) {
          setError("Could not start a conversation — try again.");
        } finally {
          setStarting(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: 60, display: "flex", justifyContent: "center" }}>
                <div className="spinner" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="container" style={{ padding: 60, textAlign: "center" }}>
                <p className="error-text">{error || "Profile not found."}</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: 640, padding: "40px 20px" }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                <div>
                    <h1 style={{ marginBottom: 4 }}>{profile.user?.name}</h1>
                    <p style={{ color: "var(--color-ink-soft)", margin: 0 }}>
                        {profile.town ? `${profile.town}, ` : ""}
                        {profile.county} · {profile.nationality}
                    </p>
                </div>
                <span className="badge">{profile.experienceYears} yr{profile.experienceYears === 1 ? "" : "s"} exp.</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "16px 0" }}>
                {profile.skills?.map((s) => (
                <span key={s} className="badge">{SKILL_LABELS[s] || s}</span>
                ))}
            </div>

            <div style={{ display: "flex", gap: 24, margin: "16px 0", fontSize: "0.92rem", color: "var(--color-ink-soft)" }}>
              <span>
                <strong style={{ color: "var(--color-ink)" }}>Availability:</strong>{" "}
                {profile.availability === "live_in" ? "Live-in" : profile.availability === "live_out" ? "Live-out" : "Live-in or out"}
              </span>
               {(profile.expectedPayMin || profile.expectedPayMax) && (
                <span>
                    <strong style={{ color: "var(--color-ink)" }}>Expected pay:</strong>{" "}
                    KES {profile.expectedPayMin?.toLocaleString()}–{profile.expectedPayMax?.toLocaleString()}/mo
                </span>
              )}
            </div>

            {profile.bio && (
                <div style={{ marginTop: 16 }}>
                    <h3 style={{ fontSize: "1rem" }}>About</h3>
                    <p style={{ color: "var(--color-ink-soft)" }}>{profile.bio}</p>
                </div>
            )}

            <button className="btn btn-primary" style={{ marginTop: 12, width: "100%" }} onClick={handleMessage} disabled={starting}>
                {starting ? "Starting conversation…" : "Message"}
            </button>
          </div>
        </div>
  );
}