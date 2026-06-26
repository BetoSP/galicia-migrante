import { useTranslation } from "@/components/LanguageContext";

// ── Iconos de vistas ──────────────────────────────────────────────────────────
function IconFamilia() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="icon-md">
      <path d="M9 12H1v6a2 2 0 002 2h14a2 2 0 002-2v-6h-8v2H9v-2z" />
      <path d="M13 10V7a1 1 0 00-1-1H8a1 1 0 00-1 1v3H2V8a2 2 0 012-2h1V5a5 5 0 0110 0v1h1a2 2 0 012 2v2h-5z" />
    </svg>
  );
}

function IconExpandido() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="icon-md">
      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function IconFotos() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="icon-md">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
  );
}

function IconLista() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="icon-md">
      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  );
}

const CONTEXT_VIEWS = [
  { id: "familia",   labelKey: "tree.context.view_familiar",  Icon: IconFamilia,   mvp: true  },
  { id: "expandido", labelKey: "tree.context.view_expanded", Icon: IconExpandido, mvp: false },
  { id: "foto",      labelKey: "tree.context.view_photos",     Icon: IconFotos,     mvp: false },
  { id: "lista",     labelKey: "tree.context.view_list",     Icon: IconLista,     mvp: false },
];

// ── Props ──────────────────────────────────────────────────────────────────────
export default function TreeContextBar({
  treeName,
  focusPerson,
  totalPersons,
  renderedPersons,
  viewMode,
  onViewModeChange,
}) {
  const { t } = useTranslation();

  return (
    <div className="context-bar">

      {/* ── Breadcrumb: nombre árbol | persona foco ──────────────────────── */}
      <div className="context-bar__breadcrumb">
        <span className="context-bar__tree-label">{treeName ?? t("tree.context.my_tree")}</span>
        {focusPerson && (
          <>
            <span className="context-bar__sep"> | </span>
            <span className="context-bar__focus-label">{focusPerson}</span>
          </>
        )}
      </div>

      {/* ── Contador de personas ─────────────────────────────────────────── */}
      {totalPersons != null && (
        <span className="context-bar__count">
          <strong>{renderedPersons ?? "–"}</strong> {t("tree.context.de")} <strong>{totalPersons}</strong> {t("tree.context.persons")}
        </span>
      )}

      {/* ── Vistas del árbol — extremo derecho ───────────────────────────── */}
      <div className="context-bar__views">
        {CONTEXT_VIEWS.map(({ id, labelKey, Icon, mvp }) => (
          <button
            key={id}
            title={mvp ? t(labelKey) : `${t(labelKey)} — ${t("tree.context.proximamente")}`}
            disabled={!mvp}
            onClick={() => mvp && onViewModeChange?.(id)}
            className={[
              "context-bar__view-btn",
              viewMode === id ? "context-bar__view-btn--active" : "",
              !mvp ? "context-bar__view-btn--disabled" : "",
            ].filter(Boolean).join(" ")}
          >
            <Icon />
            <span className="context-bar__view-label">{t(labelKey)}</span>
            {!mvp && <span className="module-nav__badge-soon">{t("tree.context.proxim")}</span>}
          </button>
        ))}
      </div>

    </div>
  );
}
