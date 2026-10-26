import { loadPortfolio } from "./content.js";
import { renderPortfolio, showRenderingFailure } from "./render.js";

loadPortfolio()
  .then(renderPortfolio)
  .catch(showRenderingFailure);
