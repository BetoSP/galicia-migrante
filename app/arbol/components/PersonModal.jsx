import { useState, useEffect } from "react";
import { computeFullSurnames } from "@/app/arbol/lib/utils/personUtils.js";
import { fetchDistinctPlaces } from "@/app/arbol/lib/services/peopleService.js";
import { useTranslation } from "@/components/LanguageContext";

// ── Constantes ─────────────────────────────────────────────────────────────────
const DATE_PRECISION = ["exactly", "before", "after", "about", "unsure", "between"];
const PREFIX_MALE   = ["", "Sr.", "Don", "Dr.", "Ing.", "Prof.", "Rev."];
const PREFIX_FEMALE = ["", "Sra.", "Doña", "Dra.", "Ing.", "Prof.", "Rev."];
const SUFFIX_OPTIONS = ["", "I", "II", "III", "Junior", "Senior"];

const MIGRATION_CONDITIONS = [
  { value: "",                  labelKey: "tree.modal.migration_conditions.undefined" },
  { value: "galicia_born",      labelKey: "tree.modal.migration_conditions.galicia_born" },
  { value: "galicia_emigrated", labelKey: "tree.modal.migration_conditions.galicia_emigrated" },
  { value: "diaspora_born",     labelKey: "tree.modal.migration_conditions.diaspora_born" },
  { value: "returned",          labelKey: "tree.modal.migration_conditions.returned" },
  { value: "no_galician_roots", labelKey: "tree.modal.migration_conditions.no_galician_roots" },
];

// ── Sub-componentes ────────────────────────────────────────────────────────────
function PersonAvatar({ gender, size = 80 }) {
  const bg =
    gender === "female" ? "var(--node-gender-bar-female)" :
    gender === "male"   ? "var(--node-gender-bar-male)" : "var(--node-gender-bar-unknown)";
  return (
    <div className="pm-avatar" style={{ width: size, height: size, background: bg }}>
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="white">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    </div>
  );
}

function DaySelect({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <select className="pm-select pm-select--day" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{t("tree.modal.date_fields.day")}</option>
      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
        <option key={d} value={d}>{d}</option>
      ))}
    </select>
  );
}

function MonthSelect({ value, onChange }) {
  const { t } = useTranslation();
  const monthsTranslation = t("tree.modal.date_fields.months");
  const monthNames = Array.isArray(monthsTranslation) ? monthsTranslation : ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return (
    <select className="pm-select pm-select--month" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{t("tree.modal.date_fields.month")}</option>
      {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
    </select>
  );
}

function YearInput({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <input
      className="pm-input pm-input--year"
      type="number"
      min="1000"
      max="2100"
      placeholder={t("tree.modal.date_fields.year")}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function DateFields({
  label,
  precision, onPrecision,
  day, onDay, month, onMonth, year, onYear,
  day2, onDay2, month2, onMonth2, year2, onYear2,
}) {
  const { t } = useTranslation();
  const isBetween = precision === "between";
  return (
    <div className="pm-field-group">
      <label className="pm-label">{label}</label>
      <div className="pm-date-row">
        <select
          className="pm-select pm-select--precision"
          value={precision}
          onChange={e => onPrecision(e.target.value)}
        >
          {DATE_PRECISION.map(p => <option key={p} value={p}>{t(`tree.modal.date_precision.${p}`)}</option>)}
        </select>
        <DaySelect value={day} onChange={onDay} />
        <MonthSelect value={month} onChange={onMonth} />
        <YearInput value={year} onChange={onYear} />
      </div>
      {isBetween && (
        <div className="pm-date-row">
          <span className="pm-between-label">{t("tree.modal.date_fields.and")}</span>
          <DaySelect value={day2 ?? ""} onChange={onDay2 ?? (() => {})} />
          <MonthSelect value={month2 ?? ""} onChange={onMonth2 ?? (() => {})} />
          <YearInput value={year2 ?? ""} onChange={onYear2 ?? (() => {})} />
        </div>
      )}
    </div>
  );
}

function PlaceField({ label, value, onChange, suggestions, listId }) {
  const { t } = useTranslation();
  return (
    <div className="pm-field-group">
      <label className="pm-label">{label}</label>
      <input
        className="pm-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        list={listId}
        placeholder={t("tree.modal.fields.city_country_placeholder")}
        autoComplete="off"
      />
      <datalist id={listId}>
        {suggestions.map(s => <option key={s} value={s} />)}
      </datalist>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function PersonModal({
  person,
  people = [],
  relationships = [],
  onSave,
  onDelete,
  onAddRelationship,
  onClose,
  onNavigateToFullProfile,
}) {
  const { t } = useTranslation();
  const isEditing = person !== null && person !== undefined;

  // ── Estado — identidad ──────────────────────────────────────────────────────
  const [gender, setGender] = useState(isEditing ? (person.gender ?? "male") : "male");
  const [prefix, setPrefix] = useState(isEditing ? (person.prefix ?? "") : "");
  const [suffix, setSuffix] = useState(isEditing ? (person.suffix ?? "") : "");

  const [fullFirstName, setFullFirstName] = useState(
    isEditing ? [person.name ?? "", person.name_2 ?? ""].filter(Boolean).join(" ") : ""
  );
  const [fullSurname, setFullSurname] = useState(
    isEditing ? [person.surname_1 ?? "", person.surname_2 ?? ""].filter(Boolean).join(" ") : ""
  );

  // Campos preservados pero no expuestos en este modal
  const [surnameMarried] = useState(isEditing ? (person.surname_married ?? "") : "");
  const [adopted]        = useState(isEditing ? (person.adopted ?? false) : false);

  // ── Estado — nacimiento ─────────────────────────────────────────────────────
  const [birthPrec,   setBirthPrec]   = useState(isEditing ? (person.birth_precision ?? "exactly") : "exactly");
  const [birthDay,    setBirthDay]    = useState(isEditing ? (person.birth_day   ?? "") : "");
  const [birthMonth,  setBirthMonth]  = useState(isEditing ? (person.birth_month ?? "") : "");
  const [birthYear,   setBirthYear]   = useState(isEditing ? (person.birth_year  ?? "") : "");
  const [birthDay2,   setBirthDay2]   = useState("");
  const [birthMonth2, setBirthMonth2] = useState("");
  const [birthYear2,  setBirthYear2]  = useState("");
  const [birthPlace,  setBirthPlace]  = useState(isEditing ? (person.birth_place ?? "") : "");
  const [birthPlaceSuggestions, setBirthPlaceSuggestions] = useState([]);

  // ── Estado — vida/fallecimiento ─────────────────────────────────────────────
  const [isAlive,     setIsAlive]     = useState(isEditing ? (person.is_alive ?? true) : true);
  const [deathPrec,   setDeathPrec]   = useState(isEditing ? (person.death_precision ?? "exactly") : "exactly");
  const [deathDay,    setDeathDay]    = useState(isEditing ? (person.death_day   ?? "") : "");
  const [deathMonth,  setDeathMonth]  = useState(isEditing ? (person.death_month ?? "") : "");
  const [deathYear,   setDeathYear]   = useState(isEditing ? (person.death_year  ?? "") : "");
  const [deathDay2,   setDeathDay2]   = useState("");
  const [deathMonth2, setDeathMonth2] = useState("");
  const [deathYear2,  setDeathYear2]  = useState("");
  const [deathPlace,  setDeathPlace]  = useState(isEditing ? (person.death_place ?? "") : "");
  const [deathPlaceSuggestions, setDeathPlaceSuggestions] = useState([]);

  // Preservados, no expuestos
  const [deathCause]  = useState(isEditing ? (person.death_cause  ?? "") : "");
  const [burialPlace] = useState(isEditing ? (person.burial_place ?? "") : "");

  // ── Estado — condición migratoria ───────────────────────────────────────────
  const [migrationCondition, setMigrationCondition] = useState(
    isEditing ? (person.migration_condition ?? "") : ""
  );

  // ── Estado — UI ─────────────────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newFatherId,   setNewFatherId]   = useState("");
  const [newMotherId,   setNewMotherId]   = useState("");

  const hasFather = isEditing && relationships.some(
    r => r.type === "father" && String(r.person_b_id) === String(person.id)
  );
  const hasMother = isEditing && relationships.some(
    r => r.type === "mother" && String(r.person_b_id) === String(person.id)
  );
  const candidateFathers = people.filter(
    p => String(p.id) !== String(person?.id) && p.gender !== "female"
  );
  const candidateMothers = people.filter(
    p => String(p.id) !== String(person?.id) && p.gender !== "male"
  );

  // ── Cargar sugerencias de lugares ───────────────────────────────────────────
  useEffect(() => {
    fetchDistinctPlaces("birth_place").then(setBirthPlaceSuggestions).catch(() => {});
    fetchDistinctPlaces("death_place").then(setDeathPlaceSuggestions).catch(() => {});
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  async function handleSave() {
    const nameParts = fullFirstName.trim().split(/\s+/).filter(Boolean);
    const name  = nameParts[0] ?? "";
    const name2 = nameParts.slice(1).join(" ") || null;
    if (!name) return;

    const surnParts = fullSurname.trim().split(/\s+/).filter(Boolean);
    const s1 = surnParts[0] || null;
    const s2 = surnParts.slice(1).join(" ") || null;
    const sm = surnameMarried.trim() || null;

    onSave({
      ...(isEditing ? { id: person.id } : {}),
      name,
      name_2:          name2,
      surname_1:       s1,
      surname_2:       s2,
      surname_married: sm,
      surnames:        computeFullSurnames(s1, s2, sm, gender),
      prefix:          prefix.trim() || null,
      suffix:          suffix.trim() || null,
      gender,
      adopted,
      is_alive:    isAlive,
      birth_precision: birthPrec,
      birth_day:   birthDay   ? Number(birthDay)   : null,
      birth_month: birthMonth ? Number(birthMonth) : null,
      birth_year:  birthYear  ? Number(birthYear)  : null,
      birth_place: birthPlace.trim() || null,
      death_precision: !isAlive ? deathPrec : null,
      death_day:   !isAlive && deathDay   ? Number(deathDay)   : null,
      death_month: !isAlive && deathMonth ? Number(deathMonth) : null,
      death_year:  !isAlive && deathYear  ? Number(deathYear)  : null,
      death_place: !isAlive ? (deathPlace.trim()  || null) : null,
      death_cause:         !isAlive ? (deathCause.trim()  || null) : null,
      burial_place:        !isAlive ? (burialPlace.trim() || null) : null,
      migration_condition: migrationCondition || null,
    });
  }

  function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    onDelete(person.id);
  }

  function handleAddFather() {
    if (!newFatherId) return;
    onAddRelationship({ person_a_id: Number(newFatherId), person_b_id: Number(person.id), type: "father" });
    setNewFatherId("");
  }

  function handleAddMother() {
    if (!newMotherId) return;
    onAddRelationship({ person_a_id: Number(newMotherId), person_b_id: Number(person.id), type: "mother" });
    setNewMotherId("");
  }

  // ── Valores derivados para display ──────────────────────────────────────────
  const displayName = [fullFirstName.trim(), fullSurname.trim()].filter(Boolean).join(" ")
    || (isEditing ? "—" : t("tree.modal.titles.add_person"));
  const displayYear = birthYear ? String(birthYear) : "";
  const prefixOptions = gender === "female" ? PREFIX_FEMALE : PREFIX_MALE;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-card" onClick={e => e.stopPropagation()}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="pm-header">
          <h2 className="pm-title">
            {isEditing ? t("tree.modal.titles.edit_profile").replace("{name}", displayName) : t("tree.modal.titles.add_person")}
          </h2>
          <button className="pm-close" onClick={onClose}>✕</button>
        </div>

        {/* ── Body — dos columnas ──────────────────────────────────────────── */}
        <div className="pm-body">

          {/* Columna izquierda — avatar + nombre + año */}
          <div className="pm-left-col">
            <PersonAvatar gender={gender} size={80} />
            <span className="pm-person-name">{displayName}</span>
            {displayYear && <span className="pm-person-year">* {displayYear}</span>}
          </div>

          {/* Columna derecha — formulario */}
          <div className="pm-right-col">

            {/* 1 — Género */}
            <div className="pm-field-group">
              <label className="pm-label">{t("tree.modal.fields.gender")}</label>
              <div className="pm-radio-group">
                {[
                  { value: "male",    labelKey: "tree.modal.gender.male" },
                  { value: "female",  labelKey: "tree.modal.gender.female" },
                  { value: "unknown", labelKey: "tree.modal.gender.unknown" },
                ].map(opt => (
                  <label key={opt.value} className="pm-radio-label">
                    <input
                      type="radio"
                      name="pm-gender"
                      value={opt.value}
                      checked={gender === opt.value}
                      onChange={() => setGender(opt.value)}
                    />
                    {t(opt.labelKey)}
                  </label>
                ))}
              </div>
            </div>

            {/* 2 — Nombre y Apellido */}
            <div className="pm-row">
              <div className="pm-field-group" style={{ flex: 2 }}>
                <label className="pm-label">{t("tree.modal.fields.first_second_name")}</label>
                <input
                  className="pm-input"
                  type="text"
                  value={fullFirstName}
                  onChange={e => setFullFirstName(e.target.value)}
                  placeholder={t("tree.modal.fields.first_name_placeholder")}
                  autoFocus
                />
              </div>
              <div className="pm-field-group" style={{ flex: 1 }}>
                <label className="pm-label">{t("tree.modal.fields.surname")}</label>
                <input
                  className="pm-input"
                  type="text"
                  value={fullSurname}
                  onChange={e => setFullSurname(e.target.value)}
                  placeholder={t("tree.modal.fields.surname_placeholder")}
                />
              </div>
            </div>

            {/* 3 — Prefijo y Sufijo */}
            <div className="pm-row">
              <div className="pm-field-group">
                <label className="pm-label">{t("tree.modal.fields.prefix")}</label>
                <select className="pm-select" value={prefix} onChange={e => setPrefix(e.target.value)}>
                  {prefixOptions.map(p => <option key={p} value={p}>{p || "—"}</option>)}
                </select>
              </div>
              <div className="pm-field-group">
                <label className="pm-label">{t("tree.modal.fields.suffix")}</label>
                <select className="pm-select" value={suffix} onChange={e => setSuffix(e.target.value)}>
                  {SUFFIX_OPTIONS.map(s => <option key={s} value={s}>{s || "—"}</option>)}
                </select>
              </div>
            </div>

            {/* 4 — Fecha de nacimiento */}
            <DateFields
              label={t("tree.modal.fields.birth_date")}
              precision={birthPrec}   onPrecision={setBirthPrec}
              day={birthDay}          onDay={setBirthDay}
              month={birthMonth}      onMonth={setBirthMonth}
              year={birthYear}        onYear={setBirthYear}
              day2={birthDay2}        onDay2={setBirthDay2}
              month2={birthMonth2}    onMonth2={setBirthMonth2}
              year2={birthYear2}      onYear2={setBirthYear2}
            />

            {/* 5 — Lugar de nacimiento */}
            <PlaceField
              label={t("tree.modal.fields.birth_place")}
              value={birthPlace}
              onChange={setBirthPlace}
              suggestions={birthPlaceSuggestions}
              listId="pm-birth-place-list"
            />

            {/* 6 — Vivo / Fallecido */}
            <div className="pm-field-group">
              <label className="pm-label">{t("tree.modal.fields.status")}</label>
              <div className="pm-radio-group">
                <label className="pm-radio-label">
                  <input type="radio" name="pm-alive" checked={isAlive}  onChange={() => setIsAlive(true)}  /> {t("tree.modal.fields.living")}
                </label>
                <label className="pm-radio-label">
                  <input type="radio" name="pm-alive" checked={!isAlive} onChange={() => setIsAlive(false)} /> {t("tree.modal.fields.deceased")}
                </label>
              </div>
            </div>

            {!isAlive && (
              <>
                <DateFields
                  label={t("tree.modal.fields.death_date")}
                  precision={deathPrec}   onPrecision={setDeathPrec}
                  day={deathDay}          onDay={setDeathDay}
                  month={deathMonth}      onMonth={setDeathMonth}
                  year={deathYear}        onYear={setDeathYear}
                  day2={deathDay2}        onDay2={setDeathDay2}
                  month2={deathMonth2}    onMonth2={setDeathMonth2}
                  year2={deathYear2}      onYear2={setDeathYear2}
                />
                <PlaceField
                  label={t("tree.modal.fields.death_place")}
                  value={deathPlace}
                  onChange={setDeathPlace}
                  suggestions={deathPlaceSuggestions}
                  listId="pm-death-place-list"
                />
              </>
            )}

            {/* 7 — Condición migratoria */}
            <div className="pm-field-group">
              <label className="pm-label">{t("tree.modal.fields.migration_condition")}</label>
              <select
                className="pm-select"
                value={migrationCondition}
                onChange={e => setMigrationCondition(e.target.value)}
              >
                {MIGRATION_CONDITIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="pm-footer">
          <div className="pm-footer-left">
            {isEditing && onNavigateToFullProfile && (
              <button
                className="pm-edit-more-link"
                onClick={() => { onClose(); onNavigateToFullProfile(person.id); }}
              >
                {t("tree.modal.actions.edit_more_fields")}
              </button>
            )}
            {isEditing && (
              <button
                className={confirmDelete ? "btn-danger-confirm" : "btn-danger"}
                style={{ fontSize: "var(--font-size-sm)", padding: "var(--spacing-1) var(--spacing-3)" }}
                onClick={handleDelete}
              >
                {confirmDelete ? t("tree.modal.actions.confirm") : t("tree.modal.actions.delete")}
              </button>
            )}
          </div>
          <div className="pm-footer-actions">
            <button className="btn-secondary" onClick={onClose}>{t("tree.modal.actions.cancel")}</button>
            <button className="btn-primary" onClick={handleSave}>{t("tree.modal.actions.save")}</button>
          </div>
        </div>

      </div>
    </div>
  );
}
