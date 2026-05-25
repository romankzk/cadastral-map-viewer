import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";
import ComingSoon from "../components/ComingSoon";

export default function PerehnoivMap() {
    const { t } = useTranslation();
    useDocumentTitle(t('perehnoivMap.documentTitle'));

    return (
        <ComingSoon
            title={t('perehnoivMap.title')}
        />
    )
}