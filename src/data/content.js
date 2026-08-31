// @ts-check

/**
 * Editorial copy.
 *
 * Kept apart from the templates so it can be proofread, translated or replaced
 * without touching markup — and so a copy change never risks a layout change.
 *
 * NOTE: `STANDS[0]` claims certification by the "Jackson Foundation
 * Sustainability Board", which could not be verified. See README.md.
 */

/** @typedef {{ title: string, body: string }} Passage */

/** Four short claims closing the home page. */
/** @type {ReadonlyArray<Passage>} */
export const PILLARS = [
  { title: "Small runs", body: "Forty to sixty pieces per style. When a run sells out we wait until the next one is properly made." },
  { title: "Traceable fibre", body: "Wool, linen and cotton only. We can name the mill for every yarn we buy." },
  { title: "Mended free", body: "Send anything back within two years and we will repair it at no charge." },
  { title: "Made in Punjab", body: "One workshop in Ludhiana, visited monthly, paid above the local garment rate." },
];

/** "What we stand for", on the values page. */
/** @type {ReadonlyArray<Passage>} */
export const STANDS = [
  { title: "Sustainability", body: "We want to be around for a long time, and to do that, we need to look after our planet. That's why our business practices and production methods are fully certified sustainable by the Jackson Foundation Sustainability Board." },
  { title: "Carbon neutral", body: "Whenever possible, we use carbon-neutral production and delivery methods, but sometimes our options are limited. When that happens, we compensate for the carbon emissions by actively contributing to various emission reduction programs." },
  { title: "Quality", body: "In our minds, quality doesn't always have to be only synonymous with high prices. We've worked hard to create products that don't have a high price tag, but that comply with our internal, extremely high quality standards." },
  { title: "Organic", body: "In order to do our share for the planet and its people, we only use sustainably-sourced organic cotton in our fashion. This way, we can do our bit to end modern slavery and third-world poverty, and support small-scale farmers directly." },
];

/** The company history, on the about page. */
/** @type {ReadonlyArray<Passage>} */
export const STORY = [
  { title: "The hat", body: "Two of us, one hat between us, and a long argument about whose it was. We solved it by making a second one, badly, and then a third that was worth keeping." },
  { title: "The long game", body: "The hats turned into knitwear, then shirting, then trousers. What did not change was the batch size or the habit of standing in the workshop while things are made." },
  { title: "Menswear, and then some", body: "We set out to change menswear for the better. Half our customers were buying women's sizes within a year, so the range grew to meet them." },
  { title: "Where we are now", body: "One studio, one workshop, four drops a year, and a repairs bench that stays busy — which we take as the compliment it is." },
];

/** How a garment is made, numbered, on the values page. */
/** @type {ReadonlyArray<Passage & { n: string }>} */
export const STEPS = [
  { n: "01", title: "Fibre we can name", body: "Undyed lambswool, extra-fine merino, organic cotton and European linen. Nothing synthetic in the face cloth, and no blend we cannot separate at the end of a garment's life." },
  { n: "02", title: "Dyed in short baths", body: "Colour is added in small lots using low-water baths, which is why our palette moves slightly between runs. We would rather show the variation than waste the water." },
  { n: "03", title: "Cut and sewn in one place", body: "Every piece is made in a single workshop in Ludhiana. We visit monthly, pay above the local garment rate, and keep the same team season after season." },
  { n: "04", title: "Sent plainly, mended freely", body: "Recycled paper, no plastic, no branded tissue. Within two years we will repair any Saints Crew garment for nothing but the postage." },
];

/** Key/value rows on the contact page. */
export const CONTACT_ROWS = [
  { k: "Email", v: "hello@saintscrew.co.in" },
  { k: "Phone & WhatsApp", v: "+91 123 456 7890" },
  { k: "Studio", v: "Name of street 12, Ludhiana, 141001 — visits by appointment" },
  { k: "Hours", v: "Monday to Saturday, 10am to 7pm IST" },
];

/** The pull quote on the about page. */
export const ABOUT_QUOTE = {
  statement:
    "Fashion industry has been operating on unsustainable business models for too long. We wanted to change and challenge that.",
  // NOTE: the closing mark is a straight quote in the approved copy. Left as written.
  text: "“If you push through that feeling of being scared, that feeling of taking risk, really amazing things can happen.\"",
  attribution: "Marissa Mayer, businesswoman and investor",
};

/** Returns & refunds page, as structured blocks so the markup stays generic. */
export const RETURNS = {
  intro: [
    "You are entitled to cancel your order within 30 days without giving any reason for doing so.",
    "The deadline for canceling an order is 30 days from the date you received the goods or on which a third party you have appointed, who is not the carrier, takes possession of the product delivered.",
  ],
  cancelBefore: "In order to exercise your right of cancellation, you must inform us of your decision by means of a clear statement. You can inform us of your decision by e-mail at ",
  cancelAfter: ".",
  reimburse:
    "We will reimburse you no later than 30 days from the day on which we receive the returned goods. We will use the same means of payment as you used for the order, and you will not incur any fees for such reimbursement.",
  conditionsLead: "In order for the goods to be eligible for a return, please make sure that:",
  conditions: ["The goods were purchased in the last 30 days", "The goods are in the original packaging"],
  exclusionsLead: "The following goods cannot be returned:",
  exclusions: [
    "The supply of goods made to your specifications or clearly personalized.",
    "The supply of goods which according to their nature are not suitable to be returned, for example goods which deteriorate rapidly or where the date of expiry is over.",
    "The supply of goods which are not suitable for return due to health protection or hygiene reasons and were unsealed after delivery.",
    "The supply of goods which are, after delivery, according to their nature, inseparably mixed with other items.",
  ],
  discretion:
    "We reserve the right to refuse returns of any merchandise that does not meet the above return conditions at our sole discretion.",
  returning: [
    "You are responsible for the cost and risk of returning the goods to us. You should send the goods to our studio: Name of street 12, Ludhiana, 141001.",
    "We cannot be held responsible for goods damaged or lost in return shipment. Therefore, we recommend an insured and trackable mail service. We are unable to issue a refund without actual receipt of the goods or proof of received return delivery.",
  ],
  gifts: [
    "If the goods were marked as a gift when purchased and then shipped directly to you, you'll receive a gift credit for the value of your return. Once the returned product is received, a gift certificate will be mailed to you.",
    "If the goods weren't marked as a gift when purchased, or the gift giver had the order shipped to themselves to give it to you later, we will send the refund to the gift giver.",
  ],
  contactBefore: "If you have any questions about our Returns and Refunds Policy, please contact us by e-mail at ",
  contactAfter: ".",
};

/** Size guide page. The chart artwork has not been shot yet — see README.md. */
export const SIZE_GUIDE = {
  intro:
    "A size chart is a document that reflects the measurements for your size range within your brand. Our chart is being photographed with the autumn run; until then, send us your chest and waist measurements and we will tell you which size to take.",
  plateNote: "Size chart artwork goes here",
  ranges:
    "Knitwear and shirting run XS to XL. Trousers run 28 to 36. Both are cut generously — if you are between sizes on a sweater, size down.",
};

/** Copy that belongs to a single component or page and has nowhere better to live. */
export const COPY = {
  announce: "Complimentary shipping on orders over ₹6,000",
  heroEyebrow: "Autumn / Winter 26 — Men & Women",
  heroTitle: "Cloth that keeps its word.",
  heroLede:
    "Knitwear, shirting and trousers cut in small runs from natural fibre. Made to be worn, mended and worn again.",
  materialsTitle: "Four materials, chosen properly.",
  featuredTitle: "This season's quiet favourites",
  bandTitle: "It started with two guys who loved hats.",
  bandBody: [
    "One hat to rule them both, or so we thought. It turned out we were in it for the long game, and we have been on a mission to change menswear for the better ever since — and womenswear soon after.",
    "Everything we make is sustainably produced, in quantities small enough that we know where each garment went.",
  ],
  shopLede: "Natural fibre only, cut in small runs for men and women.",
  noResultsTitle: "Nothing in this combination yet.",
  noResultsBody:
    "We cut in small runs, so some categories sit empty between deliveries. Everything else is still here.",
  aboutTitle: "Two guys, and one hat to rule them both.",
  aboutLede:
    "Or so we thought. It turned out we were in it for the long game, and are on a mission to change menswear for the better.",
  valuesTitle: "All of our products are sustainably made.",
  valuesLede:
    "That claim only means something if we can show the work. Here is how a Saints Crew garment gets made, from fibre to the box it arrives in.",
  contactTitle: "Talk to us",
  contactBody: [
    "Whether you're interested in making an order but require some further information, or want to talk about a partnership opportunity, you can reach us via the below form.",
    "Sizing, alterations, an order that has gone astray — a real person answers, usually within a day.",
  ],
  contactThanksTitle: "Thank you.",
  contactThanksBody: "Your note is with us. We will reply to the address you gave.",
  blogBody:
    "No posts yet. Notes from the workshop — dye lots, mill visits, repairs we did not expect — will be published here as they are written.",
  newsletterTitle: "Four letters a year, no more",
  newsletterBody: "A note when a new run is finished, and nothing in between.",
  newsletterDone: "You're on the list. Welcome.",
  bagEmptyTitle: "Nothing in here yet.",
  bagEmptyBody: "The collection is small on purpose. Have a look.",
  noscript:
    "Knitwear, shirting and trousers cut in small runs from natural fibre. This shop needs JavaScript to browse. You can reach us directly in the meantime.",
};
