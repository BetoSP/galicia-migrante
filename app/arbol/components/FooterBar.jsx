import { forwardRef } from "react";
import { useTranslation } from "@/components/LanguageContext";

const FooterBar = forwardRef(function FooterBar(props, ref) {
  const { t } = useTranslation();

  return (
    <footer ref={ref} className="footer-bar">
      © 2026 Galicia Migrante · {t('footer.derechos')} · v0.1.0-dev
    </footer>
  );
});

export default FooterBar;
