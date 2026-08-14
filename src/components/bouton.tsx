import type { ComponentProps } from "react";

type Variante = "principal" | "discret";

interface BoutonProps extends ComponentProps<"button"> {
  variante?: Variante;
}

// Un bouton dit ce qui va se passer, avec un verbe, en toutes lettres.
// Jamais d'icône seule. Cible tactile de 56px minimum, garantie par globals.css.

const STYLES: Record<Variante, string> = {
  principal:
    "bg-encre text-papier hover:bg-encre-profonde active:bg-encre-profonde " +
    "disabled:bg-papier-marque disabled:text-encre-profonde/60",
  discret:
    "bg-transparent text-encre underline underline-offset-4 hover:text-encre-profonde",
};

export function Bouton({ variante = "principal", className = "", ...props }: BoutonProps) {
  return (
    <button
      {...props}
      className={
        "w-full px-6 py-4 rounded-doux font-ui text-base leading-tight " +
        "transition-colors disabled:cursor-not-allowed " +
        `${STYLES[variante]} ${className}`
      }
    />
  );
}
