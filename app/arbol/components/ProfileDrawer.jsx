import { useState, useEffect, useMemo, useRef } from "react";
import { COUPLE_TYPES, PARENT_TYPES } from "@/app/arbol/lib/graph/relationshipTypes.js";
import { updatePerson } from "@/app/arbol/lib/services/peopleService.js";
import { useTranslation } from "@/components/LanguageContext";

// ── Funciones auxiliares ─────────────────────────────────────────────────────

function formatDate(day, month, year, locale = "es-AR") {
  if (!year) return "—";
  if (!month) return String(year);
  try {
    const d = day ? Number(day) : 1;
    const date = new Date(year, month - 1, d);
    if (!day) {
      return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    }
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return String(year);
  }
}

function getFullName(person) {
  if (!person) return "—";
  const parts = [person.prefix, person.name, person.name_2, person.surname_1, person.surname_2].filter(Boolean);
  return parts.join(" ") || "—";
}

function computeAge(person) {
  if (!person.birth_year) return null;
  if (person.is_alive === false) {
    return person.death_year ? person.death_year - person.birth_year : null;
  }
  return 2026 - person.birth_year;
}

function getLifeYears(person) {
  if (!person) return "";
  if (person.birth_year && person.is_alive === false && person.death_year) {
    return `${person.birth_year} – ${person.death_year}`;
  }
  if (person.birth_year) return String(person.birth_year);
  return "";
}

// ── Sub-componentes ──────────────────────────────────────────────────────────

function PersonAvatarHTML({ person, size = 36 }) {
  const isMale = person?.gender === "male";
  const isFemale = person?.gender === "female";
  const bgColor = isMale
    ? "var(--node-male-bg)"
    : isFemale
    ? "var(--node-female-bg)"
    : "var(--avatar-bg)";
  const iconColor = isMale
    ? "var(--node-gender-bar-male)"
    : isFemale
    ? "var(--node-gender-bar-female)"
    : "var(--avatar-fill)";

  return (
    <div className="profile-avatar" style={{ width: size, height: size, background: bgColor }}>
      <svg viewBox="0 0 40 40" width={size * 0.65} height={size * 0.65} fill={iconColor}>
        <circle cx="20" cy="14" r="8" />
        <ellipse cx="20" cy="36" rx="13" ry="9" />
      </svg>
    </div>
  );
}

// Edición inline de un campo de texto
function InlineText({ value, onSave, placeholder = "—" }) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? "");

  useEffect(() => {
    if (!editing) setVal(value ?? "");
  }, [value, editing]);

  async function save() {
    const trimmed = val.trim();
    setEditing(false);
    if (trimmed === (value ?? "")) return;
    await onSave(trimmed || null);
  }

  if (editing) {
    return (
      <input
        className="profile-inline-input"
        value={val}
        autoFocus
        onChange={(e) => setVal(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") { setVal(value ?? ""); setEditing(false); }
        }}
      />
    );
  }

  return (
    <span className="profile-inline-value" onClick={() => setEditing(true)} title={t("tree.modal.actions.edit_more_fields")}>
      {value
        ? value
        : <span className="profile-inline-empty">{placeholder}</span>
      }
    </span>
  );
}

// Edición inline de fecha (día + mes + año)
function InlineDate({ day, month, year, onSave }) {
  const { t, locale } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [d, setD] = useState(day ?? "");
  const [m, setM] = useState(month ?? "");
  const [y, setY] = useState(year ?? "");

  useEffect(() => {
    if (!editing) {
      setD(day ?? "");
      setM(month ?? "");
      setY(year ?? "");
    }
  }, [day, month, year, editing]);

  function save() {
    setEditing(false);
    onSave({
      day: d !== "" ? Number(d) : null,
      month: m !== "" ? Number(m) : null,
      year: y !== "" ? Number(y) : null,
    });
  }

  function cancel() {
    setD(day ?? "");
    setM(month ?? "");
    setY(year ?? "");
    setEditing(false);
  }

  const formatted = formatDate(day, month, year, locale);

  if (!editing) {
    return (
      <span className="profile-inline-value" onClick={() => setEditing(true)} title={t("tree.modal.actions.edit_more_fields")}>
        {formatted !== "—"
          ? formatted
          : <span className="profile-inline-empty">—</span>
        }
      </span>
    );
  }

  return (
    <span className="profile-inline-date">
      <input type="number" className="profile-inline-input profile-inline-input--sm"
        placeholder={t("tree.modal.date_fields.day")} value={d} onChange={(e) => setD(e.target.value)} min={1} max={31} />
      <input type="number" className="profile-inline-input profile-inline-input--sm"
        placeholder={t("tree.modal.date_fields.month")} value={m} onChange={(e) => setM(e.target.value)} min={1} max={12} />
      <input type="number" className="profile-inline-input profile-inline-input--md"
        placeholder={t("tree.modal.date_fields.year")} value={y} onChange={(e) => setY(e.target.value)} min={1} max={2100} />
      <button className="profile-inline-save" onClick={save}>✓</button>
      <button className="profile-inline-cancel" onClick={cancel}>✕</button>
    </span>
  );
}

// Sección acordeón
function ProfileSection({ title, open, onToggle, addLabel, children }) {
  return (
    <div className="profile-section">
      <div className="profile-section__header" onClick={onToggle}>
        <span className="profile-section__title">{title}</span>
        <span className="profile-section__header-right">
          {addLabel && (
            <button className="profile-section__add-btn" onClick={(e) => e.stopPropagation()}>
              + {addLabel}
            </button>
          )}
          <span className={`profile-section__chevron${open ? " profile-section__chevron--open" : ""}`}>
            ▼
          </span>
        </span>
      </div>
      {open && <div className="profile-section__body">{children}</div>}
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function ProfileDrawer({
  personId,
  people,
  relationships,
  onClose,
  onFocusPerson,
  onEditPerson,
  onNavigateToPerson,
  onDissolveSpouse,
  onDeletePerson,
  onDeleteRelationship,
  loadData,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sections, setSections] = useState({ bio: true, family: true, events: false, sources: false });
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dissolvingRelId, setDissolvingRelId] = useState(null);
  const [dissolveYearVal, setDissolveYearVal] = useState("");
  const [deletingRelId, setDeletingRelId] = useState(null);
  const [inlineError, setInlineError] = useState(null);
  const moreMenuRef = useRef(null);

  const personFromProps = useMemo(
    () => people.find((p) => String(p.id) === String(personId)) ?? null,
    [people, personId]
  );
  const [localPerson, setLocalPerson] = useState(personFromProps);

  // Sincronizar localPerson cuando los datos de DB se actualizan
  useEffect(() => {
    setLocalPerson(personFromProps);
  }, [personFromProps]);

  // Animación de apertura al montar
  useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawerOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Resetear estado al navegar a otra persona
  useEffect(() => {
    setShowMoreMenu(false);
    setDissolvingRelId(null);
    setDissolveYearVal("");
    setDeletingRelId(null);
    setConfirmDelete(false);
    setInlineError(null);
  }, [personId]);

  // Cerrar menú "Más" al hacer click fuera
  useEffect(() => {
    if (!showMoreMenu) return;
    function handleOutsideClick(e) {
      if (!moreMenuRef.current?.contains(e.target)) setShowMoreMenu(false);
    }
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [showMoreMenu]);

  // ── Derivación de familia (desde memoria, sin queries) ──────────────────

  const parents = useMemo(() => {
    if (!personId) return [];
    return relationships
      .filter((r) => PARENT_TYPES.has(r.type) && String(r.person_b_id) === String(personId))
      .map((r) => ({ rel: r, person: people.find((p) => String(p.id) === String(r.person_a_id)) }))
      .filter((x) => x.person);
  }, [relationships, people, personId]);

  const children = useMemo(() => {
    if (!personId) return [];
    return relationships
      .filter((r) => PARENT_TYPES.has(r.type) && String(r.person_a_id) === String(personId))
      .map((r) => ({ rel: r, person: people.find((p) => String(p.id) === String(r.person_b_id)) }))
      .filter((x) => x.person);
  }, [relationships, people, personId]);

  const spouses = useMemo(() => {
    if (!personId) return [];
    return relationships
      .filter(
        (r) =>
          COUPLE_TYPES.has(r.type) &&
          (String(r.person_a_id) === String(personId) || String(r.person_b_id) === String(personId))
      )
      .map((r) => {
        const spouseId =
          String(r.person_a_id) === String(personId) ? r.person_b_id : r.person_a_id;
        return { rel: r, person: people.find((p) => String(p.id) === String(spouseId)) };
      })
      .filter((x) => x.person);
  }, [relationships, people, personId]);

  const siblings = useMemo(() => {
    const siblingIds = new Set();
    parents.forEach(({ rel }) => {
      relationships
        .filter(
          (r) =>
            PARENT_TYPES.has(r.type) &&
            String(r.person_a_id) === String(rel.person_a_id) &&
            String(r.person_b_id) !== String(personId)
        )
        .forEach((r) => siblingIds.add(String(r.person_b_id)));
    });
    return [...siblingIds]
      .map((id) => people.find((p) => String(p.id) === id))
      .filter(Boolean);
  }, [parents, relationships, personId, people]);

  const { t, locale } = useTranslation();

  // ── Lista de eventos ────────────────────────────────────────────────────

  const events = useMemo(() => {
    if (!localPerson) return [];
    const list = [];

    if (localPerson.birth_year) {
      list.push({
        year: localPerson.birth_year,
        type: "Nacimiento",
        detail: formatDate(localPerson.birth_day, localPerson.birth_month, localPerson.birth_year, locale),
        place: localPerson.birth_place,
        personRef: null,
      });
    }

    spouses.forEach(({ rel, person: spouse }) => {
      if (rel.marriage_year) {
        list.push({
          year: rel.marriage_year,
          type: "Matrimonio con:",
          detail: formatDate(rel.marriage_day, rel.marriage_month, rel.marriage_year, locale),
          place: rel.marriage_place,
          personRef: spouse,
        });
      }
    });

    if (localPerson.is_alive === false && localPerson.death_year) {
      list.push({
        year: localPerson.death_year,
        type: "Fallecimiento",
        detail: formatDate(localPerson.death_day, localPerson.death_month, localPerson.death_year, locale),
        place: localPerson.death_place,
        personRef: null,
      });
    }

    return list.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999));
  }, [localPerson, spouses, locale]);

  // ── Edición inline ──────────────────────────────────────────────────────

  async function handleInlinePatch(field, value) {
    if (!localPerson) return;
    const prev = localPerson;
    setInlineError(null);
    setLocalPerson((p) => ({ ...p, [field]: value }));
    try {
      await updatePerson({ ...prev, id: prev.id, [field]: value });
      loadData();
    } catch {
      setLocalPerson(prev);
      setInlineError("Error al guardar. Intentá de nuevo.");
    }
  }

  async function handleInlineDatePatch(prefix, { day, month, year }) {
    if (!localPerson) return;
    const prev = localPerson;
    setInlineError(null);
    setLocalPerson((p) => ({
      ...p,
      [`${prefix}_day`]: day,
      [`${prefix}_month`]: month,
      [`${prefix}_year`]: year,
    }));
    try {
      await updatePerson({
        ...prev,
        id: prev.id,
        [`${prefix}_day`]: day,
        [`${prefix}_month`]: month,
        [`${prefix}_year`]: year,
      });
      loadData();
    } catch {
      setLocalPerson(prev);
      setInlineError("Error al guardar. Intentá de nuevo.");
    }
  }

  // ── Handlers ────────────────────────────────────────────────────────────

  function handleDissolveConfirm(relId) {
    if (!dissolveYearVal) return;
    onDissolveSpouse(relId, Number(dissolveYearVal));
    setDissolvingRelId(null);
    setDissolveYearVal("");
  }

  async function handleDeleteRelConfirm(relId) {
    setDeletingRelId(null);
    await onDeleteRelationship(relId);
  }

  function handleMoreMenuDeleteClick() {
    setShowMoreMenu(false);
    setConfirmDelete(true);
  }

  function handleDeleteConfirmed() {
    onDeletePerson(personId);
    onClose();
  }

  function handleFocusAndClose() {
    onFocusPerson(personId);
    setShowMoreMenu(false);
    onClose();
  }

  function handleOpenDissolveFromMenu() {
    const firstActive = spouses.find((s) => s.rel.until_year == null);
    if (firstActive) {
      setDissolvingRelId(firstActive.rel.id);
      setSections((s) => ({ ...s, family: true }));
    }
    setShowMoreMenu(false);
  }

  // ── Guard ────────────────────────────────────────────────────────────────

  if (!localPerson) return null;

  const age = computeAge(localPerson);
  const isDeceased = localPerson.is_alive === false;
  const fullName = getFullName(localPerson);
  const vitalsDate = formatDate(
    localPerson.birth_day,
    localPerson.birth_month,
    localPerson.birth_year,
    locale
  );
  const hasVitals = localPerson.birth_year || localPerson.birth_place;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <div className="profile-drawer-backdrop" />

      {/* Botón de cierre — fuera del drawer para que position:fixed no quede cortado por overflow */}
      <button
        className="profile-drawer__close-btn"
        onClick={drawerOpen ? onClose : undefined}
        title={drawerOpen ? t("nav.cerrar_menu") : ""}
        style={{ left: drawerOpen ? 420 : -32 }}
      >
        {drawerOpen ? "‹" : "›"}
      </button>

      <div className={`profile-drawer${drawerOpen ? " profile-drawer--open" : ""}`}>

        {/* ── SECCIÓN 1: Encabezado ─────────────────────────────────────── */}
        <div className="profile-header">
          <div className="profile-header__row">
            <PersonAvatarHTML person={localPerson} size={72} />
            <div className="profile-header__info">
              <div className="profile-header__name">{fullName}</div>
              <div className="profile-header__subtitle">{t("tree.drawer.this_is_you")}</div>
              {hasVitals && (
                <div className="profile-header__vitals">
                  {localPerson.birth_year && (
                    <>
                      <span className="vital-symbol">* </span>
                      {vitalsDate !== "—" ? vitalsDate : localPerson.birth_year}
                      {age !== null && ` (${age} ${t("tree.drawer.years_old")})`}
                    </>
                  )}
                  {localPerson.birth_year && localPerson.birth_place && " · "}
                  {localPerson.birth_place}
                </div>
              )}
              <button className="profile-header__link">{t("tree.drawer.investigate")}</button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="profile-actions">
            <button className="profile-action-btn" data-tooltip={t("tree.drawer.profile")}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="12" cy="10" r="3"/>
                <path d="M6 21c0-3.314 2.686-5 6-5s6 1.686 6 5"/>
              </svg>
              <span>{t("tree.drawer.profile")}</span>
            </button>
            <button
              className="profile-action-btn"
              data-tooltip={t("tree.drawer.edit")}
              onClick={() => onEditPerson(personId)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>{t("tree.drawer.edit")}</span>
            </button>
            <button className="profile-action-btn" data-tooltip={t("tree.drawer.add")}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="16" y1="11" x2="22" y2="11"/>
              </svg>
              <span>{t("tree.drawer.add")}</span>
            </button>
            <div className="profile-more-menu-wrap" ref={moreMenuRef}>
              <button
                className="profile-action-btn"
                data-tooltip={t("tree.drawer.more")}
                onClick={(e) => { e.stopPropagation(); setShowMoreMenu((v) => !v); }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <circle cx="5" cy="12" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="19" cy="12" r="2"/>
                </svg>
                <span>{t("tree.drawer.more")}</span>
              </button>
              {showMoreMenu && (
                <div className="profile-more-menu">
                  <button className="profile-more-menu__item" onClick={handleFocusAndClose}>
                    {t("tree.drawer.more_options.view_tree")}
                  </button>
                  <button className="profile-more-menu__item">{t("tree.drawer.more_options.edit_photo")}</button>
                  <button className="profile-more-menu__item">
                    {t("tree.drawer.more_options.connect_tree")}
                  </button>
                  <button className="profile-more-menu__item" onClick={handleOpenDissolveFromMenu}>
                    {t("tree.drawer.more_options.remove_connection")}
                  </button>
                  <button className="profile-more-menu__item">{t("tree.drawer.more_options.edit_parents")}</button>
                  <div className="profile-more-menu__separator" />
                  <button
                    className="profile-more-menu__item profile-more-menu__item--danger"
                    onClick={handleMoreMenuDeleteClick}
                  >
                    {t("tree.drawer.more_options.delete_person")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmación de eliminación */}
        {confirmDelete && (
          <div className="profile-delete-confirm">
            <span>{t("tree.drawer.delete_confirm").replace("{name}", localPerson.name)}</span>
            <button className="btn-confirm-yes" onClick={handleDeleteConfirmed}>{t("tree.drawer.delete_yes")}</button>
            <button className="btn-confirm-no" onClick={() => setConfirmDelete(false)}>{t("tree.drawer.delete_no")}</button>
          </div>
        )}

        {/* ── SECCIÓN 3: Descubrimientos ───────────────────────────────── */}
        <div className="profile-section">
          <div className="profile-section__header" style={{ cursor: "default" }}>
            <span className="profile-section__title">{t("tree.drawer.discoveries.title")}</span>
          </div>
          <div className="profile-placeholder">
            <span className="profile-placeholder__icon">✓</span>
            <span>{t("tree.drawer.discoveries.no_matches")}</span>
          </div>
        </div>

        {/* ── SECCIÓN 4: Fotos y Videos ────────────────────────────────── */}
        <div className="profile-section">
          <div className="profile-section__header" style={{ cursor: "default" }}>
            <span className="profile-section__title">{t("tree.drawer.media.title")}</span>
            <span className="profile-section__header-right">
              <button className="profile-section__add-btn">+ {t("tree.drawer.add")}</button>
            </span>
          </div>
          <div className="profile-placeholder">
            <span className="profile-placeholder__icon">🖼</span>
            <span>{t("tree.drawer.media.no_photos")}</span>
          </div>
        </div>

        {/* ── SECCIÓN 5: Biografía ─────────────────────────────────────── */}
        <ProfileSection
          title={t("tree.drawer.bio.title")}
          open={sections.bio}
          onToggle={() => setSections((s) => ({ ...s, bio: !s.bio }))}
          addLabel={t("tree.drawer.add")}
        >
          {/* Nacimiento */}
          <div className="profile-bio-field">
            <span className="profile-bio-label">{t("tree.drawer.bio.birth")}</span>
            <InlineDate
              day={localPerson.birth_day}
              month={localPerson.birth_month}
              year={localPerson.birth_year}
              onSave={(vals) => handleInlineDatePatch("birth", vals)}
            />
            <InlineText
              value={localPerson.birth_place}
              onSave={(val) => handleInlinePatch("birth_place", val)}
              placeholder={t("tree.drawer.bio.birth_placeholder")}
            />
          </div>

          {/* Fallecimiento */}
          {isDeceased && (
            <div className="profile-bio-field">
              <span className="profile-bio-label">{t("tree.drawer.bio.death")}</span>
              <InlineDate
                day={localPerson.death_day}
                month={localPerson.death_month}
                year={localPerson.death_year}
                onSave={(vals) => handleInlineDatePatch("death", vals)}
              />
              <InlineText
                value={localPerson.death_place}
                onSave={(val) => handleInlinePatch("death_place", val)}
                placeholder={t("tree.drawer.bio.death_placeholder")}
              />
              <InlineText
                value={localPerson.death_cause}
                onSave={(val) => handleInlinePatch("death_cause", val)}
                placeholder={t("tree.drawer.bio.cause_placeholder")}
              />
            </div>
          )}

          {/* Sepultura */}
          {localPerson.burial_place != null && (
            <div className="profile-bio-field">
              <span className="profile-bio-label">{t("tree.drawer.bio.burial")}</span>
              <InlineText
                value={localPerson.burial_place}
                onSave={(val) => handleInlinePatch("burial_place", val)}
                placeholder={t("tree.drawer.bio.burial_placeholder")}
              />
            </div>
          )}

          {inlineError && <div className="profile-inline-error">{t("tree.drawer.bio.save_error")}</div>}
        </ProfileSection>

        {/* ── SECCIÓN 6: Familia Inmediata ──────────────────────────────── */}
        <ProfileSection
          title={t("tree.drawer.family.title")}
          open={sections.family}
          onToggle={() => setSections((s) => ({ ...s, family: !s.family }))}
          addLabel={t("tree.drawer.add")}
        >
          {/* Padres */}
          {parents.length > 0 && (
            <div className="profile-family-group">
              <div className="profile-family-group__label">{t("tree.drawer.family.parents")}</div>
              {parents.map(({ rel, person: p }) => (
                <div key={rel.id}>
                  <div className="profile-family-member" onClick={() => onNavigateToPerson(p.id)}>
                     <PersonAvatarHTML person={p} size={36} />
                     <div className="profile-family-member__info">
                       <div className="profile-family-member__name">{getFullName(p)}</div>
                       <div className="profile-family-member__rel">
                         {t(`tree.drawer.parent_labels.${rel.type}`, { defaultValue: rel.type })}
                         {getLifeYears(p) && (
                           <span className="profile-family-member__years"> · {getLifeYears(p)}</span>
                         )}
                       </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cónyuge / Pareja */}
          {spouses.length > 0 && (
            <div className="profile-family-group">
              <div className="profile-family-group__label">{t("tree.drawer.family.spouses")}</div>
              {spouses.map(({ rel, person: p }) => (
                <div key={rel.id}>
                  <div className="profile-family-member" onClick={() => onNavigateToPerson(p.id)}>
                    <PersonAvatarHTML person={p} size={36} />
                    <div className="profile-family-member__info">
                      <div className="profile-family-member__name">{getFullName(p)}</div>
                      <div className="profile-family-member__rel">
                        {t(`tree.drawer.couple_labels.${rel.type}`, { defaultValue: rel.type })}
                        {rel.marriage_year && ` ${t("tree.drawer.family.since").replace("{year}", rel.marriage_year)}`}
                        {rel.until_year && ` ${t("tree.drawer.family.until").replace("{year}", rel.until_year)}`}
                      </div>
                    </div>
                    {rel.until_year == null && (
                      <div style={{ display: "flex", gap: "var(--spacing-1)" }}>
                        <button
                          className="profile-dissolve-trigger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDissolvingRelId((prev) => (prev === rel.id ? null : rel.id));
                            setDissolveYearVal("");
                            setDeletingRelId(null);
                          }}
                        >
                          {t("tree.drawer.family.dissolve")}
                        </button>
                        <button
                          className="profile-delete-rel-trigger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingRelId((prev) => (prev === rel.id ? null : rel.id));
                            setDissolvingRelId(null);
                          }}
                        >
                          {t("tree.drawer.family.delete")}
                        </button>
                      </div>
                    )}
                  </div>
                  {dissolvingRelId === rel.id && (
                    <div className="profile-dissolve-inline">
                      <input
                        type="number"
                        className="profile-dissolve-input"
                        placeholder={t("tree.drawer.family.dissolve_placeholder")}
                        value={dissolveYearVal}
                        onChange={(e) => setDissolveYearVal(e.target.value)}
                        autoFocus
                        min={1}
                        max={2100}
                      />
                      <button
                        className="profile-inline-save"
                        onClick={() => handleDissolveConfirm(rel.id)}
                      >
                        ✓
                      </button>
                      <button
                        className="profile-inline-cancel"
                        onClick={() => { setDissolvingRelId(null); setDissolveYearVal(""); }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {deletingRelId === rel.id && (
                    <div className="profile-delete-rel-confirm">
                      <p className="profile-delete-rel-warning">
                        {t("tree.drawer.family.delete_warning")}
                      </p>
                      <div className="profile-delete-rel-actions">
                        <button
                          className="btn-confirm-yes"
                          onClick={() => handleDeleteRelConfirm(rel.id)}
                        >
                          {t("tree.drawer.family.delete_rel_confirm")}
                        </button>
                        <button
                          className="btn-confirm-no"
                          onClick={() => setDeletingRelId(null)}
                        >
                          {t("tree.modal.actions.cancel")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Hijos */}
          {children.length > 0 && (
            <div className="profile-family-group">
              <div className="profile-family-group__label">{t("tree.drawer.family.children")}</div>
              {children.map(({ rel, person: p }) => (
                <div
                  key={rel.id}
                  className="profile-family-member"
                  onClick={() => onNavigateToPerson(p.id)}
                >
                  <PersonAvatarHTML person={p} size={36} />
                  <div className="profile-family-member__info">
                    <div className="profile-family-member__name">{getFullName(p)}</div>
                    <div className="profile-family-member__rel">
                      {p.gender === "female" ? t("tree.drawer.family.daughter") : t("tree.drawer.family.son")}
                      {getLifeYears(p) && (
                        <span className="profile-family-member__years"> · {getLifeYears(p)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hermanos */}
          {siblings.length > 0 && (
            <div className="profile-family-group">
              <div className="profile-family-group__label">{t("tree.drawer.family.siblings")}</div>
              {siblings.map((p) => (
                <div
                  key={p.id}
                  className="profile-family-member"
                  onClick={() => onNavigateToPerson(p.id)}
                >
                  <PersonAvatarHTML person={p} size={36} />
                  <div className="profile-family-member__info">
                    <div className="profile-family-member__name">{getFullName(p)}</div>
                    <div className="profile-family-member__rel">
                      {p.gender === "female" ? t("tree.drawer.family.sister") : t("tree.drawer.family.brother")}
                      {getLifeYears(p) && (
                        <span className="profile-family-member__years"> · {getLifeYears(p)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {parents.length === 0 &&
            spouses.length === 0 &&
            children.length === 0 &&
            siblings.length === 0 && (
              <p className="profile-empty-msg">{t("tree.drawer.family.empty")}</p>
            )}
        </ProfileSection>

        {/* ── SECCIÓN 7: Eventos ───────────────────────────────────────── */}
        <ProfileSection
          title={t("tree.drawer.events.title")}
          open={sections.events}
          onToggle={() => setSections((s) => ({ ...s, events: !s.events }))}
          addLabel={t("tree.drawer.add")}
        >
          {events.length === 0 ? (
            <p className="profile-empty-msg">{t("tree.drawer.events.empty")}</p>
          ) : (
            events.map((ev, i) => {
              let typeTranslated = ev.type;
              if (ev.type === "Nacimiento") typeTranslated = t("tree.drawer.events.birth");
              else if (ev.type === "Fallecimiento") typeTranslated = t("tree.drawer.events.death");
              else if (ev.type === "Matrimonio con:") typeTranslated = t("tree.drawer.events.marriage");

              return (
                <div key={i} className="profile-event">
                  <div className="profile-event__year">{ev.year}</div>
                  <div className="profile-event__body">
                    <div className="profile-event__type">{typeTranslated}</div>
                    {ev.detail && ev.detail !== "—" && (
                      <div className="profile-event__detail">{ev.detail}</div>
                    )}
                    {ev.place && <div className="profile-event__place">{ev.place}</div>}
                    {ev.personRef && (
                      <div
                        className="profile-event__person-ref"
                        onClick={() => onNavigateToPerson(ev.personRef.id)}
                      >
                        <PersonAvatarHTML person={ev.personRef} size={24} />
                        <span className="profile-event__person-name">{getFullName(ev.personRef)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </ProfileSection>

        {/* ── SECCIÓN 8: Fuentes ───────────────────────────────────────── */}
        <ProfileSection
          title={t("tree.drawer.sources.title")}
          open={sections.sources}
          onToggle={() => setSections((s) => ({ ...s, sources: !s.sources }))}
          addLabel={t("tree.drawer.add")}
        >
          <p className="profile-empty-msg">{t("tree.drawer.sources.empty")}</p>
        </ProfileSection>

      </div>
    </>
  );
}
