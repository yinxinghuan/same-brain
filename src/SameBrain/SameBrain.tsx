import { useEffect, useState } from 'react';
import { openAigramProfile, telegramId } from '@shared/runtime';
import { useSameBrain } from './hooks/useSameBrain';
import { vectorLabel } from './utils/compose';
import { loc, t } from './i18n';
import { Icon, ColorSwatch, Monogram } from './assets/icons';
import type { Vision } from './types';
import { promptById, type BrainPrompt } from './data/prompts';
import './SameBrain.less';

const isUrl = (s?: string) => !!s && /^https?:\/\//.test(s);

function Heart({ filled, size = 22 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={1.9} strokeLinejoin="round">
      <path d="M12 20s-7-4.5-9.2-9A4.8 4.8 0 0 1 12 6.5 4.8 4.8 0 0 1 21.2 11C19 15.5 12 20 12 20z" />
    </svg>
  );
}

function Avatar({ vision, size = 22 }: { vision: Vision; size?: number }) {
  const a = vision.userAvatarUrl;
  if (isUrl(a)) {
    return <img className="sb-ava sb-ava--img" src={a} alt="" style={{ width: size, height: size }} />;
  }
  return <Monogram name={vision.userName || '?'} size={size} />;
}

function PartnerChip({ vision, accent }: { vision: Vision; accent?: boolean }) {
  // The alter ego is the player themselves — a self entry, no profile to open.
  if (vision.alterEgo) {
    return (
      <span className={'sb-chip' + (accent ? ' sb-chip--accent' : '')}>
        <span className="sb-ava sb-aiself"><Icon name="brain" size={13} /></span>
        <span className="sb-chip__name">{t('alterEgoLabel')}</span>
      </span>
    );
  }
  const tappable = !!vision.userId;
  const body = (
    <>
      <Avatar vision={vision} size={22} />
      <span className="sb-chip__name">{vision.userName || t('aStranger')}</span>
    </>
  );
  if (tappable) {
    return (
      <button
        className={'sb-chip' + (accent ? ' sb-chip--accent' : '')}
        onClick={e => {
          e.stopPropagation();
          openAigramProfile(vision.userId!);
        }}
      >
        {body}
      </button>
    );
  }
  return <span className={'sb-chip' + (accent ? ' sb-chip--accent' : '')}>{body}</span>;
}

/** Render a dimension option's visual — a color swatch or an SVG glyph. */
function OptionVisual({ icon, color, size = 32 }: { icon?: string; color?: string; size?: number }) {
  if (color) return <ColorSwatch hex={color} size={size} />;
  return <Icon name={icon!} size={size} />;
}

// ── Intro ──────────────────────────────────────────────────────────────────

function Intro({ prompt, onStart }: { prompt: BrainPrompt; onStart: () => void }) {
  const previews = prompt.dims[0].options.slice(0, 6);
  return (
    <div className="sb-intro" onPointerDown={onStart}>
      <div className="sb-intro__halo" aria-hidden />
      <div className="sb-intro__icons">
        {previews.map((o, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.12}s` }}>
            <OptionVisual icon={o.icon} color={o.color} size={30} />
          </span>
        ))}
      </div>
      <h1 className="sb-intro__setup">{loc(prompt.setup)}</h1>
      <div className="sb-intro__cta">
        <Icon name="tap" size={20} />
        <span>{t('tapToThink')}</span>
      </div>
    </div>
  );
}

// ── Picker ─────────────────────────────────────────────────────────────────

function Picker({
  prompt,
  dimIndex,
  onChoose,
}: {
  prompt: BrainPrompt;
  dimIndex: number;
  onChoose: (i: number) => void;
}) {
  const dim = prompt.dims[dimIndex];
  return (
    <div className="sb-pick" key={dimIndex}>
      <div className="sb-dots">
        {prompt.dims.map((_, i) => (
          <span key={i} className={'sb-dot' + (i <= dimIndex ? ' sb-dot--on' : '')} />
        ))}
      </div>
      <h2 className="sb-pick__ask">{loc(dim.ask)}</h2>
      <div className="sb-tiles">
        {dim.options.map((o, i) => (
          <button
            key={i}
            className="sb-tile"
            style={{ animationDelay: `${i * 0.04}s` }}
            onPointerDown={() => onChoose(i)}
          >
            <span className="sb-tile__icon">
              <OptionVisual icon={o.icon} color={o.color} size={34} />
            </span>
            <span className="sb-tile__label">{loc(o.labels)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Developing ───────────────────────────────────────────────────────────────

const DEV_COPY: Array<'reading' | 'finding' | 'almost'> = ['reading', 'finding', 'almost'];

function Developing({ mine }: { mine: Vision | null }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep(s => Math.min(s + 1, DEV_COPY.length - 1)), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="sb-dev">
      <div className="sb-pair">
        <div className="sb-slot sb-slot--mine">
          {mine ? (
            <img className="sb-slot__img" src={mine.imageUrl} alt="" />
          ) : (
            <div className="sb-slot__shimmer" />
          )}
          <span className="sb-slot__tag sb-slot__tag--you">{t('you')}</span>
        </div>
        <div className="sb-pair__vs">
          <span className="sb-brainpulse"><Icon name="brain" size={26} /></span>
        </div>
        <div className="sb-slot sb-slot--them">
          <div className="sb-slot__shimmer" />
          <span className="sb-slot__tag sb-slot__tag--q">?</span>
        </div>
      </div>
      <p className="sb-dev__copy">{t(DEV_COPY[step])}</p>
    </div>
  );
}

// ── Reveal ───────────────────────────────────────────────────────────────────

function Reveal({
  prompt,
  mine,
  match,
  error,
  onAgain,
  onWall,
  onRetry,
}: {
  prompt: BrainPrompt;
  mine: Vision | null;
  match: ReturnType<typeof useSameBrain>['match'];
  error: boolean;
  onAgain: () => void;
  onWall: () => void;
  onRetry: () => void;
}) {
  if (error || !mine || !match) {
    return (
      <div className="sb-reveal sb-reveal--err">
        <p>{t('retry')}</p>
        <button className="sb-btn sb-btn--primary" onPointerDown={onRetry}>
          {t('again')}
        </button>
      </div>
    );
  }
  const { partner, sync } = match;
  return (
    <div className="sb-reveal">
      <div className="sb-reveal__head">{partner.alterEgo ? t('alterEgoHead') : t('youMatched')}</div>
      <div className="sb-pair sb-pair--reveal">
        <div className="sb-slot sb-slot--mine">
          <img className="sb-slot__img" src={mine.imageUrl} alt="" />
          <span className="sb-slot__tag sb-slot__tag--you">{t('you')}</span>
        </div>
        <div className="sb-sync">
          <span className="sb-sync__pct">{sync}%</span>
          <span className="sb-sync__label">{t('sync')}</span>
        </div>
        <div className="sb-slot sb-slot--them">
          <img className="sb-slot__img" src={partner.imageUrl} alt="" />
          <span className="sb-slot__tag sb-slot__tag--them">
            <PartnerChip vision={partner} accent />
          </span>
        </div>
      </div>
      <div className="sb-reveal__line">
        {partner.alterEgo ? (
          t('alterEgoLine')
        ) : (
          <>
            {t('syncedWith')} <strong>{partner.userName}</strong>
          </>
        )}
      </div>
      <div className="sb-reveal__vec">{vectorLabel(prompt, mine.vector)}</div>
      {partner.alterEgo && <div className="sb-reveal__hint">{t('alterEgoHint')}</div>}
      <div className="sb-actions">
        <button className="sb-btn sb-btn--primary" onPointerDown={onAgain}>
          {t('again')}
        </button>
        <button className="sb-btn" onPointerDown={onWall}>
          {t('seeWall')}
        </button>
      </div>
    </div>
  );
}

// ── Wall ─────────────────────────────────────────────────────────────────────

/** Zoomed-in look at one wall vision — bigger image, its tap-recipe label, the
 *  author (tappable → their Aigram profile), and a heart that pings the author. */
function Detail({
  vision,
  liked,
  onLike,
  onClose,
}: {
  vision: Vision;
  liked: boolean;
  onLike: () => void;
  onClose: () => void;
}) {
  const label = vectorLabel(promptById(vision.promptId), vision.vector);
  return (
    <div className="sb-detail" onClick={onClose}>
      <div className="sb-detail__box" onClick={e => e.stopPropagation()}>
        <button className="sb-detail__close" onPointerDown={onClose} aria-label="close">
          ×
        </button>
        <div className="sb-detail__imgwrap">
          <img className="sb-detail__img" src={vision.imageUrl} alt="" />
        </div>
        {label && <div className="sb-detail__vec">{label}</div>}
        <div className="sb-detail__foot">
          <PartnerChip vision={vision} accent />
          <button
            className={'sb-like' + (liked ? ' sb-like--on' : '')}
            onPointerDown={onLike}
          >
            <Heart filled={liked} size={20} />
            <span>{liked ? t('liked') : t('like')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Wall({
  visions,
  loaded,
  isInAigram,
  likedIds,
  onLike,
  onBack,
}: {
  visions: Vision[];
  loaded: boolean;
  isInAigram: boolean;
  likedIds: Set<string>;
  onLike: (v: Vision) => void;
  onBack: () => void;
}) {
  const [open, setOpen] = useState<Vision | null>(null);
  return (
    <div className="sb-wall">
      <div className="sb-wall__bar">
        <button className="sb-btn sb-btn--ghost" onPointerDown={onBack}>
          ‹ {t('back')}
        </button>
        <div className="sb-wall__title">{t('wallTitle')}</div>
        <span style={{ width: 56 }} />
      </div>
      <p className="sb-wall__sub">{t('wallSub')}</p>
      {!loaded ? (
        <div className="sb-wall__empty">…</div>
      ) : visions.length === 0 ? (
        <div className="sb-wall__empty">
          {isInAigram ? t('wallEmptyFirst') : t('wallEmptyOpen')}
        </div>
      ) : (
        <div className="sb-wall__grid">
          {visions.map(v => (
            // onClick (not onPointerDown) so a finger can scroll past the card.
            <div className="sb-wall__card" key={v.id} onClick={() => setOpen(v)}>
              <img className="sb-wall__img" src={v.imageUrl} alt="" />
              {likedIds.has(v.id) && (
                <span className="sb-wall__heart"><Heart filled size={15} /></span>
              )}
              <div className="sb-wall__foot">
                <PartnerChip vision={v} />
              </div>
            </div>
          ))}
        </div>
      )}
      {open && (
        <Detail
          vision={open}
          liked={likedIds.has(open.id)}
          onLike={() => onLike(open)}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

export default function SameBrain() {
  const g = useSameBrain();
  const [idOpen, setIdOpen] = useState(false);
  const [, setTaps] = useState(0);
  const bumpBrand = () =>
    setTaps(n => {
      const x = n + 1;
      if (x >= 5) setIdOpen(true);
      return x;
    });
  return (
    <div className="sb-root">
      <header className="sb-top">
        <div className="sb-brand" onClick={bumpBrand}>
          <span className="sb-brand__l">Same</span>
          <span className="sb-brand__r">Brain</span>
        </div>
        {g.stats.plays > 0 && g.phase !== 'wall' && (
          <div className="sb-streak">
            <Icon name="brain" size={15} /> {g.stats.plays}
          </div>
        )}
      </header>

      <main className="sb-stage">
        {g.phase === 'intro' && <Intro prompt={g.prompt} onStart={g.start} />}
        {g.phase === 'picking' && (
          <Picker prompt={g.prompt} dimIndex={g.dimIndex} onChoose={g.choose} />
        )}
        {g.phase === 'developing' && <Developing mine={g.myVision} />}
        {g.phase === 'reveal' && (
          <Reveal
            prompt={g.prompt}
            mine={g.myVision}
            match={g.match}
            error={g.error}
            onAgain={g.again}
            onWall={g.openWall}
            onRetry={g.retry}
          />
        )}
        {g.phase === 'wall' && (
          <Wall
            visions={g.wall.visions}
            loaded={g.wall.loaded}
            isInAigram={g.isInAigram}
            likedIds={g.likedIds}
            onLike={g.likeVision}
            onBack={g.closeWall}
          />
        )}
      </main>

      {idOpen && (
        <div className="sb-idcard" onClick={() => setIdOpen(false)}>
          <div className="sb-idcard__box">
            <div className="sb-idcard__label">telegram_id</div>
            <div className="sb-idcard__val">{telegramId || 'null — open inside Aigram'}</div>
            <div className="sb-idcard__hint">tap anywhere to close</div>
          </div>
        </div>
      )}
    </div>
  );
}
