import { useTranslation } from 'react-i18next';

export type CapsuleColor = 'yellow' | 'coral' | 'blue' | 'lilac';

/* eslint-disable i18next/no-literal-string -- classes CSS, não é texto para o usuário */
const colorClasses: Record<CapsuleColor, string> = {
  yellow: 'bg-capsule-yellow',
  coral: 'bg-capsule-coral',
  blue: 'bg-capsule-blue',
  lilac: 'bg-capsule-lilac',
};
/* eslint-enable i18next/no-literal-string */

type MarkCapsuleProps = {
  activityName: string;
  color: CapsuleColor;
  done: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

// Gesto próprio do mundo: a cápsula de marcar. Ao marcar, o ponto branco atravessa para o
// outro lado e o texto vira "Feito". O estado está no texto, na posição do ponto e em
// aria-pressed; a cor só identifica a atividade. O nome acessível inclui o texto visível.
export function MarkCapsule({ activityName, color, done, onToggle, disabled }: MarkCapsuleProps) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={onToggle}
      disabled={disabled}
      className={`group relative inline-flex h-11 w-32 shrink-0 cursor-pointer items-center rounded-full font-bold text-on-capsule transition-[padding] duration-200 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60 ${colorClasses[color]} ${done ? 'justify-end pr-5 pl-12' : 'justify-start pr-12 pl-5'}`}
    >
      <span>{done ? t('mark.done') : t('mark.action')}</span>
      <span className="sr-only"> {activityName}</span>
      <span
        aria-hidden="true"
        className={`absolute top-1.5 left-1.5 size-8 rounded-full bg-chip shadow-[0_1px_2px_rgb(0_0_0/0.25)] transition-transform duration-[250ms] ease-[cubic-bezier(0.34,1.25,0.64,1)] motion-reduce:transition-none ${done ? 'translate-x-0' : 'translate-x-[5.25rem]'}`}
      />
    </button>
  );
}
