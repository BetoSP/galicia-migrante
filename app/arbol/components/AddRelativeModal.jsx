import { useState, useMemo } from "react";
import { computeFullSurnames } from "@/app/arbol/lib/utils/personUtils.js";
import { useTranslation } from "@/components/LanguageContext";

const DATE_PRECISION = ["exactly", "before", "after", "about"];

const SPOUSE_TYPES = [
    { value: "married", labelKey: "tree.modal.spouse_types.married" },
    { value: "partner", labelKey: "tree.modal.spouse_types.partner" },
    { value: "co_parent", labelKey: "tree.modal.spouse_types.co_parent" },
    { value: "separated", labelKey: "tree.modal.spouse_types.separated" },
    { value: "divorced", labelKey: "tree.modal.spouse_types.divorced" },
    { value: "widowed", labelKey: "tree.modal.spouse_types.widowed" },
    { value: "unknown", labelKey: "tree.modal.spouse_types.unknown" },
];

function DateFields({ label, precision, onPrecision, day, onDay, month, onMonth, year, onYear }) {
    const { t } = useTranslation();
    const monthNames = t("tree.modal.date_fields.months");
    const safeMonthNames = Array.isArray(monthNames) ? monthNames : ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    return (
        <div className="modal-field-row" style={{ flexDirection: "column", gap: 6 }}>
            <label className="modal-label">{label}</label>
            <div className="modal-field-row">
                <div className="modal-field modal-field--sm">
                    <select className="form-select" value={precision} onChange={(e) => onPrecision(e.target.value)}>
                        {DATE_PRECISION.map((p) => (
                            <option key={p} value={p}>
                                {t(`tree.modal.date_precision.${p}`)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="modal-field modal-field--sm">
                    <input className="form-input" type="number" min="1" max="31" placeholder={t("tree.modal.date_fields.day")} value={day} onChange={(e) => onDay(e.target.value)} />
                </div>
                <div className="modal-field modal-field--sm">
                    <select className="form-select" value={month} onChange={(e) => onMonth(e.target.value)}>
                        <option value="">{t("tree.modal.date_fields.month")}</option>
                        {safeMonthNames.map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                        ))}
                    </select>
                </div>
                <div className="modal-field modal-field--sm">
                    <input className="form-input" type="number" min="1000" max="2100" placeholder={t("tree.modal.date_fields.year")} value={year} onChange={(e) => onYear(e.target.value)} />
                </div>
            </div>
        </div>
    );
}

function NewParentForm({ gender, onGenderChange, onData }) {
    const { t } = useTranslation();
    const [nombre, setNombre] = useState("");
    const [surname1, setSurname1] = useState("");
    const [surname2, setSurname2] = useState("");

    function handleChange(field, value) {
        const data = {
            nombre: field === "nombre" ? value : nombre,
            surname1: field === "surname1" ? value : surname1,
            surname2: field === "surname2" ? value : surname2,
            gender,
        };
        onData(data);
        if (field === "nombre") setNombre(value);
        if (field === "surname1") setSurname1(value);
        if (field === "surname2") setSurname2(value);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8, padding: "12px", background: "var(--color-bg-soft)", borderRadius: 8 }}>
            <div className="modal-field-row">
                {[
                    { value: "male", labelKey: "tree.modal.gender.male" },
                    { value: "female", labelKey: "tree.modal.gender.female" },
                    { value: "unknown", labelKey: "tree.modal.gender.unknown" },
                ].map((opt) => (
                    <label key={opt.value} className="modal-radio-label">
                        <input type="radio" name="newParentGender" value={opt.value} checked={gender === opt.value} onChange={() => onGenderChange(opt.value)} />
                        {t(opt.labelKey)}
                    </label>
                ))}
            </div>
            <div className="modal-field-row">
                <div className="modal-field">
                    <label className="modal-label">{t("tree.modal.fields.first_name")}</label>
                    <input className="form-input" type="text" value={nombre} placeholder={t("tree.modal.fields.first_name")} onChange={(e) => handleChange("nombre", e.target.value)} />
                </div>
            </div>
            <div className="modal-field-row">
                <div className="modal-field">
                    <label className="modal-label">{t("tree.modal.fields.first_surname")}</label>
                    <input className="form-input" type="text" value={surname1} placeholder={t("tree.modal.fields.first_surname")} onChange={(e) => handleChange("surname1", e.target.value)} />
                </div>
                <div className="modal-field">
                    <label className="modal-label">{t("tree.modal.fields.second_surname")}</label>
                    <input className="form-input" type="text" value={surname2} placeholder={t("tree.modal.fields.second_surname")} onChange={(e) => handleChange("surname2", e.target.value)} />
                </div>
            </div>
        </div>
    );
}

function PersonSearcher({ candidates, defaultPerson, label, onSelect }) {
    const { t } = useTranslation();
    const defaultText = defaultPerson
        ? `${defaultPerson.name} ${defaultPerson.surnames ?? ""}`.trim()
        : "";

    const [query, setQuery] = useState(defaultText);
    const [selected, setSelected] = useState(defaultPerson ?? null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filterYear, setFilterYear] = useState("");
    const [filterPlace, setFilterPlace] = useState("");

    const filtered = useMemo(() => {
        if (!query && !filterYear && !filterPlace) return [];
        return candidates.filter((p) => {
            const fullName = `${p.name} ${p.surnames ?? ""}`.toLowerCase();
            const matchName = !query || fullName.includes(query.toLowerCase());
            const matchYear = !filterYear || String(p.birth_year ?? "") === filterYear;
            const matchPlace = !filterPlace || (p.birth_place ?? "").toLowerCase().includes(filterPlace.toLowerCase());
            return matchName && matchYear && matchPlace;
        }).slice(0, 10);
    }, [query, filterYear, filterPlace, candidates]);

    function handleSelect(person) {
        setSelected(person);
        setQuery(`${person.name} ${person.surnames ?? ""}`.trim());
        onSelect(person);
    }

    function handleQueryChange(value) {
        setQuery(value);
        if (selected && `${selected.name} ${selected.surnames ?? ""}`.trim() !== value) {
            setSelected(null);
            onSelect(null);
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label className="modal-label">{label}</label>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                    className="form-input"
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder={t("tree.modal.searcher.placeholder")}
                />
                <button
                    type="button"
                    onClick={() => setShowAdvanced((v) => !v)}
                    style={{
                        flexShrink: 0, width: 34, height: 34,
                        border: "1px solid var(--color-border-medium)",
                        borderRadius: "var(--radius-sm)",
                        background: showAdvanced ? "var(--color-primary-light)" : "white",
                        cursor: "pointer", fontSize: 16,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    title={t("tree.modal.searcher.advanced_tooltip")}
                >
                    🔍
                </button>
            </div>

            {showAdvanced && (
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <div className="modal-field modal-field--sm">
                        <label className="modal-label">{t("tree.modal.searcher.birth_year")}</label>
                        <input className="form-input" type="number" min="1000" max="2100" placeholder={t("tree.modal.date_fields.year")} value={filterYear} onChange={(e) => setFilterYear(e.target.value)} />
                    </div>
                    <div className="modal-field">
                        <label className="modal-label">{t("tree.modal.searcher.birth_place")}</label>
                        <input className="form-input" type="text" placeholder={t("tree.modal.fields.city_country_placeholder")} value={filterPlace} onChange={(e) => setFilterPlace(e.target.value)} />
                    </div>
                </div>
            )}

            {filtered.length > 0 && !selected && (
                <div style={{ border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-md)", background: "white", maxHeight: 180, overflowY: "auto" }}>
                    {filtered.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => handleSelect(p)}
                            style={{ padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid var(--color-border-row)", fontSize: "var(--font-size-md)" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-bg-hover)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                        >
                            <strong>{p.name} {p.surnames ?? ""}</strong>
                            {p.birth_year && <span style={{ color: "var(--color-text-muted)", marginLeft: 8 }}>{t("tree.modal.searcher.born_abbr")} {p.birth_year}</span>}
                            {p.birth_place && <span style={{ color: "var(--color-text-muted)", marginLeft: 8 }}>{p.birth_place}</span>}
                        </div>
                    ))}
                </div>
            )}

            {selected && (
                <div style={{ padding: "6px 10px", background: "var(--color-primary-light)", borderRadius: "var(--radius-sm)", fontSize: "var(--font-size-md)", color: "var(--color-primary-dark)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>✓ {selected.name} {selected.surnames ?? ""}</span>
                    <button onClick={() => { setSelected(null); setQuery(""); onSelect(null); }} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: 14 }}>✕</button>
                </div>
            )}
        </div>
    );
}

export default function AddRelativeModal({
    slotType,
    fromPerson,
    otherParentOptions = [],
    parentCandidates = [],
    spouseCandidates = [],
    defaultParent = null,
    suggestedSurname1,
    suggestedSurname2,
    onSave,
    onClose,
}) {
    const { t } = useTranslation();
    const isSpouse = slotType === "spouse" || slotType === "spouse_another";
    const isChild = slotType === "son" || slotType === "daughter";
    const isParent = slotType === "father" || slotType === "mother";

    const [saving, setSaving] = useState(false);

    const initialGender =
        slotType === "father" ? "male" :
            slotType === "mother" ? "female" :
                slotType === "son" ? "male" :
                    slotType === "daughter" ? "female" :
                        slotType === "brother" ? "male" :
                            slotType === "sister" ? "female" : "male";

    const [gender, setGender] = useState(initialGender);
    const [prefix, setPrefix] = useState("");
    const [nombre, setNombre] = useState("");
    const [nombre2, setNombre2] = useState("");
    const [suffix, setSuffix] = useState("");
    const [surname1, setSurname1] = useState(suggestedSurname1 ?? "");
    const [surname2, setSurname2] = useState(suggestedSurname2 ?? "");
    const [surnameMarried, setSurnameMarried] = useState("");

    const [birthPrec, setBirthPrec] = useState("exactly");
    const [birthDay, setBirthDay] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [birthPlace, setBirthPlace] = useState("");

    const [isAlive, setIsAlive] = useState(true);
    const [deathPrec, setDeathPrec] = useState("exactly");
    const [deathDay, setDeathDay] = useState("");
    const [deathMonth, setDeathMonth] = useState("");
    const [deathYear, setDeathYear] = useState("");
    const [deathPlace, setDeathPlace] = useState("");
    const [deathCause, setDeathCause] = useState("");
    const [burialPlace, setBurialPlace] = useState("");

    const [spouseType, setSpouseType] = useState("married");
    const [marriagePrec, setMarriagePrec] = useState("exactly");
    const [marriageDay, setMarriageDay] = useState("");
    const [marriageMonth, setMarriageMonth] = useState("");
    const [marriageYear, setMarriageYear] = useState("");
    const [marriagePlace, setMarriagePlace] = useState("");

    const defaultOtherParent = otherParentOptions.find((p) => p.isActive) ?? otherParentOptions[0] ?? null;
    const [otherParentChoice, setOtherParentChoice] = useState(
        defaultOtherParent ? String(defaultOtherParent.id) : "none"
    );
    const [newParentGender, setNewParentGender] = useState("male");
    const [newParentData, setNewParentData] = useState(null);

    const [selectedExistingParent, setSelectedExistingParent] = useState(defaultParent ?? null);
    const [showNewForm, setShowNewForm] = useState(false);

    const [selectedExistingSpouse, setSelectedExistingSpouse] = useState(null);
    const [showNewSpouseForm, setShowNewSpouseForm] = useState(false);

    function getTitle() {
        const name = fromPerson?.name ?? "";
        const surn = fromPerson?.surnames ?? "";
        const full = [name, surn].filter(Boolean).join(" ");
        switch (slotType) {
            case "father": return t("tree.modal.titles.add_father").replace("{name}", full);
            case "mother": return t("tree.modal.titles.add_mother").replace("{name}", full);
            case "spouse": return t("tree.modal.titles.add_spouse_" + gender).replace("{name}", full);
            case "spouse_another": return t("tree.modal.titles.add_spouse_another").replace("{name}", full);
            case "son": return t("tree.modal.titles.add_son").replace("{name}", full);
            case "daughter": return t("tree.modal.titles.add_daughter").replace("{name}", full);
            case "brother": return t("tree.modal.titles.add_brother").replace("{name}", full);
            case "sister": return t("tree.modal.titles.add_sister").replace("{name}", full);
            default: return t("tree.modal.titles.add_relative");
        }
    }

    function handleSave() {
        if (saving) return;

        if (isParent && selectedExistingParent && !showNewForm) {
            setSaving(true);
            onSave({ existingPersonId: selectedExistingParent.id });
            return;
        }
        if (isParent && showNewForm && !nombre.trim()) return;

        if (isSpouse && selectedExistingSpouse && !showNewSpouseForm) {
            setSaving(true);
            onSave({
                existingPersonId: selectedExistingSpouse.id,
                relationship: {
                    type: spouseType,
                    marriage_day: marriageDay ? Number(marriageDay) : null,
                    marriage_month: marriageMonth ? Number(marriageMonth) : null,
                    marriage_year: marriageYear ? Number(marriageYear) : null,
                    marriage_place: marriagePlace.trim() || null,
                },
            });
            return;
        }

        if (!isParent && !nombre.trim()) return;

        setSaving(true);

        const s1 = surname1.trim() || null;
        const s2 = surname2.trim() || null;
        const sm = surnameMarried.trim() || null;

        const person = {
            name: nombre.trim(),
            name_2: nombre2.trim() || null,
            surname_1: s1,
            surname_2: s2,
            surname_married: sm,
            surnames: computeFullSurnames(s1, s2, sm, gender),
            prefix: prefix.trim() || null,
            suffix: suffix.trim() || null,
            gender,
            adopted: false,
            is_alive: isAlive,
            birth_day: birthDay ? Number(birthDay) : null,
            birth_month: birthMonth ? Number(birthMonth) : null,
            birth_year: birthYear ? Number(birthYear) : null,
            birth_place: birthPlace.trim() || null,
            death_day: !isAlive && deathDay ? Number(deathDay) : null,
            death_month: !isAlive && deathMonth ? Number(deathMonth) : null,
            death_year: !isAlive && deathYear ? Number(deathYear) : null,
            death_place: !isAlive ? (deathPlace.trim() || null) : null,
            death_cause: !isAlive ? (deathCause.trim() || null) : null,
            burial_place: !isAlive ? (burialPlace.trim() || null) : null,
        };

        let relationship;
        if (isSpouse) {
            relationship = {
                type: spouseType,
                marriage_day: marriageDay ? Number(marriageDay) : null,
                marriage_month: marriageMonth ? Number(marriageMonth) : null,
                marriage_year: marriageYear ? Number(marriageYear) : null,
                marriage_place: marriagePlace.trim() || null,
            };
        } else if (isChild) {
            if (otherParentChoice === "new" && newParentData?.nombre?.trim()) {
                const np = newParentData;
                const ns1 = np.surname1?.trim() || null;
                const ns2 = np.surname2?.trim() || null;
                relationship = {
                    type: slotType,
                    otherParentNew: {
                        name: np.nombre.trim(),
                        surname_1: ns1,
                        surname_2: ns2,
                        surname_married: null,
                        surnames: computeFullSurnames(ns1, ns2, null, np.gender),
                        gender: np.gender,
                        adopted: false,
                        is_alive: true,
                    },
                };
            } else {
                relationship = {
                    type: slotType,
                    otherParentId: otherParentChoice !== "none" ? otherParentChoice : null,
                };
            }
        } else {
            relationship = { type: slotType };
        }

        onSave({ person, relationship });
    }

    const otherParentLabel = fromPerson?.gender === "male" ? t("tree.modal.relation_options.mother") : t("tree.modal.relation_options.father");
    const parentLabel = slotType === "father" ? t("tree.modal.relation_options.father") : t("tree.modal.relation_options.mother");

    const dateLabel = spouseType === "co_parent" ? t("tree.modal.fields.coexistence_date") : t("tree.modal.fields.marriage_date");
    const placeLabel = spouseType === "co_parent" ? t("tree.modal.fields.coexistence_place") : t("tree.modal.fields.marriage_place");

    const okDisabled = saving
        || (isParent && !selectedExistingParent && !showNewForm)
        || (isSpouse && !selectedExistingSpouse && !showNewSpouseForm);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header">
                    <h2 className="modal-title">{getTitle()}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {/* ── Buscador para padre/madre ── */}
                {isParent && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <PersonSearcher
                            candidates={parentCandidates}
                            defaultPerson={defaultParent}
                            label={t("tree.modal.actions.search_label").replace("{label}", parentLabel.toLowerCase())}
                            onSelect={setSelectedExistingParent}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 1, background: "var(--color-border-light)" }} />
                            <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>{t("tree.modal.actions.or")}</span>
                            <div style={{ flex: 1, height: 1, background: "var(--color-border-light)" }} />
                        </div>
                        <button
                            className={showNewForm ? "btn-secondary" : "btn-primary"}
                            onClick={() => { setShowNewForm((v) => !v); setSelectedExistingParent(null); }}
                            style={{ alignSelf: "flex-start" }}
                        >
                            {showNewForm ? t("tree.modal.actions.cancel_new") : t("tree.modal.actions.create_new").replace("{label}", parentLabel.toLowerCase())}
                        </button>
                    </div>
                )}

                {/* ── Buscador para cónyuge ── */}
                {isSpouse && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <PersonSearcher
                            candidates={spouseCandidates}
                            defaultPerson={null}
                            label={t("tree.modal.actions.search_label").replace("{label}", t("tree.modal.relation_options.spouse_label").toLowerCase())}
                            onSelect={setSelectedExistingSpouse}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 1, background: "var(--color-border-light)" }} />
                            <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>{t("tree.modal.actions.or")}</span>
                            <div style={{ flex: 1, height: 1, background: "var(--color-border-light)" }} />
                        </div>
                        <button
                            className={showNewSpouseForm ? "btn-secondary" : "btn-primary"}
                            onClick={() => { setShowNewSpouseForm((v) => !v); setSelectedExistingSpouse(null); }}
                            style={{ alignSelf: "flex-start" }}
                        >
                            {showNewSpouseForm ? t("tree.modal.actions.cancel_new") : t("tree.modal.actions.create_new").replace("{label}", t("tree.modal.relation_options.spouse_label").toLowerCase())}
                        </button>
                    </div>
                )}

                {/* ── Formulario de nueva persona ── */}
                {(!isParent && !isSpouse) || (isParent && showNewForm) || (isSpouse && showNewSpouseForm) ? (
                    <>
                        <div className="modal-field-row">
                            {[
                                { value: "male", labelKey: "tree.modal.gender.male" },
                                { value: "female", labelKey: "tree.modal.gender.female" },
                                { value: "unknown", labelKey: "tree.modal.gender.unknown" },
                            ].map((opt) => (
                                <label key={opt.value} className="modal-radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={opt.value}
                                        checked={gender === opt.value}
                                        onChange={() => setGender(opt.value)}
                                        disabled={slotType.includes("father") || slotType.includes("mother") || slotType === "son" || slotType === "daughter" || slotType === "brother" || slotType === "sister"}
                                    />
                                    {t(opt.labelKey)}
                                </label>
                            ))}
                        </div>

                        <div className="modal-field-row">
                            <div className="modal-field modal-field--sm">
                                <label className="modal-label">{t("tree.modal.fields.prefix")}</label>
                                <input className="form-input" type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder={t("tree.modal.fields.prefix_placeholder")} />
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">{t("tree.modal.fields.first_name_label")}</label>
                                <input className="form-input" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={t("tree.modal.fields.first_name_label")} autoFocus />
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">{t("tree.modal.fields.second_name_label")}</label>
                                <input className="form-input" type="text" value={nombre2} onChange={(e) => setNombre2(e.target.value)} placeholder={t("tree.modal.fields.second_name_placeholder")} />
                            </div>
                            <div className="modal-field modal-field--sm">
                                <label className="modal-label">{t("tree.modal.fields.suffix")}</label>
                                <input className="form-input" type="text" value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder={t("tree.modal.fields.suffix_placeholder")} />
                            </div>
                        </div>

                        <div className="modal-field-row">
                            <div className="modal-field">
                                <label className="modal-label">
                                    {isSpouse && gender === "female" ? t("tree.modal.fields.first_surname_maiden") : t("tree.modal.fields.first_surname")}
                                </label>
                                <input className="form-input" type="text" value={surname1} onChange={(e) => setSurname1(e.target.value)} placeholder={t("tree.modal.fields.first_surname")} />
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">
                                    {isSpouse && gender === "female" ? t("tree.modal.fields.second_surname_maiden") : t("tree.modal.fields.second_surname")}
                                </label>
                                <input className="form-input" type="text" value={surname2} onChange={(e) => setSurname2(e.target.value)} placeholder={t("tree.modal.fields.second_surname")} />
                            </div>
                        </div>
                        {isSpouse && gender === "female" && (
                            <div className="modal-field-row">
                                <div className="modal-field modal-field--full">
                                    <label className="modal-label">{t("tree.modal.fields.married_surname")}</label>
                                    <input className="form-input" type="text" value={surnameMarried} onChange={(e) => setSurnameMarried(e.target.value)} placeholder={t("tree.modal.fields.married_surname_placeholder")} />
                                </div>
                            </div>
                        )}

                        <DateFields
                            label={t("tree.modal.fields.birth_date")}
                            precision={birthPrec} onPrecision={setBirthPrec}
                            day={birthDay} onDay={setBirthDay}
                            month={birthMonth} onMonth={setBirthMonth}
                            year={birthYear} onYear={setBirthYear}
                        />

                        <div className="modal-field-row">
                            <div className="modal-field modal-field--full">
                                <label className="modal-label">{t("tree.modal.fields.birth_place")}</label>
                                <input className="form-input" type="text" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} placeholder={t("tree.modal.fields.city_country_placeholder")} />
                            </div>
                        </div>

                        <div className="modal-field-row">
                            <label className="modal-radio-label">
                                <input type="radio" name="isAlive" checked={isAlive} onChange={() => setIsAlive(true)} />
                                {t("tree.modal.fields.living")}
                            </label>
                            <label className="modal-radio-label">
                                <input type="radio" name="isAlive" checked={!isAlive} onChange={() => setIsAlive(false)} />
                                {t("tree.modal.fields.deceased")}
                            </label>
                        </div>

                        {!isAlive && (
                            <>
                                <DateFields
                                    label={t("tree.modal.fields.death_date")}
                                    precision={deathPrec} onPrecision={setDeathPrec}
                                    day={deathDay} onDay={setDeathDay}
                                    month={deathMonth} onMonth={setDeathMonth}
                                    year={deathYear} onYear={setDeathYear}
                                />
                                <div className="modal-field-row">
                                    <div className="modal-field modal-field--full">
                                        <label className="modal-label">{t("tree.modal.fields.death_place")}</label>
                                        <input className="form-input" type="text" value={deathPlace} onChange={(e) => setDeathPlace(e.target.value)} placeholder={t("tree.modal.fields.city_country_placeholder")} />
                                    </div>
                                </div>
                                <div className="modal-field-row">
                                    <div className="modal-field">
                                        <label className="modal-label">{t("tree.modal.fields.death_cause")}</label>
                                        <input className="form-input" type="text" value={deathCause} onChange={(e) => setDeathCause(e.target.value)} placeholder={t("tree.modal.fields.death_cause_placeholder")} />
                                    </div>
                                    <div className="modal-field">
                                        <label className="modal-label">{t("tree.modal.fields.burial_place")}</label>
                                        <input className="form-input" type="text" value={burialPlace} onChange={(e) => setBurialPlace(e.target.value)} placeholder={t("tree.modal.fields.cemetery_placeholder")} />
                                    </div>
                                </div>
                            </>
                        )}

                        {isChild && (
                            <div className="modal-field-row">
                                <div className="modal-field modal-field--full">
                                    <label className="modal-label">{otherParentLabel}</label>
                                    <select
                                        className="form-select"
                                        value={otherParentChoice}
                                        onChange={(e) => setOtherParentChoice(e.target.value)}
                                    >
                                        {otherParentOptions.map((p) => (
                                            <option key={p.id} value={String(p.id)}>
                                                {p.name} {p.surnames ?? ""}
                                                {p.isActive ? t("tree.modal.actions.partner_current") : t("tree.modal.actions.partner_former")}
                                            </option>
                                        ))}
                                        <option value="new">➕ {t("tree.modal.actions.create_new").replace("{label}", otherParentLabel.toLowerCase())}</option>
                                        <option value="none">{t("tree.modal.actions.no_partner_known").replace("{label}", otherParentLabel.toLowerCase())}</option>
                                    </select>
                                    {otherParentChoice === "new" && (
                                        <NewParentForm
                                            gender={newParentGender}
                                            onGenderChange={(g) => {
                                                setNewParentGender(g);
                                                setNewParentData((prev) => ({ ...prev, gender: g }));
                                            }}
                                            onData={setNewParentData}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                ) : null}

                {/* Tipo de relación y fechas — visible cuando hay persona seleccionada o formulario abierto */}
                {isSpouse && (selectedExistingSpouse || showNewSpouseForm) && (
                    <>
                        <div className="modal-field-row">
                            <div className="modal-field modal-field--full">
                                <label className="modal-label">{t("tree.modal.fields.relationship_type")}</label>
                                <select className="form-select" value={spouseType} onChange={(e) => setSpouseType(e.target.value)}>
                                    {SPOUSE_TYPES.map((tItem) => (
                                        <option key={tItem.value} value={tItem.value}>{t(tItem.labelKey)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {spouseType !== "co_parent" && (
                            <>
                                <DateFields
                                    label={dateLabel}
                                    precision={marriagePrec} onPrecision={setMarriagePrec}
                                    day={marriageDay} onDay={setMarriageDay}
                                    month={marriageMonth} onMonth={setMarriageMonth}
                                    year={marriageYear} onYear={setMarriageYear}
                                />
                                <div className="modal-field-row">
                                    <div className="modal-field modal-field--full">
                                        <label className="modal-label">{placeLabel}</label>
                                        <input className="form-input" type="text" value={marriagePlace} onChange={(e) => setMarriagePlace(e.target.value)} placeholder={t("tree.modal.fields.city_country_placeholder")} />
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                <div className="modal-actions">
                    <div className="modal-actions-right">
                        <button className="btn-secondary" onClick={onClose} disabled={saving}>{t("tree.modal.actions.cancel")}</button>
                        <button className="btn-primary" onClick={handleSave} disabled={okDisabled}>
                            {saving ? t("tree.modal.actions.saving") : t("tree.modal.actions.save")}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}