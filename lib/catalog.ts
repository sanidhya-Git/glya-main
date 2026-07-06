export interface Product {
  id: number;
  name: string;
  cat: string;
  col: string;
  metal: string;
  karat: string;
  gem: string;
  gemValue: number;
  weightG: number;
  makingPct: number;
  tag: string;
  rating: number;
  reviews: number;
  blurb: string;
}

export const catalog: Product[] = [
  {id:1,name:'Aurora Solitaire Ring',cat:'Rings',col:'Solitaire',metal:'Platinum',karat:'PT950',gem:'0.72ct Solitaire',gemValue:185000,weightG:4.2,makingPct:0.12,tag:'Bestseller',rating:4.9,reviews:212,blurb:'A single brilliant-cut diamond raised on a whisper-thin platinum band.'},
  {id:2,name:'Éclat Halo Ring',cat:'Rings',col:'Bridal',metal:'Gold',karat:'18K',gem:'Halo diamonds',gemValue:92000,weightG:3.6,makingPct:0.14,tag:'New',rating:4.8,reviews:64,blurb:'A halo of micro-pavé diamonds encircling a radiant centre stone.'},
  {id:3,name:'Lumière Band',cat:'Rings',col:'Everyday',metal:'Gold',karat:'18K',gem:'',gemValue:0,weightG:2.8,makingPct:0.10,tag:'',rating:4.7,reviews:98,blurb:'A softly rounded everyday band with a brushed-gold finish.'},
  {id:4,name:'Camélia Cluster Ring',cat:'Rings',col:'Statement',metal:'Gold',karat:'18K',gem:'Cluster diamonds',gemValue:64000,weightG:4.9,makingPct:0.16,tag:'Trending',rating:4.8,reviews:41,blurb:'Petals of diamonds gathered like a blooming camellia.'},
  {id:5,name:'Serene Stack Ring',cat:'Rings',col:'Everyday',metal:'Gold',karat:'22K',gem:'',gemValue:0,weightG:2.1,makingPct:0.09,tag:'',rating:4.6,reviews:120,blurb:'A slim stackable ring in warm 22K gold, made to layer.'},
  {id:6,name:'Régale Emerald Ring',cat:'Rings',col:'Statement',metal:'Gold',karat:'18K',gem:'Colombian Emerald',gemValue:78000,weightG:5.1,makingPct:0.15,tag:'',rating:4.9,reviews:33,blurb:'A vivid emerald flanked by tapered baguette diamonds.'},
  {id:7,name:'Céleste Diamond Necklace',cat:'Necklaces',col:'Bridal',metal:'Gold',karat:'18K',gem:'2.4ct diamonds',gemValue:240000,weightG:12.4,makingPct:0.18,tag:'Bestseller',rating:5.0,reviews:88,blurb:'A cascade of graduated diamonds resting at the collarbone.'},
  {id:8,name:"Fils d'Or Chain",cat:'Necklaces',col:'Everyday',metal:'Gold',karat:'22K',gem:'',gemValue:0,weightG:8.2,makingPct:0.11,tag:'',rating:4.7,reviews:150,blurb:'A fluid rope chain in high-purity 22K gold.'},
  {id:9,name:'Aria Pendant',cat:'Necklaces',col:'Everyday',metal:'Gold',karat:'18K',gem:'Diamond drop',gemValue:34000,weightG:3.1,makingPct:0.12,tag:'New',rating:4.8,reviews:76,blurb:'A solitaire drop suspended from a fine cable chain.'},
  {id:10,name:'Héritage Choker',cat:'Necklaces',col:'Heritage',metal:'Gold',karat:'22K',gem:'',gemValue:0,weightG:22.6,makingPct:0.13,tag:'Trending',rating:4.9,reviews:29,blurb:'A hand-woven collar echoing temple-gold tradition.'},
  {id:11,name:'Solstice Layered Necklace',cat:'Necklaces',col:'Everyday',metal:'Gold',karat:'18K',gem:'',gemValue:0,weightG:6.4,makingPct:0.12,tag:'',rating:4.6,reviews:54,blurb:'Two chains pre-layered for effortless dimension.'},
  {id:12,name:'Reine Temple Necklace',cat:'Necklaces',col:'Bridal',metal:'Gold',karat:'22K',gem:'Burmese Ruby',gemValue:130000,weightG:34.0,makingPct:0.16,tag:'',rating:5.0,reviews:18,blurb:'A regal bridal piece set with cabochon rubies.'},
  {id:13,name:'Ondine Bangle',cat:'Bangles',col:'Everyday',metal:'Gold',karat:'22K',gem:'',gemValue:0,weightG:14.8,makingPct:0.10,tag:'',rating:4.7,reviews:82,blurb:'A smooth, weighty bangle with a hidden clasp.'},
  {id:14,name:'Maharani Kada',cat:'Bangles',col:'Heritage',metal:'Gold',karat:'22K',gem:'',gemValue:0,weightG:28.4,makingPct:0.14,tag:'Bestseller',rating:4.9,reviews:47,blurb:'A broad, intricately carved kada in heritage 22K gold.'},
  {id:15,name:'Étoile Diamond Bangle',cat:'Bangles',col:'Statement',metal:'Gold',karat:'18K',gem:'Pavé diamonds',gemValue:156000,weightG:16.2,makingPct:0.17,tag:'',rating:4.8,reviews:26,blurb:'A line of pavé diamonds tracing a slim gold cuff.'},
  {id:16,name:'Duo Twist Bangle',cat:'Bangles',col:'Everyday',metal:'Gold',karat:'18K',gem:'',gemValue:0,weightG:9.6,makingPct:0.11,tag:'New',rating:4.6,reviews:39,blurb:'Two gold strands twisted into one sculptural form.'},
  {id:17,name:'Rosée Stud Earrings',cat:'Earrings',col:'Everyday',metal:'Gold',karat:'18K',gem:'Diamond studs',gemValue:48000,weightG:2.0,makingPct:0.12,tag:'Trending',rating:4.8,reviews:194,blurb:'Classic four-prong diamond studs for every day.'},
  {id:18,name:'Cascade Drop Earrings',cat:'Earrings',col:'Statement',metal:'Gold',karat:'18K',gem:'Diamond drops',gemValue:88000,weightG:4.4,makingPct:0.15,tag:'',rating:4.9,reviews:31,blurb:'Articulated diamonds that move like falling light.'},
  {id:19,name:'Jhumka Héritage',cat:'Earrings',col:'Heritage',metal:'Gold',karat:'22K',gem:'Pearl drops',gemValue:22000,weightG:11.2,makingPct:0.14,tag:'',rating:4.7,reviews:58,blurb:'A traditional jhumka finished with baroque pearls.'},
  {id:20,name:'Petale Hoops',cat:'Earrings',col:'Everyday',metal:'Gold',karat:'18K',gem:'',gemValue:0,weightG:3.2,makingPct:0.10,tag:'New',rating:4.6,reviews:71,blurb:'Featherlight hoops with a petal-brushed surface.'},
  {id:21,name:"Lien d'Amour Bracelet",cat:'Bracelets',col:'Everyday',metal:'Gold',karat:'18K',gem:'Diamond links',gemValue:56000,weightG:5.8,makingPct:0.13,tag:'',rating:4.8,reviews:44,blurb:'Interlocking links punctuated with tiny diamonds.'},
  {id:22,name:'Serpentine Tennis Bracelet',cat:'Bracelets',col:'Statement',metal:'Platinum',karat:'PT950',gem:'3.0ct diamonds',gemValue:320000,weightG:12.0,makingPct:0.18,tag:'Bestseller',rating:5.0,reviews:22,blurb:'A continuous line of matched brilliants in platinum.'},
  {id:23,name:'Charmé Bracelet',cat:'Bracelets',col:'Everyday',metal:'Gold',karat:'22K',gem:'',gemValue:0,weightG:7.4,makingPct:0.10,tag:'',rating:4.6,reviews:63,blurb:'A delicate chain bracelet ready for charms.'},
  {id:24,name:'Aube Cuff',cat:'Bracelets',col:'Statement',metal:'Gold',karat:'18K',gem:'',gemValue:0,weightG:18.6,makingPct:0.13,tag:'Trending',rating:4.8,reviews:37,blurb:'A bold open cuff with a mirror-polished finish.'},
  {id:25,name:'Vœu Eternity Band',cat:'Rings',col:'Bridal',metal:'Platinum',karat:'PT950',gem:'Full eternity',gemValue:145000,weightG:3.9,makingPct:0.14,tag:'New',rating:4.9,reviews:52,blurb:'Diamonds set all the way around — a promise without end.'},
  {id:26,name:'Nébuleuse Cocktail Ring',cat:'Rings',col:'Statement',metal:'Gold',karat:'18K',gem:'Ceylon Sapphire',gemValue:110000,weightG:6.2,makingPct:0.16,tag:'',rating:4.9,reviews:24,blurb:'A deep sapphire cradled in a swirl of gold and diamonds.'},
  {id:27,name:'Grand Trousseau Set',cat:'Necklaces',col:'Bridal',metal:'Gold',karat:'22K',gem:'Diamond & polki',gemValue:420000,weightG:48.0,makingPct:0.17,tag:'Bestseller',rating:5.0,reviews:14,blurb:'A complete bridal necklace set — the heirloom of the trousseau.'},
  {id:28,name:'Minuit Pendant',cat:'Necklaces',col:'Everyday',metal:'Gold',karat:'18K',gem:'Black diamond',gemValue:41000,weightG:2.6,makingPct:0.12,tag:'',rating:4.7,reviews:48,blurb:'A single black diamond on a fine midnight-gold chain.'},
];

export function karatFactor(k: string) {
  if (k === '22K') return 0.916;
  if (k === '18K') return 0.75;
  return 0.95; // PT950
}

export function priceOf(p: Product, karat?: string, goldRate = 7180) {
  const k = karat || p.karat;
  const metalRate = p.metal === 'Platinum' ? 3380 : goldRate;
  const mv = Math.round(p.weightG * metalRate * karatFactor(k));
  const mk = Math.round(mv * p.makingPct);
  const gem = p.gemValue || 0;
  const sub = mv + mk + gem;
  const gst = Math.round(sub * 0.03);
  return { mv, mk, gem, gst, sub, total: sub + gst };
}

export function metalLabel(p: Product) {
  return p.metal === 'Platinum' ? 'Platinum 950' : `${p.karat} Yellow Gold`;
}

export function inr(n: number) {
  n = Math.round(n);
  const neg = n < 0;
  n = Math.abs(n);
  const s = String(n);
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const g = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' : '';
  return (neg ? '−' : '') + '₹' + g + last3;
}

export function sizeInfo(p: Product) {
  switch (p.cat) {
    case 'Rings': return { label: 'Ring size (Indian)', opts: ['6','8','10','12','14','16','18','20'] };
    case 'Bangles': return { label: 'Bangle size (inch)', opts: ['2.2','2.4','2.6','2.8'] };
    case 'Necklaces': return { label: 'Chain length', opts: ['16"','18"','20"','22"'] };
    case 'Bracelets': return { label: 'Length', opts: ['6.5"','7"','7.5"'] };
    default: return null;
  }
}

export const journalPosts = [
  {id:'j1',category:'Buying Guide',title:'How to read a diamond certificate',excerpt:'Cut, colour, clarity and carat — what the four Cs really mean when you hold an IGI report in your hands.',date:'28 Jun 2026',read:'6 min read',author:'Ananya Krishnan',authorRole:'Head of Gemology',shop:[7,1,18],
    lede:'A certificate is a diamond\'s passport — but reading one takes a little fluency. Here is how to look past the logo and understand exactly what you are buying.',
    body:[
      {t:'p',x:'Every Glya diamond ships with an IGI grading report, an independent assessment of the stone\'s quality. The document can look intimidating, but it resolves into four ideas — the famous four Cs — plus a few marks of authenticity.'},
      {t:'h',x:'Cut is the one that makes it sparkle'},
      {t:'p',x:'Of the four, cut has the greatest effect on brilliance. It measures how well a diamond\'s facets return light to the eye. An Excellent or Ideal cut will out-sparkle a larger stone with a poor cut, which is why we grade cut before size.'},
      {t:'q',x:'A well-cut half-carat can hold more light than a carat that was cut for weight.'},
      {t:'h',x:'Colour and clarity, in plain terms'},
      {t:'p',x:'Colour runs from D (icy white) to Z (warm). For white diamonds we source D–H, where the eye reads the stone as colourless. Clarity grades the tiny inclusions inside; anything VS or better is invisible without magnification.'},
      {t:'p',x:'Finally, check that the report number is laser-inscribed on the girdle of the stone. That inscription ties the certificate to the exact diamond in your ring — the detail that turns a promise into proof.'},
    ]},
  {id:'j2',category:'Jewelry Education',title:'22K, 18K, or platinum: choosing your metal',excerpt:'Purity, durability and colour — a practical guide to picking the right metal for everyday wear versus heirloom pieces.',date:'21 Jun 2026',read:'5 min read',author:'Rhea Menon',authorRole:'Design Director',shop:[13,3,25],
    lede:'The metal you choose shapes how a piece wears, ages and holds a stone. Here is how we think about it in the atelier.',
    body:[
      {t:'p',x:'22K gold is 91.6% pure — rich, warm and traditional, the gold of heirloom bangles and temple jewelry. Its softness makes it perfect for pieces admired more than knocked about.'},
      {t:'h',x:'When we reach for 18K'},
      {t:'p',x:'18K gold (75% pure) is harder, which makes it our default for rings and anything that holds diamonds securely for decades. It takes a crisp polish and a range of tones, from yellow to rose.'},
      {t:'p',x:'Platinum is the most durable of all and naturally white, so it never needs re-plating. It is denser — a platinum band feels reassuringly weighty — and it is our choice for solitaire settings meant to last generations.'},
    ]},
  {id:'j3',category:'Care',title:'Caring for gold and diamonds at home',excerpt:'Five minutes a month keeps fine jewelry brilliant. A gentle at-home ritual, and when to bring it to us.',date:'12 Jun 2026',read:'4 min read',author:'Ananya Krishnan',authorRole:'Head of Gemology',shop:[17,20],
    lede:'Fine jewelry asks for very little — but a light, regular ritual keeps it looking the way it did on the first day.',
    body:[
      {t:'p',x:'Warm water, a drop of mild soap and a soft brush lift the everyday film of lotion and dust that dulls a diamond. Rinse, pat dry with a lint-free cloth, and your stone returns to full sparkle.'},
      {t:'h',x:'What to avoid'},
      {t:'p',x:'Keep pieces away from chlorine, perfume and abrasive cleaners. Store each piece separately so harder stones do not scratch softer metals — the pouch your jewelry arrived in is made for exactly this.'},
      {t:'p',x:'Once a year, bring your pieces to us for a professional clean and a prong check. It is complimentary for life, and it is the surest way to keep a stone safely set.'},
    ]},
  {id:'j4',category:'Bridal',title:'Building a bridal trousseau that lasts',excerpt:'Beyond the wedding day — how to choose bridal jewelry you will reach for long after the celebrations.',date:'4 Jun 2026',read:'7 min read',author:'Rhea Menon',authorRole:'Design Director',shop:[7,12,27],
    lede:'The best bridal jewelry does double duty: unforgettable on the day, and quietly wearable for the decades that follow.',
    body:[
      {t:'p',x:'We encourage brides to think in two layers — the statement pieces for the ceremony, and the versatile ones that slip into everyday life afterwards. A grand necklace set anchors the look; a pair of diamond studs and a slim bangle carry it forward.'},
      {t:'h',x:'Invest where it shows'},
      {t:'p',x:'Put the budget into the pieces closest to the face — earrings and the central necklace — where craftsmanship reads most. Supporting pieces can be simpler without diminishing the whole.'},
      {t:'q',x:'Choose one heirloom to keep, not ten you will only wear once.'},
      {t:'p',x:'Above all, choose pieces certified and insured. A trousseau is often the largest jewelry purchase of a lifetime, and documentation protects its value for the next generation.'},
    ]},
  {id:'j5',category:'Behind the Design',title:'Inside the Céleste collection',excerpt:'From a sketch of falling light to a cascade of graduated diamonds — the making of our signature necklace.',date:'26 May 2026',read:'5 min read',author:'Rhea Menon',authorRole:'Design Director',shop:[7,9],
    lede:'Céleste began with a single question: what would it look like to wear falling light at the collarbone?',
    body:[
      {t:'p',x:'The collection started as a series of charcoal sketches — arcs of diamonds that seemed to spill downward. Translating that motion into metal took eleven prototypes and a new way of graduating stone sizes by tenths of a millimetre.'},
      {t:'h',x:'The engineering of ease'},
      {t:'p',x:'A necklace that moves like water has to be jointed like water. Our workshop developed a hidden articulated link so the piece follows the neck rather than sitting stiffly against it.'},
      {t:'p',x:'The result is a necklace that feels weightless despite its 2.4 carats — proof that the hardest craftsmanship is the kind you never notice.'},
    ]},
  {id:'j6',category:'Buying Guide',title:'Understanding making charges',excerpt:'Why two gold pieces of the same weight can cost differently — making charges, wastage, and transparent pricing.',date:'18 May 2026',read:'5 min read',author:'Karan Shah',authorRole:'Finance & Pricing',shop:[14,8],
    lede:'If our prices update with the live gold rate, where do the differences between pieces come from? The answer is making charges.',
    body:[
      {t:'p',x:'The metal value of a piece is simple arithmetic: weight times the day\'s rate times purity. Everything above that reflects the craft — the hours of hand-work, the complexity of the setting, and the small amount of gold lost in the process.'},
      {t:'h',x:'Making versus wastage'},
      {t:'p',x:'Making charges pay for labour and finishing. Wastage accounts for the gold that is unavoidably lost when metal is melted, drawn and filed. We show both as explicit line items so you always see exactly what you are paying for.'},
      {t:'p',x:'That is the logic behind our live breakdown on every product page: metal, wastage, making, and GST, adding up in front of you. No hidden markup, no mystery.'},
    ]},
];
