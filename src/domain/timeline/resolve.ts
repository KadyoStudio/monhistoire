/**
 * Résolution des dates floues et ordonnancement de la frise.
 *
 * Un jalon ne stocke pas une date mais une période approximative. Le libellé
 * prononcé est ce qui s'affiche ; les années estimées ne servent qu'au
 * classement. Cette fonction ne produit donc jamais de texte destiné à
 * l'utilisateur — seulement un ordre et un intervalle.
 *
 * Trois principes :
 *   - Un jalon relatif à un jalon flou hérite du flou, il ne le durcit pas.
 *   - Un jalon qu'on ne peut pas situer n'est pas rangé en fin de frise, il
 *     part dans « à situer ». Le mettre à la fin affirmerait qu'il vient après
 *     tout le reste, ce qui est faux.
 *   - Aucune déduction n'est présentée comme certaine.
 *
 * Fonction pure, sans accès à la base : elle se teste sans rien démarrer.
 */

export type Precision = "EXACTE" | "APPROXIMATIVE" | "RELATIVE" | "INCONNUE";

/** Structurellement compatible avec le modèle Prisma `Milestone`. */
export interface MilestoneInput {
  id: string;
  label: string;
  startYear: number | null;
  endYear: number | null;
  precision: Precision;
  relativeToId: string | null;
  /** Signé : -2 = deux ans avant le jalon de référence. */
  relativeOffsetY: number | null;
}

export interface ResolvedMilestone {
  milestone: MilestoneInput;
  /** Bornes de l'intervalle estimé. `null` si le jalon n'a pas pu être situé. */
  earliest: number | null;
  latest: number | null;
  /** Nombre de sauts jusqu'à une ancre absolue. 0 = ancre directe. */
  chainLength: number;
}

export interface Timeline {
  /** Ordonnés du plus ancien au plus récent. */
  situated: ResolvedMilestone[];
  /**
   * Zone « à situer », dans l'ordre d'entrée. Aucun marqueur négatif ne doit
   * l'accompagner à l'affichage : ni gris, ni pointillés, ni compteur.
   */
  toSituate: ResolvedMilestone[];
}

/**
 * Élargissement appliqué de part et d'autre d'une année selon sa précision.
 * « vers 1960 » et « au début des années soixante » couvrent tous deux une
 * poignée d'années — trois de chaque côté est un compromis, pas une vérité.
 */
const MARGIN_BY_PRECISION: Record<Precision, number> = {
  EXACTE: 0,
  APPROXIMATIVE: 3,
  RELATIVE: 0, // hérite de sa référence, n'élargit pas davantage
  INCONNUE: 0,
};

interface Interval {
  earliest: number;
  latest: number;
  chainLength: number;
}

/**
 * Intervalle d'un jalon qui porte lui-même une année. Renvoie `null` si le
 * jalon n'a aucune ancre absolue — il devra alors passer par un rattachement.
 */
function absoluteInterval(m: MilestoneInput): Interval | null {
  if (m.startYear === null && m.endYear === null) return null;

  const margin = MARGIN_BY_PRECISION[m.precision];
  const start = m.startYear ?? (m.endYear as number);
  const end = m.endYear ?? (m.startYear as number);

  // Un narrateur peut donner ses années à l'envers. On ne le corrige pas dans
  // ses mots, seulement dans le classement.
  const low = Math.min(start, end);
  const high = Math.max(start, end);

  return { earliest: low - margin, latest: high + margin, chainLength: 0 };
}

/**
 * Ordonne la frise à partir de dates floues et de rattachements relatifs.
 *
 * Les rattachements se propagent par passes successives : « deux ans après mon
 * mariage », le mariage étant lui-même « vers 1955 ». Un cycle de
 * rattachements ne se résout jamais et part dans « à situer » — aucun de ses
 * membres n'a d'ancre, donc aucun ne peut en fournir une aux autres.
 */
export function resolveTimeline(milestones: MilestoneInput[]): Timeline {
  const byId = new Map<string, MilestoneInput>();
  for (const m of milestones) byId.set(m.id, m);

  const resolved = new Map<string, Interval>();

  // Passe 1 — les ancres absolues. Une année donnée par le narrateur prime
  // toujours sur un rattachement relatif qu'il aurait aussi exprimé.
  for (const m of milestones) {
    const interval = absoluteInterval(m);
    if (interval !== null) resolved.set(m.id, interval);
  }

  // Passe 2 — propagation des rattachements, jusqu'à stabilisation. Chaque
  // tour résout au moins un jalon, sinon la boucle s'arrête : le nombre de
  // tours est donc borné par le nombre de jalons.
  let progressed = true;
  while (progressed) {
    progressed = false;

    for (const m of milestones) {
      if (resolved.has(m.id)) continue;
      if (m.relativeToId === null) continue;

      const base = resolved.get(m.relativeToId);
      if (base === undefined) continue; // référence absente, ou pas encore résolue

      const offset = m.relativeOffsetY ?? 0;
      resolved.set(m.id, {
        earliest: base.earliest + offset,
        latest: base.latest + offset,
        chainLength: base.chainLength + 1,
      });
      progressed = true;
    }
  }

  const situated: ResolvedMilestone[] = [];
  const toSituate: ResolvedMilestone[] = [];

  for (const m of milestones) {
    const interval = resolved.get(m.id);
    if (interval === undefined) {
      toSituate.push({ milestone: m, earliest: null, latest: null, chainLength: 0 });
    } else {
      situated.push({
        milestone: m,
        earliest: interval.earliest,
        latest: interval.latest,
        chainLength: interval.chainLength,
      });
    }
  }

  // Tri déterministe : le plus ancien d'abord, puis le plus resserré, puis le
  // libellé. Deux appels sur les mêmes données donnent toujours le même ordre.
  situated.sort((a, b) => {
    const byEarliest = (a.earliest as number) - (b.earliest as number);
    if (byEarliest !== 0) return byEarliest;

    const byLatest = (a.latest as number) - (b.latest as number);
    if (byLatest !== 0) return byLatest;

    return a.milestone.label.localeCompare(b.milestone.label, "fr");
  });

  return { situated, toSituate };
}
