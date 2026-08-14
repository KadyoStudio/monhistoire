import { describe, it, expect } from "vitest";
import { resolveTimeline, type MilestoneInput, type Precision } from "./resolve";

function jalon(
  id: string,
  label: string,
  opts: Partial<Omit<MilestoneInput, "id" | "label">> = {},
): MilestoneInput {
  return {
    id,
    label,
    startYear: opts.startYear ?? null,
    endYear: opts.endYear ?? null,
    precision: opts.precision ?? ("INCONNUE" as Precision),
    relativeToId: opts.relativeToId ?? null,
    relativeOffsetY: opts.relativeOffsetY ?? null,
  };
}

describe("resolveTimeline — ancres absolues", () => {
  it("situe un jalon daté exactement, sans marge", () => {
    const { situated, toSituate } = resolveTimeline([
      jalon("a", "Ma naissance", { startYear: 1938, precision: "EXACTE" }),
    ]);

    expect(toSituate).toHaveLength(0);
    expect(situated).toHaveLength(1);
    expect(situated[0]).toMatchObject({ earliest: 1938, latest: 1938, chainLength: 0 });
  });

  it("élargit une année approximative de part et d'autre", () => {
    const { situated } = resolveTimeline([
      jalon("a", "Vers 1960", { startYear: 1960, precision: "APPROXIMATIVE" }),
    ]);

    expect(situated[0]).toMatchObject({ earliest: 1957, latest: 1963 });
  });

  it("traite une période comme un intervalle, pas comme un point", () => {
    const { situated } = resolveTimeline([
      jalon("a", "Mes années à Lyon", {
        startYear: 1962,
        endYear: 1974,
        precision: "EXACTE",
      }),
    ]);

    expect(situated[0]).toMatchObject({ earliest: 1962, latest: 1974 });
  });

  it("classe correctement des années données à l'envers, sans corriger le récit", () => {
    const input = jalon("a", "De 74 à 62", {
      startYear: 1974,
      endYear: 1962,
      precision: "EXACTE",
    });
    const { situated } = resolveTimeline([input]);

    expect(situated[0]).toMatchObject({ earliest: 1962, latest: 1974 });
    // Le libellé et les années saisies ne sont pas touchés.
    expect(situated[0].milestone.startYear).toBe(1974);
  });
});

describe("resolveTimeline — rattachements relatifs", () => {
  it("résout « deux ans après » une ancre exacte", () => {
    const { situated, toSituate } = resolveTimeline([
      jalon("mariage", "Mon mariage", { startYear: 1955, precision: "EXACTE" }),
      jalon("claire", "La naissance de Claire", {
        precision: "RELATIVE",
        relativeToId: "mariage",
        relativeOffsetY: 2,
      }),
    ]);

    expect(toSituate).toHaveLength(0);
    const claire = situated.find((r) => r.milestone.id === "claire");
    expect(claire).toMatchObject({ earliest: 1957, latest: 1957, chainLength: 1 });
  });

  it("hérite du flou de sa référence sans le durcir", () => {
    const { situated } = resolveTimeline([
      jalon("mariage", "Mon mariage", { startYear: 1955, precision: "APPROXIMATIVE" }),
      jalon("claire", "La naissance de Claire", {
        precision: "RELATIVE",
        relativeToId: "mariage",
        relativeOffsetY: 2,
      }),
    ]);

    const claire = situated.find((r) => r.milestone.id === "claire");
    // L'intervalle du mariage est [1952, 1958] : celui de Claire est décalé de
    // deux ans et garde exactement la même largeur.
    expect(claire).toMatchObject({ earliest: 1954, latest: 1960 });
  });

  it("propage une chaîne de rattachements de proche en proche", () => {
    const { situated, toSituate } = resolveTimeline([
      // Volontairement déclarés dans le désordre : C dépend de B, B dépend de A.
      jalon("c", "Le déménagement", {
        precision: "RELATIVE",
        relativeToId: "b",
        relativeOffsetY: 5,
      }),
      jalon("b", "Mon premier emploi", {
        precision: "RELATIVE",
        relativeToId: "a",
        relativeOffsetY: 3,
      }),
      jalon("a", "Mon service militaire", { startYear: 1958, precision: "EXACTE" }),
    ]);

    expect(toSituate).toHaveLength(0);
    expect(situated.map((r) => r.milestone.id)).toEqual(["a", "b", "c"]);
    expect(situated[2]).toMatchObject({ earliest: 1966, chainLength: 2 });
  });

  it("accepte un décalage négatif", () => {
    const { situated } = resolveTimeline([
      jalon("a", "Mon mariage", { startYear: 1955, precision: "EXACTE" }),
      jalon("b", "Notre rencontre", {
        precision: "RELATIVE",
        relativeToId: "a",
        relativeOffsetY: -2,
      }),
    ]);

    expect(situated.map((r) => r.milestone.id)).toEqual(["b", "a"]);
    expect(situated[0]).toMatchObject({ earliest: 1953, latest: 1953 });
  });

  it("traite un rattachement sans décalage comme un décalage nul", () => {
    const { situated } = resolveTimeline([
      jalon("a", "Mon mariage", { startYear: 1955, precision: "EXACTE" }),
      jalon("b", "Cette année-là", { precision: "RELATIVE", relativeToId: "a" }),
    ]);

    const b = situated.find((r) => r.milestone.id === "b");
    expect(b).toMatchObject({ earliest: 1955, latest: 1955 });
  });

  it("fait primer une année donnée sur un rattachement également exprimé", () => {
    const { situated } = resolveTimeline([
      jalon("a", "Mon mariage", { startYear: 1955, precision: "EXACTE" }),
      jalon("b", "La naissance de Claire", {
        startYear: 1960,
        precision: "EXACTE",
        relativeToId: "a",
        relativeOffsetY: 2, // contredit l'année donnée : l'année gagne
      }),
    ]);

    const b = situated.find((r) => r.milestone.id === "b");
    expect(b).toMatchObject({ earliest: 1960, chainLength: 0 });
  });
});

describe("resolveTimeline — ce qui ne peut pas être situé", () => {
  it("range un jalon sans aucune ancre dans « à situer »", () => {
    const { situated, toSituate } = resolveTimeline([
      jalon("a", "Quand j'étais à la ferme"),
    ]);

    expect(situated).toHaveLength(0);
    expect(toSituate).toHaveLength(1);
    expect(toSituate[0]).toMatchObject({ earliest: null, latest: null });
  });

  it("ne boucle pas sur un cycle de rattachements et n'en situe aucun membre", () => {
    const { situated, toSituate } = resolveTimeline([
      jalon("a", "Avant B", { precision: "RELATIVE", relativeToId: "b", relativeOffsetY: -1 }),
      jalon("b", "Après A", { precision: "RELATIVE", relativeToId: "a", relativeOffsetY: 1 }),
    ]);

    expect(situated).toHaveLength(0);
    expect(toSituate.map((r) => r.milestone.id)).toEqual(["a", "b"]);
  });

  it("ne boucle pas sur un jalon qui se référence lui-même", () => {
    const { toSituate } = resolveTimeline([
      jalon("a", "Moi-même", { precision: "RELATIVE", relativeToId: "a", relativeOffsetY: 1 }),
    ]);

    expect(toSituate).toHaveLength(1);
  });

  it("range dans « à situer » un rattachement vers un jalon inexistant", () => {
    const { situated, toSituate } = resolveTimeline([
      jalon("a", "Après quelque chose", {
        precision: "RELATIVE",
        relativeToId: "disparu",
        relativeOffsetY: 2,
      }),
    ]);

    expect(situated).toHaveLength(0);
    expect(toSituate).toHaveLength(1);
  });

  it("ne situe pas un jalon rattaché à un membre de cycle", () => {
    const { situated, toSituate } = resolveTimeline([
      jalon("a", "A", { precision: "RELATIVE", relativeToId: "b", relativeOffsetY: -1 }),
      jalon("b", "B", { precision: "RELATIVE", relativeToId: "a", relativeOffsetY: 1 }),
      jalon("c", "C", { precision: "RELATIVE", relativeToId: "a", relativeOffsetY: 4 }),
    ]);

    expect(situated).toHaveLength(0);
    expect(toSituate).toHaveLength(3);
  });

  it("situe ce qui peut l'être et laisse le reste de côté", () => {
    const { situated, toSituate } = resolveTimeline([
      jalon("a", "Ma naissance", { startYear: 1938, precision: "EXACTE" }),
      jalon("b", "Je ne sais plus"),
      jalon("c", "Deux ans après", {
        precision: "RELATIVE",
        relativeToId: "a",
        relativeOffsetY: 2,
      }),
    ]);

    expect(situated.map((r) => r.milestone.id)).toEqual(["a", "c"]);
    expect(toSituate.map((r) => r.milestone.id)).toEqual(["b"]);
  });
});

describe("resolveTimeline — ordre", () => {
  it("ordonne du plus ancien au plus récent", () => {
    const { situated } = resolveTimeline([
      jalon("c", "1970", { startYear: 1970, precision: "EXACTE" }),
      jalon("a", "1938", { startYear: 1938, precision: "EXACTE" }),
      jalon("b", "1955", { startYear: 1955, precision: "EXACTE" }),
    ]);

    expect(situated.map((r) => r.milestone.id)).toEqual(["a", "b", "c"]);
  });

  it("place le plus resserré d'abord à début égal", () => {
    const { situated } = resolveTimeline([
      jalon("large", "Vers 1960", { startYear: 1963, precision: "APPROXIMATIVE" }),
      jalon("precis", "1960", { startYear: 1960, endYear: 1960, precision: "EXACTE" }),
    ]);

    // Les deux commencent à 1960 ; le plus court passe devant.
    expect(situated.map((r) => r.milestone.id)).toEqual(["precis", "large"]);
  });

  it("départage par libellé pour rester déterministe", () => {
    const first = resolveTimeline([
      jalon("x", "Zèbre", { startYear: 1950, precision: "EXACTE" }),
      jalon("y", "Abeille", { startYear: 1950, precision: "EXACTE" }),
    ]);
    const second = resolveTimeline([
      jalon("y", "Abeille", { startYear: 1950, precision: "EXACTE" }),
      jalon("x", "Zèbre", { startYear: 1950, precision: "EXACTE" }),
    ]);

    expect(first.situated.map((r) => r.milestone.label)).toEqual(["Abeille", "Zèbre"]);
    expect(second.situated.map((r) => r.milestone.label)).toEqual(["Abeille", "Zèbre"]);
  });

  it("accepte une frise vide", () => {
    expect(resolveTimeline([])).toEqual({ situated: [], toSituate: [] });
  });

  it("conserve l'ordre d'entrée dans « à situer »", () => {
    const { toSituate } = resolveTimeline([
      jalon("b", "Deuxième"),
      jalon("a", "Premier"),
    ]);

    expect(toSituate.map((r) => r.milestone.id)).toEqual(["b", "a"]);
  });
});
