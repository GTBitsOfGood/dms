import { Nonprofit } from "./types";

const nonprofits: Nonprofit[] = [
  {
    name: "Hearts2Heart",
    id: "21311",
    donationFormHeadline: "Bring smiles to children",
    donationFormParagraph:
      'Mother Theresa once said, "The needs are great, and none of us, including me, ever do great things. But we can all do small things, with great love, and together we can do something wonderful."',
    colors: {
      primary: "#95C079",
      secondary: "#013042"
    },
    images: {
      logo: "url(/21311_logo.png)",
      background: "url(/21311_backgroundImage.png)"
    }
  },
  {
    name: "American Red Cross",
    id: "46546",
    donationFormHeadline: "You Can Make a Difference",
    donationFormParagraph:
      "Each day, thousands of people – people just like you – provide compassionate care to those in need. Our network of generous donors, volunteers and employees share a mission of preventing and relieving suffering, here at home and around the world. We do this every day because the Red Cross is needed - every day.",
    colors: {
      primary: "#cccccc",
      secondary: "#e11b22"
    },
    images: {
      logo: "url(/46546_logo.jpg)",
      background: "url(/46546_backgroundImage.jpeg)"
    }
  }
];

// Map a non-profit's URL path to Nonprofit object. For now, use id as URL path
const nonprofitsURLMap = new Map<string, Nonprofit>();
nonprofits.forEach(
  nonprofit => void nonprofitsURLMap.set(nonprofit.id, nonprofit)
);

const DEFAULT_NON_PROFIT_URL = nonprofitsURLMap.keys().next().value;

export { DEFAULT_NON_PROFIT_URL, nonprofitsURLMap };