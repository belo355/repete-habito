import { Share, SquarePlus } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useInstallStore } from '../../platform/install/install.ts';
import { Button } from '../../ui/components/Button.tsx';

// CA01.2: convite próprio "Instalar app" (Chrome Android/desktop) ou instrução visual no iOS.
// Não aparece quando o app já está instalado nem quando o navegador não permite instalar.
export function InstallSetting() {
  const { t } = useTranslation();
  const titleId = useId();
  const { isIOS, isStandalone, deferredPrompt, promptInstall } = useInstallStore();

  if (isStandalone) return null;

  if (deferredPrompt) {
    return (
      <section aria-labelledby={titleId} className="mt-8">
        <h2 id={titleId} className="mb-2 text-xl font-extrabold tracking-[-0.01em]">
          {t('install.title')}
        </h2>
        <p className="mb-3 text-text-muted">{t('install.description')}</p>
        <Button onClick={() => void promptInstall()}>{t('install.button')}</Button>
      </section>
    );
  }

  if (isIOS) {
    return (
      <section aria-labelledby={titleId} className="mt-8">
        <h2 id={titleId} className="mb-2 text-xl font-extrabold tracking-[-0.01em]">
          {t('install.ios.title')}
        </h2>
        <p className="mb-3 text-text-muted">{t('install.description')}</p>
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          <li className="flex items-center gap-3">
            <Share aria-hidden="true" className="size-6 shrink-0 text-text" />
            <span>{t('install.ios.step1')}</span>
          </li>
          <li className="flex items-center gap-3">
            <SquarePlus aria-hidden="true" className="size-6 shrink-0 text-text" />
            <span>{t('install.ios.step2')}</span>
          </li>
        </ol>
      </section>
    );
  }

  return null;
}
