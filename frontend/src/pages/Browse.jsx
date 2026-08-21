import { useEffect, useState } from "react";
import api from "../api/axios";
import MaidCard from "../components/MaidCard";

const SKILL_OPTIONS = [
    {value: "", label: "all skills"},
    { value: "cooking", label: "Cooking" },
    { value: "childcare", label: "Childcare" },
    { value: "laundry", label: "Laundry" },
    { value: "general_cleaning", label: "General cleaning" },
    { value: "elderly_care", label: "Elderly care" },
    { value: "deep_cleaning", label: "Deep cleaning" },
];

export default function Browse(){
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ filters, setFilters] = useState({ county: "", skill: "", availability: ""});

    const fetchProfiles = async (activeFilters) =>{
        setLoading(true);
        setError("");
        try {
            const params = {};
            Object.entries(activeFilters).forEach(([KeyboardEvent, v]) =>{
                if (v) params [k] = v;
            });
            const res = await api.get("/profiles", {params});
            setProfiles(res.data.profiles);
        } catch (err) {
            setError("Could not load profiles...Refresh");
        } finally{
            setLoading(false);
        }
    };

    useEffect(() =>{
        fetchProfiles(filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilterChange = (e) =>{
        setFilters((f) =>({...f, [e.target.name]: e.target.value}));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        fetchProfiles(filters);
    };

    return(
        <div className="container" style={{ padding: "36px, 20px"}}>
            <h1>Browse House Managers</h1>

            <form 
            onSubmit={applyFilters}
            className="card"
            style={{padding: 18, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end", marginBottom: 28 }}
            >
                <div className="field" style={{marginBottom: 0, minWidth: 160}}>
                    <label htmlFor="county">County</label>
                    <input id="county" name="county" value={filters.county} onChange={handleFilterChange} placeholder="e.g Nairobi" />
                </div>
                <div className="field" style={{marginBottom: 0, minWidth: 180}}>
                    <label htmlFor="skill">Skill</label>
                    <select name="skill" id="skill" value={filters.skill} onChange={handleFilterChange}>
                        {SKILL_OPTIONS.map((s) =>(
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
                <div className="field" style={{marginBottom: 0, minWidth: 180}}>
                    <label htmlFor="availability">Availability</label>
                    <select name="availability" id="availablity" value={filters.availability} onChange={handleFilterChange}>
                        <option value="">Any</option>
                        <option value="Live_in">Live-in</option>
                        <option value="Live_out">Live-out</option>
                        <option value="either">Live-in or out</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Filter</button>
            </form>

            {loading && (
                <div style={{display: "flex", justifyContent: "center", padding: 40}}>
                    <div className="spinner" />
                </div>
            )}

            {error && <p className="error-text">{error}</p> }

            {!loading && !error && profiles.length === 0 &&(
                <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--color-ink-soft)"}}>
                    No profiles match those filters yet. Try broadening your search.
                </div>
            )}

            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16}}>
                {profiles.map((p) =>(
                    <MaidCard key={p._id} profile={p} />
                ))}
            </div>
        </div>
    );
}