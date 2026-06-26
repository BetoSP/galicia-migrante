import { useState, useRef, useEffect, forwardRef } from "react";
import { useTranslation } from "@/components/LanguageContext";
import { useAuth } from "@/components/AuthProvider";

// ── Iconos ────────────────────────────────────────────────────────────────────
function IconTree() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="icon-nav">
      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="icon-sm">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="icon-sm">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-9-1a1 1 0 000 2v3a1 1 0 102 0V9a1 1 0 00-1-1H9zm1-5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
  );
}

function IconSmartMatch() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="icon-sm">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  );
}

function IconRecordMatch() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="icon-sm">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  );
}

function IconDNA() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="icon-sm">
      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function Caret() {
  return (
    <svg viewBox="0 0 10 6" width={8} height={8} fill="none" stroke="currentColor" strokeWidth={1.5} style={{ flexShrink: 0 }}>
      <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Datos del menú ────────────────────────────────────────────────────────────
const TOP_MENU = [
  { id: "home",        labelKey: "nav.inicio",          mvp: true,  hasSub: true  },
  { id: "tree",        labelKey: "nav.arbol",           mvp: true,  hasSub: true  },
  { id: "discoveries", labelKey: "tree.nav.discoveries",  mvp: false, hasSub: true  },
  { id: "photos",      labelKey: "tree.nav.photos",            mvp: true,  hasSub: true  },
  { id: "research",    labelKey: "tree.nav.research",    mvp: false, hasSub: true  },
];

const SUBMENUS = {
  home: [
    { labelKey: "tree.nav.sub.family_events",      sectionId: "home", mvp: true  },
    { labelKey: "tree.nav.sub.family_stats",       sectionId: "home", mvp: true  },
    { labelKey: "tree.nav.sub.site_members",       sectionId: "home", mvp: true  },
  ],
  tree: [
    { labelKey: "tree.context.my_tree",                sectionId: "tree",   mvp: true  },
    { labelKey: "tree.nav.sub.my_photos",               sectionId: "photos", mvp: true  },
    { labelKey: "tree.nav.sub.manage_trees",            sectionId: "admin",  mvp: true  },
    { labelKey: "tree.nav.sub.print_charts",       sectionId: null,   mvp: false },
    { labelKey: "tree.nav.sub.timeline",           sectionId: null,     mvp: false },
    { labelKey: "tree.nav.sub.familymap",          sectionId: null,     mvp: false },
    { labelKey: "tree.nav.sub.relations_report",   sectionId: null,     mvp: false },
    { labelKey: "tree.nav.sub.sources",            sectionId: null,     mvp: false },
  ],
  discoveries: [
    { labelKey: "tree.nav.sub.matches_by_person",  sectionId: null,   mvp: false },
    { labelKey: "tree.nav.sub.matches_by_source",  sectionId: null,   mvp: false },
  ],
  photos: [
    { labelKey: "tree.nav.sub.my_photos",               sectionId: "photos", mvp: true  },
    { labelKey: "tree.nav.sub.colorize_photos",    sectionId: null,     mvp: false },
    { labelKey: "tree.nav.sub.repair_photos",      sectionId: null,     mvp: false },
    { labelKey: "tree.nav.sub.deep_nostalgia",     sectionId: null,     mvp: false },
    { labelKey: "tree.nav.sub.livememory",         sectionId: null,     mvp: false },
    { labelKey: "tree.nav.sub.scribe_ai",          sectionId: null,     mvp: false },
    { labelKey: "tree.nav.sub.tribute_video",      sectionId: null,     mvp: false },
  ],
  research: [
    { labelKey: "tree.nav.sub.search_all_records",         sectionId: null, mvp: false },
    { labelKey: "tree.nav.sub.collection_catalog",         sectionId: null, mvp: false },
    { labelKey: "tree.nav.sub.bmd_records",                sectionId: null, mvp: false },
    { labelKey: "tree.nav.sub.census_records",             sectionId: null, mvp: false },
    { labelKey: "tree.nav.sub.family_trees_records",       sectionId: null, mvp: false },
    { labelKey: "tree.nav.sub.newspapers",                 sectionId: null, mvp: false },
    { labelKey: "tree.nav.sub.immigration_records",        sectionId: null, mvp: false },
    { labelKey: "tree.nav.sub.hire_researcher",            sectionId: null, mvp: false },
  ],
};

const A11Y_OPTIONS = [
  "tree.a11y.options.visual_impairment",
  "tree.a11y.options.color_blindness",
  "tree.a11y.options.hide_animations",
  "tree.a11y.options.typical_view",
  "tree.a11y.options.normalize_font",
];

// ── Props ──────────────────────────────────────────────────────────────────────
const ModuleNavBar = forwardRef(function ModuleNavBar({ user, trees = [], activeTree, onTreeChange, activeSection, onNavigate }, ref) {
  const { t, locale, setLocale } = useTranslation();
  const { user: authUser, profile } = useAuth();
  
  const [treeMenuOpen, setTreeMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const a11yRef = useRef(null);

  useEffect(() => {
    if (!a11yOpen) return;
    function handleClickOutside(e) {
      if (a11yRef.current && !a11yRef.current.contains(e.target)) {
        setA11yOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [a11yOpen]);

  const treeName = activeTree?.name ?? t("tree.context.my_tree");
  const userName = profile 
    ? `${profile.nombre} ${profile.apellido || ""}`.trim()
    : authUser?.user_metadata?.nombre 
      ? `${authUser.user_metadata.nombre} ${authUser.user_metadata.apellido || ""}`.trim()
      : user?.name || t("tree.nav.guest");

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "??";

  const langCodeUpper = locale.split("-")[0].toUpperCase();

  return (
    <header ref={ref} className="module-nav">

      {/* ── Logo — columna izquierda, abarca ambas filas ─────────────────── */}
      <div className="module-nav__logo-col">
        <div className="main-nav__logo-icon">
          <IconTree />
        </div>
        <span className="module-nav__logo-label">{t("tree.nav.genealogy")}</span>
      </div>

      {/* ── Columna derecha — Fila 1 + Fila 2 apiladas ──────────────────── */}
      <div className="module-nav__rows">

        {/* ── Fila 1 — Chrome bar ─────────────────────────────────────── */}
        <div className="chrome-bar">
          <div className="chrome-bar__left">

            {/* Selector de árbol activo */}
            <div className="module-nav__tree-selector" style={{ position: "relative" }}>
              <button
                className="module-nav__tree-btn"
                onClick={() => setTreeMenuOpen(v => !v)}
                title={t("tree.context.my_tree")}
              >
                <span className="module-nav__tree-name">{treeName}</span>
                <svg viewBox="0 0 10 6" width={10} height={10} fill="none" stroke="currentColor" strokeWidth={1.5} style={{ flexShrink: 0, transform: treeMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                  <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {treeMenuOpen && trees.length > 0 && (
                <div className="module-nav__tree-dropdown">
                  {trees.map(t => (
                    <button
                      key={t.id}
                      className="module-nav__tree-item"
                      onClick={() => { onTreeChange?.(t); setTreeMenuOpen(false); }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Iconos NO-MVP — placeholders de features futuras */}
            <button className="chrome-bar__icon-btn module-nav__nomvp-btn" disabled title="Smart Match">
              <IconSmartMatch />
            </button>
            <button className="chrome-bar__icon-btn module-nav__nomvp-btn" disabled title="Record Match">
              <IconRecordMatch />
            </button>
            <button className="chrome-bar__icon-btn module-nav__nomvp-btn" disabled title="DNA">
              <IconDNA />
            </button>

          </div>

          <div className="chrome-bar__right">
            <div className="chrome-bar__user">
              <div className="chrome-bar__avatar">{initials}</div>
              <span>{userName}</span>
            </div>
            <button className="chrome-bar__icon-btn" title={t("tree.nav.messages")}><IconMail /></button>
            <button className="chrome-bar__text-btn" title={t("tree.nav.help")}>
              <IconHelp /><span>{t("tree.nav.help")}</span><Caret />
            </button>
            <button className="chrome-bar__lang">🌐 {langCodeUpper} <Caret /></button>
          </div>
        </div>

        {/* ── Fila 2 — Menú de navegación ──────────────────────────────── */}
        <nav className="module-nav__menu">
          <div className="module-nav__menu-items">
            {TOP_MENU.map(item => (
              <div
                key={item.id}
                className="nav-item"
                onMouseEnter={() => item.hasSub && setOpenMenu(item.id)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                {/* Link principal del ítem */}
                <a
                  href="#"
                  className={[
                    "main-nav__link",
                    activeSection === item.id ? "main-nav__link--active" : "",
                    !item.mvp ? "main-nav__link--disabled" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={(e) => { e.preventDefault(); if (item.mvp) onNavigate?.(item.id); }}
                  aria-disabled={!item.mvp}
                  tabIndex={!item.mvp ? -1 : undefined}
                  title={!item.mvp ? t("tree.context.proximamente") : undefined}
                >
                  {t(item.labelKey)}
                  {item.hasSub && <Caret />}
                  {!item.mvp && <span className="module-nav__badge-soon">{t("tree.context.proxim")}</span>}
                </a>

                {/* Submenú desplegable */}
                {item.hasSub && openMenu === item.id && SUBMENUS[item.id] && (
                  <div className="nav-dropdown">
                    {SUBMENUS[item.id].map(sub => (
                      <a
                        key={sub.labelKey}
                        href="#"
                        className={[
                          "nav-dropdown__item",
                          !sub.mvp ? "nav-dropdown__item--disabled" : "",
                        ].filter(Boolean).join(" ")}
                        onClick={(e) => {
                          e.preventDefault();
                          if (sub.mvp && sub.sectionId) {
                            onNavigate?.(sub.sectionId);
                            setOpenMenu(null);
                          }
                        }}
                        tabIndex={!sub.mvp ? -1 : undefined}
                      >
                        <span>{t(sub.labelKey)}</span>
                        {!sub.mvp && <span className="module-nav__badge-soon">{t("tree.context.proxim")}</span>}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botón de accesibilidad — extremo derecho, absoluto */}
          <div className="module-nav__a11y-wrap" ref={a11yRef}>
            <button
              className="module-nav__a11y-btn"
              title={t("tree.a11y.accessibility")}
              onClick={() => setA11yOpen(v => !v)}
              aria-expanded={a11yOpen}
            >
              ♿
            </button>

            {a11yOpen && (
              <div className="a11y-panel">
                <div className="a11y-panel__header">
                  <span className="a11y-panel__title">{t("tree.a11y.accessibility")}</span>
                  <button className="a11y-panel__close" onClick={() => setA11yOpen(false)}>✕</button>
                </div>

                <div className="a11y-panel__body">

                  <div className="a11y-panel__section">
                    <span className="a11y-panel__label">{t("tree.a11y.font_size")}</span>
                    <div className="a11y-panel__font-ctrl">
                      <button className="a11y-panel__font-btn" onClick={() => setFontSize(f => Math.max(80, f - 10))}>−</button>
                      <span className="a11y-panel__font-value">{fontSize}%</span>
                      <button className="a11y-panel__font-btn" onClick={() => setFontSize(f => Math.min(150, f + 10))}>+</button>
                      <button className="a11y-panel__font-reset" onClick={() => setFontSize(100)}>{t("tree.a11y.reset")}</button>
                    </div>
                  </div>

                  <div className="a11y-panel__section">
                    {A11Y_OPTIONS.map(optKey => (
                      <label key={optKey} className="a11y-panel__option">
                        <input type="checkbox" />
                        {t(optKey)}
                      </label>
                    ))}
                  </div>

                  <div className="a11y-panel__section">
                    <a href="#" className="a11y-panel__link">{t("tree.a11y.declaration")}</a>
                    <div>
                      <span className="a11y-panel__label">{t("tree.a11y.language")}</span>
                      <select 
                        className="a11y-panel__lang-select" 
                        value={locale} 
                        onChange={(e) => setLocale(e.target.value)}
                      >
                        <option value="es-AR">Español</option>
                        <option value="gl">Galego</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </nav>

      </div>
    </header>
  );
});

export default ModuleNavBar;
