// The films' fonts, bundled so a cloud (Linux) render looks the same as a Mac one. The Mac fonts the code names
// (Avenir Next, Chalkboard SE, Menlo) are mapped onto free fonts under those same names:
//   "Avenir Next" -> Nunito Sans (400-900), "Chalkboard SE" -> Kalam (400, 700), "Menlo" -> JetBrains Mono (700).
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const faces: [string, string, string][] = [
  ...["400", "500", "600", "700", "800", "900"].map((w): [string, string, string] => ["Avenir Next", w, `fonts/nunito-sans-latin-${w}-normal.woff2`]),
  ["Chalkboard SE", "400", "fonts/kalam-latin-400-normal.woff2"],
  ["Chalkboard SE", "700", "fonts/kalam-latin-700-normal.woff2"],
  ["Menlo", "700", "fonts/jetbrains-mono-latin-700-normal.woff2"],
  ["Menlo", "400", "fonts/jetbrains-mono-latin-700-normal.woff2"],
];
for (const [family, weight, file] of faces) loadFont({ family, url: staticFile(file), weight });
