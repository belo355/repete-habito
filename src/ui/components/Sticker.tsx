import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type StickerColor = 'yellow' | 'red' | 'green' | 'magenta' | 'cyan';

/* eslint-disable i18next/no-literal-string -- classes CSS, não é texto para o usuário */
const colorClasses: Record<StickerColor, string> = {
  yellow: 'bg-sticker-yellow',
  red: 'bg-sticker-red',
  green: 'bg-sticker-green',
  magenta: 'bg-sticker-magenta',
  cyan: 'bg-sticker-cyan',
};
/* eslint-enable i18next/no-literal-string */

type StickerProps = {
  activityName: string;
  color: StickerColor;
  /** Número da figurinha: quantas vezes a pessoa apareceu nessa atividade contando esta. */
  count: number;
  done: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

// Gesto próprio do mundo: colar a figurinha. Pendente, é uma vaga tracejada com o número que
// vai ganhar; colada, vira a figurinha na cor da atividade, com borda de papel, levemente torta.
// O nome acessível é fixo (inclui o texto visível) e o estado está em aria-pressed, no texto
// e na forma (vaga × figurinha); a cor só identifica a atividade.
export function Sticker({ activityName, color, count, done, onToggle, disabled }: StickerProps) {
  const { t } = useTranslation();
  // Só anima quando a pessoa cola agora; uma figurinha que já abre colada não "cai" de novo.
  const [justStuck, setJustStuck] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={done}
      aria-label={t('sticker.label', { count, name: activityName })}
      onClick={() => {
        setJustStuck(!done);
        onToggle();
      }}
      disabled={disabled}
      className={`flex h-[4.75rem] w-16 shrink-0 cursor-pointer flex-col items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-60 ${
        done
          ? `${colorClasses[color]} -rotate-2 gap-0.5 border-4 border-sticker-edge text-on-sticker shadow-[0_2px_0_rgb(0_0_0/0.25)] outline-2 outline-on-sticker ${justStuck ? 'animate-sticker-in motion-reduce:animate-none' : ''}`
          : 'gap-0.5 border-2 border-dashed border-text text-text hover:bg-surface'
      }`}
    >
      {done ? (
        <>
          <span aria-hidden="true" className="text-[0.8125rem] leading-none font-bold">
            {t('sticker.number')}
          </span>
          <span aria-hidden="true" className="title-section text-[2rem] leading-none">
            {count}
          </span>
        </>
      ) : (
        <>
          <span aria-hidden="true" className="title-section text-[1.375rem] leading-none">
            {count}
          </span>
          <span aria-hidden="true" className="text-[0.8125rem] leading-none font-bold">
            {t('sticker.stick')}
          </span>
        </>
      )}
    </button>
  );
}
