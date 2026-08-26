import { useState, useEffect } from "react";
import api from "../api/axios";

const SKILL_OPTIONS = [
    { value: "cooking", label: "Cooking" },
    { value: "childcare", label: "Childcare" },
    { value: "laundry", label: "Laundry" },
    { value: "general_cleaning", label: "General cleaning" },
    { value: "elderly_care", label: "Elderly care" },
    { value: "deep_cleaning", label: "Deep cleaning" },
];

const emptyForm ={
    county: "",
    town: "",
    skills:[],
    experienceYears: 0,
    bio: "",
    availability: "either",
    expectedPayMin: "",
    expectedPayMax: "",
};

export default function CreateProfile(){
    const [form, setForm] = useState(emptyForm);
    const [hasProfile, setHasProfile] = useState(false);
    const [ loading, setLoading] = useState(true);
    const [ saving, setSaving] = useState(false);
    const [ message, setMessage] = useState("");
    const [ error, setError] = useState("");

    useEffect(() =>{
        api
        .get("/profiles/me")
        .then((res) =>{
            const p = res.data.profile;
            setForm({
                county: p.county || "",
                town: p.town || "",
                skills: p.skills || [],
                experienceYears: p.experienceYears || 0,
                bio: p.bio || "",
                availability: p.availability || "either",
                expectedPayMin: p.expectedPayMin || "",
                expectedPayMax: p.expectedPayMax || "",
            })
            setHasProfile(true);
        })
        .catch(() => setHasProfile(false))
        .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setForm((f) => ({...f, [name]: value}));
    };

    const toogleSkill = (value) =>{
        setForm((f) =>({
            ...f,
            skills: f.skills.includes(value) ? f.skills.filter((s) => s !== value) : [...f.skills, value],
        }));
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError("");
        setMessage("");
        setSaving(true);

        const payload = {
            ...form,
            experienceYears: Number(form.experienceYears) || 0,
            expectedPayMin: Number(form.expectedPayMin) || 0,
            expectedPayMax: Number(form.expectedPayMax) || 0,
        };

        try {
            if(hasProfile){
                await api.put("/profiles/me", payload);
                setMessage("Profile updated");
            }else{
                await api.post("/profiles", payload);
                setHasProfile(true);
                setMessage("Profile creaed. Employers can now find you");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Could not save profile.");
        }finally{
            setSaving(false);
        }
    };

    if (loading){
        return(
            <div className="container" style={{ padding: 60, display: "flex", justifyContent: "center" }}>
                <div className="spinner" />
            </div>
        );
    }

    return(
        <div className="container" style={{ maxWidth:640, padding: "40px 20px"}}>
            <h1>{hasProfile ? "Your Profile" : "Build your profile" }</h1>
            <p style={{color: "var(--color-ink-soft)"}}>
                {hasProfile
                ? "Keep this upto date. "
                : "This is what employers see when they browse. Please be specific on your skills."
            }
            </p>

            <form onSubmit={handleSubmit} className="card" style={{padding:24, marginTop: 20}}>
                <div style={{display: "flex", gap: 16}}>
                    <div className="field" style={{flex: 1}}>
                        <label htmlFor="county">County</label>
                        <input id="county" name="county" value={form.county} onChange={handleChange} placeholder="e.g Nairobi" required />
                    </div>
                    <div className="field" style={{ flex: 1 }}>
                        <label htmlFor="town">Town / area</label>
                        <input id="town" name="town" value={form.town} onChange={handleChange} placeholder="e.g. Kasarani" />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="">Skills</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8}}>
                        {SKILL_OPTIONS.map((s) => (
                        <button
                            type="button"
                            key={s.value}
                            onClick={() => toogleSkill(s.value)}
                            className="badge"
                            style={{
                            cursor: "pointer",
                            background: form.skills.includes(s.value) ? "var(--color-primary)" : "var(--color-bg)",
                            color: form.skills.includes(s.value) ? "white" : "var(--color-ink-soft)",
                            border: "1px solid var(--color-border)",
                            padding: "6px 14px",
                            }}
                        >
                            {s.label}
                        </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: "flex", gap: 16 }}>
                    <div className="field" style={{ flex: 1 }}>
                        <label htmlFor="experienceYears">Years of experience</label>
                        <input id="experienceYears" name="experienceYears" type="number" min="0" value={form.experienceYears} onChange={handleChange} />
                    </div>
                    <div className="field" style={{ flex: 1 }}>
                        <label htmlFor="availability">Availability</label>
                        <select id="availability" name="availability" value={form.availability} onChange={handleChange}>
                        <option value="either">Live-in or live-out</option>
                        <option value="live_in">Live-in only</option>
                        <option value="live_out">Live-out only</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 16 }}>
                    <div className="field" style={{ flex: 1 }}>
                        <label htmlFor="expectedPayMin">Expected pay — min (KES/mo)</label>
                        <input id="expectedPayMin" name="expectedPayMin" type="number" min="0" value={form.expectedPayMin} onChange={handleChange} />
                    </div>
                    <div className="field" style={{ flex: 1 }}>
                        <label htmlFor="expectedPayMax">Expected pay — max (KES/mo)</label>
                        <input id="expectedPayMax" name="expectedPayMax" type="number" min="0" value={form.expectedPayMax} onChange={handleChange} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="bio">About you</label>
                    <textarea id="bio" name="bio" rows={4} maxLength={1000} value={form.bio} onChange={handleChange} placeholder="Tell employers about your experience, what you're good at, and what you're looking for." />
                    </div>

                    {error && <p className="error-text">{error}</p>}
                    {message && <p style={{ color: "var(--color-primary)", fontWeight: 600 }}>{message}</p>}

                    <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving…" : hasProfile ? "Save changes" : "Publish profile"}
                    </button>

            </form>
        </div>
    );
}