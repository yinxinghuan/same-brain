import { useEffect, useState } from 'react';
import { openAigramProfile, telegramId } from '@shared/runtime';
import { useSameBrain } from './hooks/useSameBrain';
import { vectorLabel } from './utils/compose';
import { twinsOf, type Twin } from './utils/match';
import { frameFor, frameName } from './utils/frame';
import { formatCountdown } from './utils/cadence';
import { loc, t } from './i18n';
import { Icon, ColorSwatch, Monogram } from './assets/icons';
import type { Vision } from './types';
import { promptById, type BrainPrompt } from './data/prompts';
import './SameBrain.less';

const isUrl = (s?: string) => !!s && /^https?:\/\//.test(s);

/** A vision's image inside its identity frame (polaroid / film / stamp / …),
 *  derived from the player's choices so twins share a frame. */
function Framed({ vision, size }: { vision: Vision; size?: 'sm' | 'lg' }) {
  const sz = size ? ' sb-fr--' + size : '';
  return (
    <div className={'sb-fr sb-fr--' + frameFor(vision.vector) + sz}>
      <img className="sb-fr__img" src={vision.imageUrl} alt="" draggable={false} />
    </div>
  );
}

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

function Intro({
  prompt,
  previewIdx,
  onStart,
  onWall,
}: {
  prompt: BrainPrompt;
  previewIdx: number[];
  onStart: () => void;
  onWall: () => void;
}) {
  const previews = previewIdx.map(i => prompt.dims[0].options[i]).slice(0, 6);
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
      <div className="sb-intro__cadence">{t('introCadence')}</div>
      <button
        className="sb-intro__wall"
        onPointerDown={e => {
          e.stopPropagation();
          onWall();
        }}
      >
        {t('seeWall')} ›
      </button>
    </div>
  );
}

// ── Picker ─────────────────────────────────────────────────────────────────

function Picker({
  prompt,
  dimIndex,
  tiles,
  onChoose,
}: {
  prompt: BrainPrompt;
  dimIndex: number;
  /** Pool indices to display for this dim (a sampled subset of the full pool). */
  tiles: number[];
  onChoose: (poolIndex: number) => void;
}) {
  const dim = prompt.dims[dimIndex];
  // Briefly confirm the tapped tile before advancing, so the choice registers
  // and the next question slides in as a connected beat.
  const [picked, setPicked] = useState<number | null>(null);
  // This component is NOT keyed per-dim (only the inner div is), so picked would
  // otherwise leak across dimensions — a stale index could pre-select a tile and
  // its guard would freeze the next question. Reset on every dimension change.
  useEffect(() => setPicked(null), [dimIndex]);
  const choose = (poolIdx: number) => {
    if (picked !== null) return;
    setPicked(poolIdx);
    setTimeout(() => onChoose(poolIdx), 260);
  };
  return (
    <div className="sb-pick" key={dimIndex}>
      <div className="sb-dots">
        {prompt.dims.map((_, i) => (
          <span key={i} className={'sb-dot' + (i <= dimIndex ? ' sb-dot--on' : '')} />
        ))}
      </div>
      <h2 className="sb-pick__ask">{loc(dim.ask)}</h2>
      <div className="sb-tiles">
        {tiles.map((poolIdx, i) => {
          const o = dim.options[poolIdx];
          const cls =
            'sb-tile' +
            (picked === poolIdx ? ' sb-tile--picked' : '') +
            (picked !== null && picked !== poolIdx ? ' sb-tile--mute' : '');
          return (
            <button
              key={poolIdx}
              className={cls}
              style={{ animationDelay: `${i * 0.04}s` }}
              onPointerDown={() => choose(poolIdx)}
            >
              <span className="sb-tile__icon">
                <OptionVisual icon={o.icon} color={o.color} size={34} />
              </span>
              <span className="sb-tile__label">{loc(o.labels)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Developing ───────────────────────────────────────────────────────────────

const DEV_COPY: Array<'reading' | 'finding' | 'almost'> = ['reading', 'finding', 'almost'];

function Developing() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep(s => Math.min(s + 1, DEV_COPY.length - 1)), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="sb-dev">
      <div className="sb-pair">
        <div className="sb-slot sb-slot--mine">
          <div className="sb-slot__shimmer" />
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
  msLeft,
  onWall,
  onRetry,
}: {
  prompt: BrainPrompt;
  mine: Vision | null;
  match: ReturnType<typeof useSameBrain>['match'];
  error: boolean;
  msLeft: number;
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
  // Staged reveal: your image grows in → their image grows in → the verdict
  // (sync% + all the text) lands. Each beat is its own moment instead of
  // everything popping at once.
  return <RevealStaged prompt={prompt} mine={mine} partner={partner} sync={sync} msLeft={msLeft} onWall={onWall} />;
}

function RevealStaged({
  prompt,
  mine,
  partner,
  sync,
  msLeft,
  onWall,
}: {
  prompt: BrainPrompt;
  mine: Vision;
  partner: Vision;
  sync: number;
  msLeft: number;
  onWall: () => void;
}) {
  // 0: only your image · 1: + their image · 2: + the sync verdict & info
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 820);
    const t2 = setTimeout(() => setStage(2), 1750);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  const sameFrame = !partner.alterEgo && frameFor(mine.vector) === frameFor(partner.vector);
  return (
    <div className="sb-reveal">
      {/* reserve the headline's height so the pair doesn't jump when it lands */}
      <div className={'sb-reveal__head' + (stage >= 2 ? ' sb-in' : ' sb-pre')}>
        {partner.alterEgo ? t('alterEgoHead') : t('youMatched')}
      </div>
      <div className="sb-pair sb-pair--reveal">
        <div className="sb-rslot">
          <div className="sb-rgrow"><Framed vision={mine} /></div>
          <span className="sb-rslot__tag sb-rslot__tag--you">{t('you')}</span>
        </div>
        <div className="sb-sync">
          {stage >= 2 ? (
            <>
              <span className="sb-sync__pct sb-syncin">{sync}%</span>
              <span className="sb-sync__label sb-syncin">{t('sync')}</span>
            </>
          ) : (
            <span className="sb-brainpulse"><Icon name="brain" size={24} /></span>
          )}
        </div>
        <div className="sb-rslot">
          {stage >= 1 ? (
            <>
              <div className="sb-rgrow"><Framed vision={partner} /></div>
              <span className="sb-rslot__tag"><PartnerChip vision={partner} accent /></span>
            </>
          ) : (
            <div className="sb-rslot__shim" />
          )}
        </div>
      </div>

      {stage >= 2 && (
        <div className="sb-reveal__info">
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
          {sameFrame && (
            <div className="sb-reveal__frame">
              <span className="sb-frtag">{frameName(frameFor(mine.vector))}</span>
              {t('sameFrameReveal')}
            </div>
          )}
          {partner.alterEgo && <div className="sb-reveal__hint">{t('alterEgoHint')}</div>}
          <div className="sb-reveal__seal">
            <span className="sb-reveal__sealnote">{t('sealedNote')}</span>
            <span className="sb-reveal__count">
              {t('nextReading')} <strong>{formatCountdown(msLeft)}</strong>
            </span>
          </div>
          <div className="sb-actions">
            <button className="sb-btn sb-btn--primary" onPointerDown={onWall}>
              {t('seeWall')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Wall ─────────────────────────────────────────────────────────────────────

/** One stranger who pictured the same thing — their OWN version of the vision,
 *  their face + name (tappable → profile), their frame, and how synced. When
 *  their frame matches the one you opened, it's flagged "same frame". */
function TwinRow({ twin, sameFrame }: { twin: Twin; sameFrame: boolean }) {
  const v = twin.vision;
  const fr = frameFor(v.vector);
  const inner = (
    <>
      <Framed vision={v} size="sm" />
      <Avatar vision={v} size={24} />
      <span className="sb-twin__id">
        <span className="sb-twin__name">{v.userName || t('aStranger')}</span>
        <span className={'sb-twin__frame' + (sameFrame ? ' sb-twin__frame--same' : '')}>
          {sameFrame ? t('sameFrame') : frameName(fr)}
        </span>
      </span>
      <span className="sb-twin__sync">{twin.sync}%</span>
    </>
  );
  if (v.userId) {
    return (
      <button className="sb-twin" onClick={() => openAigramProfile(v.userId!)}>
        {inner}
      </button>
    );
  }
  return <div className="sb-twin">{inner}</div>;
}

/** Zoomed-in look at one wall vision — bigger image, its tap-recipe label, the
 *  author (tappable → their Aigram profile), a heart that pings the author, and
 *  the twins: everyone else who pictured the same thing, with sync%. */
function Detail({
  vision,
  all,
  liked,
  onLike,
  onClose,
}: {
  vision: Vision;
  all: Vision[];
  liked: boolean;
  onLike: () => void;
  onClose: () => void;
}) {
  const label = vectorLabel(promptById(vision.promptId), vision.vector);
  const myFrame = frameFor(vision.vector);
  const twins = twinsOf(vision, all);
  return (
    <div className="sb-detail" onClick={onClose}>
      <div className="sb-detail__box" onClick={e => e.stopPropagation()}>
        <button
          className="sb-detail__close"
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="close"
        >
          ×
        </button>
        <Framed vision={vision} size="lg" />
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
        {label && <div className="sb-detail__vec">{label}</div>}
        <div className="sb-detail__frame">
          <span className="sb-frtag">{frameName(myFrame)}</span>
          <span className="sb-detail__frametip">{t('frameTip')}</span>
        </div>

        <div className="sb-twins">
          <div className="sb-twins__head">
            {twins.length > 0
              ? t('twinsHead') + ' · ' + twins.length
              : t('twinsHead')}
          </div>
          {twins.length > 0 ? (
            <div className="sb-twins__list">
              {twins.map(tw => (
                <TwinRow
                  key={tw.vision.id}
                  twin={tw}
                  sameFrame={frameFor(tw.vision.vector) === myFrame}
                />
              ))}
            </div>
          ) : (
            <div className="sb-twins__empty">{t('twinsNone')}</div>
          )}
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
              <Framed vision={v} />
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
          all={visions}
          liked={likedIds.has(open.id)}
          onLike={() => onLike(open)}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

// ── Boot / Lock ──────────────────────────────────────────────────────────────

function Boot() {
  return (
    <div className="sb-boot">
      <span className="sb-boot__pulse"><Icon name="brain" size={36} /></span>
    </div>
  );
}

/** Shown after you've spent this window's draw: what you pictured, a live
 *  countdown to the next reading, the next theme, and the rule, plus wall access. */
function LockView({
  nextPrompt,
  msLeft,
  lastVision,
  onWall,
}: {
  nextPrompt: BrainPrompt;
  msLeft: number;
  lastVision: Vision | null;
  onWall: () => void;
}) {
  return (
    <div className="sb-lock">
      <div className="sb-lock__badge"><Icon name="brain" size={24} /></div>
      <div className="sb-lock__title">{t('lockTitle')}</div>
      {lastVision && (
        <div className="sb-lock__last">
          <Framed vision={lastVision} />
        </div>
      )}
      <div className="sb-lock__clockwrap">
        <span className="sb-lock__clocklabel">{t('nextReading')}</span>
        <span className="sb-lock__clock">{formatCountdown(msLeft)}</span>
      </div>
      <div className="sb-lock__next">
        <span className="sb-lock__nextlabel">{t('nextTheme')}</span>
        <span className="sb-lock__nexttext">{loc(nextPrompt.setup)}</span>
      </div>
      <div className="sb-lock__rule">{t('ritualRule')}</div>
      <button className="sb-btn sb-btn--primary" onPointerDown={onWall}>
        {t('seeWall')} ›
      </button>
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
        {g.phase === 'boot' && <Boot />}
        {g.phase === 'locked' && (
          <LockView
            nextPrompt={g.nextPrompt}
            msLeft={g.msLeft}
            lastVision={g.lastVision}
            onWall={g.openWall}
          />
        )}
        {g.phase === 'intro' && (
          <Intro
            prompt={g.prompt}
            previewIdx={g.display[0]}
            onStart={g.start}
            onWall={g.openWall}
          />
        )}
        {g.phase === 'picking' && (
          <Picker
            prompt={g.prompt}
            dimIndex={g.dimIndex}
            tiles={g.display[g.dimIndex]}
            onChoose={g.choose}
          />
        )}
        {g.phase === 'developing' && <Developing />}
        {g.phase === 'reveal' && (
          <Reveal
            prompt={g.prompt}
            mine={g.myVision}
            match={g.match}
            error={g.error}
            msLeft={g.msLeft}
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
