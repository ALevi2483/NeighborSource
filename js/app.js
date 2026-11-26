/*************************************************
 * FINDLOCAL757.COM
 * MAIN WEBSITE JAVASCRIPT
 *************************************************/


/*************************************************
 * GOOGLE APPS SCRIPT API
 *************************************************/

const API_URL =
  "https://script.google.com/macros/s/AKfycbx4bTHYgVwb9rB66m4hnFKvxtPHrTwe6qoqdERU_eRVb4yg1cdrH1zkeIHHl54573_8/exec";


/*************************************************
 * PUBLIC PROVIDER DATA
 *************************************************/

let providers = [];

let providerLoadFailed = false;


/*************************************************
 * SERVICE CATEGORIES
 *************************************************/

const categories = [

  [
    "Home & Repair",
    "🏠",
    "Handyman, plumbing, electrical, windows, decks, fences and more."
  ],

  [
    "Lawn & Outdoor",
    "🌿",
    "Lawn care, landscaping, tree work, pressure washing and outdoor projects."
  ],

  [
    "Cleaning",
    "🧹",
    "House cleaning, move-out cleaning, organization and specialty cleaning."
  ],

  [
    "Pets",
    "🐾",
    "Dog walking, pet sitting, boarding, grooming and pet care."
  ],

  [
    "Automotive",
    "🚗",
    "Mobile mechanics, detailing, towing, tires and other vehicle services."
  ],

  [
    "Child Care",
    "🧸",
    "Babysitting, child care, mother's helpers and family support."
  ],

  [
    "Tutoring & Lessons",
    "📚",
    "Academic tutoring, music lessons, coaching and instruction."
  ],

  [
    "Events & Photography",
    "📸",
    "Photography, DJs, party help, event services and rentals."
  ],

  [
    "Moving & Hauling",
    "📦",
    "Moving help, junk removal, hauling and delivery."
  ],

  [
    "Technology",
    "💻",
    "Computer repair, setup, websites, networking and tech support."
  ],

  [
    "Notary & Professional",
    "✍️",
    "Notary, bookkeeping, tax support and other professional services."
  ],

  [
    "Other Services",
    "🛠️",
    "Everything that does not fit another category."
  ]

];


/*************************************************
 * HEADER
 *************************************************/

function header() {

  return `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="index.html" aria-label="FindLocal757.com home">
          <span class="brand-mark" aria-hidden="true">🏡</span>
          <span>FindLocal757.com</span>
        </a>
        <button class="menu-btn" type="button" aria-controls="site-navigation"
          aria-expanded="false">Menu</button>
        <nav class="nav-links" id="site-navigation" aria-label="Main navigation">
          <a href="search.html">Find a Service</a>
          <a href="services.html">Browse Categories</a>
          <a href="list-service.html">List Your Service</a>
          <a href="suggest-provider.html">Recommend Someone</a>
          <a href="update-listing.html">Update a Listing</a>
        </nav>
      </div>
    </header>
  `;

}


/*************************************************
 * FOOTER
 *************************************************/

function footer() {

  return `
    <footer class="footer">

      <div class="container">

        <div class="footer-grid">


          <div>

            <a
              class="brand"
              href="index.html"
              style="color:#fff"
            >

              <span class="brand-mark">
                🏡
              </span>

              <span>
                FindLocal757.com
              </span>

            </a>

            <p
              class="small"
              style="
                color:#b9cadb;
                margin-top:12px;
              "
            >
              Find who your neighbors actually use.
            </p>

          </div>



          <div>

            <h2 class="footer-heading">
              Find Help
            </h2>

            <a href="search.html">
              Find a Service
            </a>

            <a href="services.html">
              Browse Categories
            </a>

            <a href="suggest-provider.html">
              Recommend Someone
            </a>

          </div>



          <div>

            <h2 class="footer-heading">
              For Providers
            </h2>

            <a href="list-service.html">
              List Your Service
            </a>

            <a href="update-listing.html">
              Update a Listing
            </a>

          </div>



          <div>

            <h2 class="footer-heading">
              FindLocal757.com
            </h2>

            <a href="about.html">
              About
            </a>

            <a href="how-it-works.html">How It Works</a>

            <a href="contact.html">
              Contact
            </a>

            <a href="privacy.html">
              Privacy
            </a>

            <a href="terms.html">
              Terms
            </a>

          </div>


        </div>


        <div
          class="footer-disclaimer"
          style="
            margin-top:28px;
            padding-top:24px;
            border-top:1px solid rgba(255,255,255,.16);
            color:#b9cadb;
            font-size:13px;
            line-height:1.65;
          "
        >

          <strong style="color:#fff;">
            Directory Disclaimer:
          </strong>

          FindLocal757.com is a community directory and information resource.
          FindLocal757.com does not recommend, endorse, employ, approve, or
          guarantee any business or individual listed on this site. Provider
          listings and community recommendations are provided for informational
          purposes to help users discover local service providers and contact
          them directly. Always evaluate providers independently and confirm
          important details before hiring or paying anyone.

        </div>


        <div class="footer-bottom">

          © <span id="year"></span> FindLocal757.com.
          Community-powered local service directory.

        </div>

      </div>

    </footer>
  `;

}


/*************************************************
 * START WEBSITE
 *************************************************/

async function boot() {

  injectLayout();

  initNavigation();


  initSubmissionForms();

  const page = currentPage();
  if (page === "index.html" || page === "") renderHomeCategories();
  if (page === "services.html") renderCategories("all-categories");

  if (page === "search.html") initializeSearch();
  if (["", "index.html", "search.html", "category.html", "provider.html"].includes(page)) {
    await loadProviders();
  }
  renderDynamicContent();

}


/*************************************************
 * INSERT HEADER / FOOTER
 *************************************************/

function injectLayout() {

  if (
    !document.querySelector(
      ".site-header"
    )
  ) {

    document.body.insertAdjacentHTML(
      "afterbegin",
      header()
    );

  }


  if (
    !document.querySelector(
      ".footer"
    )
  ) {

    document.body.insertAdjacentHTML(
      "beforeend",
      footer()
    );

  }


  const year =
    document.querySelector(
      "#year"
    );


  if (year) {

    year.textContent =
      new Date()
        .getFullYear();

  }

}


/*************************************************
 * MOBILE NAVIGATION
 *************************************************/

function initNavigation() {

  const button = document.querySelector(".menu-btn");
  const navigation = document.querySelector(".nav-links");
  const current = navigation.querySelector(`a[href="${CSS.escape(currentPage())}"]`);
  current?.setAttribute("aria-current", "page");

  function setOpen(open) {
    navigation.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
  }

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener("click", event => {
    if (!navigation.contains(event.target) && !button.contains(event.target)) {
      setOpen(false);
    }
  });

}


/*************************************************
 * LOAD APPROVED PROVIDERS
 *************************************************/

async function loadProviders() {

  providerLoadFailed =
    false;


  try {

    const url =
      API_URL +
      "?action=providers&_=" +
      Date.now();


    const response =
      await fetch(
        url,
        {
          method:
            "GET",

          cache:
            "no-store",
          signal: AbortSignal.timeout(8000)
        }
      );


    if (
      !response.ok
    ) {

      throw new Error(
        "Provider directory request failed."
      );

    }


    const data =
      await response.json();


    if (
      !data ||
      data.success !== true ||
      !Array.isArray(
        data.providers
      )
    ) {

      throw new Error(
        "Invalid provider response."
      );

    }


    providers =
      data.providers.map(
        normalizeProvider
      );

  }

  catch (error) {

    console.error(
      "Unable to load providers:",
      error
    );


    providers =
      [];


    providerLoadFailed =
      true;

  }

}


/*************************************************
 * NORMALIZE PROVIDER DATA
 *************************************************/

function normalizeProvider(
  provider
) {

  const p =
    provider ||
    {};


  return {

    id:
      String(
        p.id ||
        ""
      ).trim(),

    name:
      String(
        p.name ||
        ""
      ).trim(),

    type:
      String(
        p.type ||
        ""
      ).trim(),

    category:
      String(
        p.category ||
        ""
      ).trim(),

    services:
      normalizeList(
        p.services
      ),

    description:
      String(
        p.description ||
        ""
      ).trim(),

    phone:
      String(
        p.phone ||
        ""
      ).trim(),

    website:
      String(
        p.website ||
        ""
      ).trim(),

    facebook:
      String(
        p.facebook ||
        ""
      ).trim(),

    area:
      normalizeList(
        p.area
      ),

    recommendations:
      safeNumber(
        p.recommendations
      ),

    rehire:
      safeNumber(
        p.rehire
      )

  };

}


/*************************************************
 * NORMALIZE ARRAYS
 *************************************************/

function normalizeList(
  value
) {

  if (
    Array.isArray(
      value
    )
  ) {

    return value
      .map(
        item =>
          String(
            item ||
            ""
          ).trim()
      )
      .filter(
        Boolean
      );

  }


  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return [];

  }


  return String(
    value
  )
    .split(
      /[,;\n]+/
    )
    .map(
      item =>
        item.trim()
    )
    .filter(
      Boolean
    );

}


/*************************************************
 * SAFE NUMBER
 *************************************************/

function safeNumber(
  value
) {

  const number =
    Number(
      value
    );


  if (
    Number.isFinite(
      number
    )
  ) {

    return number;

  }


  return 0;

}


/*************************************************
 * CURRENT PAGE
 *************************************************/

function currentPage() {

  return (
    location.pathname
      .split("/")
      .pop() ||
    "index.html"
  );

}


/*************************************************
 * RENDER PAGE-SPECIFIC CONTENT
 *************************************************/

function renderDynamicContent() {

  const page =
    currentPage();


  if (
    page ===
      "index.html" ||
    page ===
      ""
  ) {

    renderFeatured();

  }


  if (
    page ===
    "search.html"
  ) {

    renderSearch();

  }


  if (
    page ===
    "category.html"
  ) {

    renderCategoryPage();

  }


  if (
    page ===
    "provider.html"
  ) {

    renderProvider();

  }

}


/*************************************************
 * HOME CATEGORIES
 *************************************************/

function renderHomeCategories() {

  const container =
    document.querySelector(
      "#home-categories"
    );


  if (
    !container
  ) {

    return;

  }


  container.innerHTML =
    categories
      .slice(
        0,
        8
      )
      .map(
        categoryCard
      )
      .join("");

}


/*************************************************
 * ALL CATEGORIES
 *************************************************/

function renderCategories(
  elementId
) {

  const container =
    document.getElementById(
      elementId
    );


  if (
    !container
  ) {

    return;

  }


  container.innerHTML =
    categories
      .map(
        categoryCard
      )
      .join("");

}


/*************************************************
 * CATEGORY CARD
 *************************************************/

function categoryCard(
  category
) {

  const [
    name,
    icon,
    description
  ] =
    category;


  return `
    <a
      class="card category-card"
      href="category.html?name=${encodeURIComponent(name)}"
    >

      <div class="category-icon">
        ${escapeHTML(icon)}
      </div>

      <h3>
        ${escapeHTML(name)}
      </h3>

      <div class="small">
        ${escapeHTML(description)}
      </div>

    </a>
  `;

}


/*************************************************
 * CATEGORY SLUG
 *************************************************/

function categorySlug(
  name
) {

  return String(
    name ||
    ""
  )
    .toLowerCase()
    .replace(
      /&/g,
      "and"
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-|-$/g,
      ""
    );

}


/*************************************************
 * PROVIDER CARD
 *************************************************/

function providerCard(
  provider
) {

  const p =
    normalizeProvider(
      provider
    );


  const recommendationLabel =
    p.recommendations ===
      1
      ? "recommendation"
      : "recommendations";


  const areaText =
    p.area.length
      ? p.area.join(
          ", "
        )
      : "Service area not listed";


  const phone = phoneDigits(p.phone);
  const callButton =
    phone
      ? `
          <a
            class="btn btn-outline"
            href="tel:${phone}" aria-label="Call ${escapeHTML(p.name)}"
          >
            Call
          </a>
        `
      : "";


  return `
    <article class="card provider-card">

      <div class="small">
        ${escapeHTML(p.type)}
        ${p.type && p.category ? " • " : ""}
        ${escapeHTML(p.category)}
      </div>


      <h3>
        ${escapeHTML(p.name)}
      </h3>


      <div class="meta">

        <span>
          👍 ${p.recommendations}
          ${recommendationLabel}
        </span>

        <span>
          📍 ${escapeHTML(areaText)}
        </span>

      </div>


      <p>
        ${escapeHTML(
          p.services.length ? p.services.join(", ") : p.description ||
          "No description has been provided yet."
        )}
      </p>


      <div class="provider-actions">

        <a
          class="btn btn-primary"
          aria-label="View profile for ${escapeHTML(p.name)}"
          href="provider.html?id=${encodeURIComponent(p.id)}"
        >
          View Profile
        </a>

        ${callButton}

      </div>

    </article>
  `;

}


/*************************************************
 * FEATURED PROVIDERS
 *************************************************/

function renderFeatured() {

  const container =
    document.querySelector(
      "#featured-providers"
    );


  if (
    !container
  ) {

    return;

  }


  if (
    providerLoadFailed
  ) {

    container.innerHTML =
      directoryUnavailableMessage();

    return;

  }


  if (
    providers.length ===
    0
  ) {

    container.innerHTML =
      `
        <div class="card empty-state">

          <h3>
            The directory is growing
          </h3>

          <p>
            No approved providers are available yet.
          </p>

          <a
            class="btn btn-green"
            href="list-service.html"
          >
            List Your Service
          </a>

        </div>
      `;

    return;

  }


  container.innerHTML =
    rotatingProviders()
      .map(
        providerCard
      )
      .join("");

}


function rotatingProviders() {
  const ordered = [...providers].sort(compareProviderNames);
  const count = Math.min(3, ordered.length);
  const day = Math.floor(Date.now() / 86400000);
  const start = (day * count) % ordered.length;
  return ordered.slice(start, start + count).concat(ordered.slice(0, Math.max(0, start + count - ordered.length)));
}


/*************************************************
 * SEARCH PAGE
 *************************************************/

const searchSynonyms = [
  [/\b(?:grass cut(?:ting)?|mow(?:ing)?(?: (?:the )?lawn)?|lawn mow(?:ing)?|lawn care)\b/g, "lawn"],
  [/\b(?:dog walk(?:ing|er)|walk(?:ing)? dogs?)\b/g, "dog walking"],
  [/\b(?:plumbers?|plumbing)\b/g, "plumb"],
  [/\b(?:electricians?|electrical)\b/g, "electric"],
  [/\b(?:housekeep(?:ing|er)|house clean(?:ing|er))\b/g, "clean"],
];

function normalizeSearch(value) {
  let text = value.toLowerCase().normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ").trim();
  for (const [pattern, replacement] of searchSynonyms) {
    text = text.replace(pattern, replacement);
  }
  return text;
}

const providerNameOrder = new Intl.Collator("en", { sensitivity: "base", numeric: true });

function compareProviderNames(a, b) {
  return providerNameOrder.compare(a.name, b.name) || a.id.localeCompare(b.id);
}

function populateSearchFilter(select, values, selected) {
  const options = new Map();
  for (const value of [...values, selected]) {
    if (value) options.set(value.toLowerCase(), value);
  }
  for (const value of [...options.values()].sort(providerNameOrder.compare)) {
    select.add(new Option(value, value));
  }
  select.value = options.get(selected.toLowerCase()) || "";
}

function initializeSearch() {
  const params = new URLSearchParams(location.search);
  const query = (params.get("q") || "").trim();
  document.querySelector("#search-page-input").value = query;
  document.querySelector("#search-query").textContent = query || "all services";
}

function renderSearch() {
  const params = new URLSearchParams(location.search);
  const query = (params.get("q") || "").trim();
  const city = (params.get("city") || "").trim();
  const category = (params.get("category") || "").trim();
  const cityKey = city.toLowerCase();
  const categoryKey = category.toLowerCase();
  const resultCount = document.querySelector("#result-count");
  const resultContainer = document.querySelector("#search-results");
  populateSearchFilter(document.querySelector("#search-city"), providers.flatMap(p => p.area), city);
  populateSearchFilter(document.querySelector("#search-category"),
    [...categories.map(([name]) => name), ...providers.map(p => p.category)], category);

  if (providerLoadFailed) {
    resultCount.textContent = "Provider results are unavailable.";
    resultContainer.innerHTML = directoryUnavailableMessage();
    return;
  }

  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  const results = providers.filter(provider => {
    if (city && !provider.area.some(area => area.toLowerCase() === cityKey)) return false;
    if (category && provider.category.toLowerCase() !== categoryKey) return false;
    const text = normalizeSearch([
      provider.name, provider.type, provider.category,
      ...provider.services, ...provider.area, provider.description,
    ].join(" "));
    return terms.every(term => text.includes(term));
  }).sort(compareProviderNames);

  resultCount.textContent = `${results.length} provider${results.length === 1 ? "" : "s"} found`;
  if (!results.length) {
    resultContainer.innerHTML = `
      <div class="card empty-state">
        <h3>No matching providers</h3>
        <p>Try a shorter search, clear a city or category filter, or browse all categories.</p>
        <a class="btn btn-outline" href="services.html">Browse Categories</a>
        <a class="btn btn-outline" href="suggest-provider.html">Recommend Someone</a>
      </div>`;
    return;
  }

  const pageSize = 24;
  let shown = 0;
  function showMore() {
    resultContainer.insertAdjacentHTML("beforeend", results.slice(shown, shown + pageSize).map(providerCard).join(""));
    shown = Math.min(shown + pageSize, results.length);
    resultCount.textContent = `Showing ${shown} of ${results.length} providers`;
    more.hidden = shown >= results.length;
  }

  const more = document.querySelector("#search-more");
  more.addEventListener("click", () => {
    const firstNew = shown;
    showMore();
    resultContainer.children[firstNew].querySelector("a").focus();
  });
  resultContainer.replaceChildren();
  showMore();
}


/*************************************************
 * CATEGORY PAGE
 *************************************************/

function renderCategoryPage() {

  const params =
    new URLSearchParams(
      location.search
    );


  const requestedName =
    String(
      params.get(
        "name"
      ) ||
      ""
    ).trim();


  const category =
    categories.find(
      item =>
        item[0] ===
        requestedName
    ) ||
    categories[0];


  const [
    name,
    icon,
    description
  ] =
    category;


  document
    .querySelectorAll(
      "[data-category-name]"
    )
    .forEach(
      element => {

        element.textContent =
          name;

      }
    );


  const iconElement =
    document.querySelector(
      "#category-icon"
    );


  if (
    iconElement
  ) {

    iconElement.textContent =
      icon;

  }


  const descriptionElement =
    document.querySelector(
      "#category-desc"
    );


  if (
    descriptionElement
  ) {

    descriptionElement.textContent =
      description;

  }


  const container =
    document.querySelector(
      "#category-providers"
    );


  if (
    !container
  ) {

    return;

  }


  if (
    providerLoadFailed
  ) {

    container.innerHTML =
      directoryUnavailableMessage();

    return;

  }


  const results =
    providers.filter(
      provider =>
        provider.category.toLowerCase() === name.toLowerCase()
    ).sort(compareProviderNames);


  if (
    results.length ===
    0
  ) {

    container.innerHTML =
      `
        <div class="card empty-state">

          <h3>
            No providers listed yet
          </h3>

          <p>
            No approved providers are currently listed in ${escapeHTML(name)}.
          </p>

          <a
            class="btn btn-green"
            href="list-service.html"
          >
            List a Service
          </a>

        </div>
      `;

    return;

  }


  container.innerHTML =
    results
      .map(
        providerCard
      )
      .join("");

}


/*************************************************
 * PROVIDER PROFILE
 *************************************************/

function renderProvider() {

  const params =
    new URLSearchParams(
      location.search
    );


  const providerId =
    String(
      params.get(
        "id"
      ) ||
      params.get(
        "providerId"
      ) ||
      ""
    ).trim();


  if (
    providerLoadFailed
  ) {

    renderProviderUnavailable(
      "The provider directory is temporarily unavailable."
    );

    return;

  }


  if (
    !providerId
  ) {

    renderProviderUnavailable(
      "No provider was selected."
    );

    return;

  }


  const provider =
    providers.find(
      item =>
        item.id ===
        providerId
    );


  if (
    !provider
  ) {

    renderProviderUnavailable(
      "This provider could not be found or is no longer publicly listed."
    );

    return;

  }


  document.title = `${provider.name} | FindLocal757.com`;
  configureProfileNavigation(provider);


  setText(
    "#provider-name",
    provider.name
  );


  setText(
    "#provider-category",
    [
      provider.type,
      provider.category
    ]
      .filter(
        Boolean
      )
      .join(
        " • "
      )
  );


  setText(
    "#provider-description",
    provider.description ||
    "No provider description has been provided."
  );


  setText(
    "#provider-recs",
    provider.recommendations
  );


  setText(
    "#provider-rehire",
    provider.rehire
  );


  setText(
    "#provider-phone",
    provider.phone ||
    "Not listed"
  );


  renderProviderServices(
    provider.services
  );


  renderProviderAreas(
    provider.area
  );


  configureProviderContact(
    provider
  );


  configureProviderLinks(
    provider
  );


  loadProviderRecommendations(
    provider.id
  );

}


function configureProfileNavigation(provider) {
  const back = document.querySelector("#provider-back");
  if (document.referrer) {
    const previous = new URL(document.referrer);
    const page = previous.pathname.split("/").pop();
    if (previous.origin === location.origin && ["search.html", "category.html", "services.html"].includes(page)) {
      back.href = previous.href;
      back.textContent = page === "search.html" ? "Back to Search Results" : "Back to Services";
    }
  }

  const profileUrl = new URL("provider.html", location.href);
  profileUrl.searchParams.set("id", provider.id);
  const canonical = document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = new URL(profileUrl.search, "https://findlocal757.com/provider.html").href;
  document.head.append(canonical);

  if (!navigator.clipboard) return;
  const copy = document.querySelector("#copy-provider-link");
  const status = document.querySelector("#copy-provider-status");
  copy.hidden = false;
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(canonical.href);
      status.textContent = "Listing link copied.";
    } catch {
      status.textContent = "Could not copy the link. You can copy it from your address bar.";
    }
  });
}


/*************************************************
 * PROVIDER NOT AVAILABLE
 *************************************************/

function renderProviderUnavailable(
  message
) {

  setText(
    "#provider-name",
    "Provider Not Available"
  );


  setText(
    "#provider-category",
    ""
  );


  setText(
    "#provider-description",
    message
  );


  setText(
    "#provider-recs",
    "—"
  );


  setText(
    "#provider-rehire",
    "—"
  );


  setText(
    "#provider-phone",
    "—"
  );


  const services =
    document.querySelector(
      "#provider-services"
    );


  if (
    services
  ) {

    services.innerHTML =
      `<span class="small">${escapeHTML(message)}</span>`;

  }


  const areas =
    document.querySelector(
      "#provider-area"
    );


  if (
    areas
  ) {

    areas.innerHTML =
      `<span class="small">No service-area information available.</span>`;

  }


  const recommendations =
    document.querySelector(
      "#provider-recommendations"
    );


  if (
    recommendations
  ) {

    recommendations.innerHTML =
      "";

  }


  const call =
    document.querySelector(
      "#provider-call"
    );


  if (
    call
  ) {

    call.style.display =
      "none";

  }


  hideElement(
    "#provider-website"
  );


  hideElement(
    "#provider-facebook"
  );

}


/*************************************************
 * PROVIDER SERVICES
 *************************************************/

function renderProviderServices(
  services
) {

  const container =
    document.querySelector(
      "#provider-services"
    );


  if (
    !container
  ) {

    return;

  }


  if (
    !services.length
  ) {

    container.innerHTML =
      `
        <span class="small">
          No specific services have been listed.
        </span>
      `;

    return;

  }


  container.innerHTML =
    services
      .map(
        service =>
          `
            <span class="pill">
              ${escapeHTML(service)}
            </span>
          `
      )
      .join("");

}


/*************************************************
 * PROVIDER AREAS
 *************************************************/

function renderProviderAreas(
  areas
) {

  const container =
    document.querySelector(
      "#provider-area"
    );


  if (
    !container
  ) {

    return;

  }


  if (
    !areas.length
  ) {

    container.innerHTML =
      `
        <span class="small">
          Service area not listed.
        </span>
      `;

    return;

  }


  container.innerHTML =
    areas
      .map(
        area =>
          `
            <span class="pill">
              📍 ${escapeHTML(area)}
            </span>
          `
      )
      .join("");

}


/*************************************************
 * PROVIDER CONTACT LINKS
 *************************************************/

function configureProviderContact(
  provider
) {

  const call =
    document.querySelector(
      "#provider-call"
    );


  if (
    call
  ) {

    if (
      provider.phone &&
      phoneDigits(
        provider.phone
      )
    ) {

      call.href =
        "tel:" +
        phoneDigits(
          provider.phone
        );


      call.style.display =
        "";

    }

    else {

      call.style.display =
        "none";

    }

  }


  configureExternalButton(
    "#provider-website",
    provider.website
  );


  configureExternalButton(
    "#provider-facebook",
    provider.facebook
  );

}


/*************************************************
 * EXTERNAL PROVIDER BUTTON
 *************************************************/

function configureExternalButton(
  selector,
  value
) {

  const element =
    document.querySelector(
      selector
    );


  if (
    !element
  ) {

    return;

  }


  const url =
    safeExternalURL(
      value
    );


  if (
    !url
  ) {

    element.style.display =
      "none";

    element.removeAttribute(
      "href"
    );

    return;

  }


  element.href =
    url;


  element.style.display =
    "";

}


/*************************************************
 * RECOMMEND / UPDATE / REPORT LINKS
 *************************************************/

function configureProviderLinks(
  provider
) {

  const encodedId =
    encodeURIComponent(
      provider.id
    );


  const encodedName =
    encodeURIComponent(
      provider.name
    );


  const recommendationLink =
    document.querySelector(
      "#recommend-provider-link"
    );


  if (
    recommendationLink
  ) {

    recommendationLink.href =
      `recommend.html?providerId=${encodedId}&provider=${encodedName}`;

  }


  const updateLink =
    document.querySelector(
      "#update-provider-link"
    );


  if (
    updateLink
  ) {

    updateLink.href =
      `update-listing.html?providerId=${encodedId}&provider=${encodedName}`;

  }


  const reportLink =
    document.querySelector(
      "#report-provider-link"
    );


  if (
    reportLink
  ) {

    reportLink.href =
      `report.html?providerId=${encodedId}&provider=${encodedName}`;

  }

}


/*************************************************
 * LOAD APPROVED RECOMMENDATIONS
 *************************************************/

async function loadProviderRecommendations(
  providerId
) {

  const container =
    document.querySelector(
      "#provider-recommendations"
    );


  if (
    !container
  ) {

    return;

  }


  container.innerHTML =
    `
      <p class="small">
        Loading recommendations...
      </p>
    `;


  try {

    const url =
      API_URL +
      "?action=recommendations" +
      "&providerId=" +
      encodeURIComponent(
        providerId
      ) +
      "&_=" +
      Date.now();


    const response =
      await fetch(
        url,
        {
          method:
            "GET",

          cache:
            "no-store"
        }
      );


    if (
      !response.ok
    ) {

      throw new Error(
        "Recommendation request failed."
      );

    }


    const data =
      await response.json();


    if (
      !data ||
      data.success !== true ||
      !Array.isArray(
        data.recommendations
      )
    ) {

      throw new Error(
        "Invalid recommendation response."
      );

    }


    renderProviderRecommendations(
      data.recommendations
    );

  }

  catch (error) {

    console.error(
      "Unable to load recommendations:",
      error
    );


    container.innerHTML =
      `
        <p class="small">
          Recommendations are temporarily unavailable.
        </p>
      `;

  }

}


/*************************************************
 * DISPLAY PROVIDER RECOMMENDATIONS
 *************************************************/

function renderProviderRecommendations(
  recommendations
) {

  const container =
    document.querySelector(
      "#provider-recommendations"
    );


  if (
    !container
  ) {

    return;

  }


  if (
    recommendations.length ===
    0
  ) {

    container.innerHTML =
      `
        <div class="empty-state">

          <h3>
            No approved recommendations yet
          </h3>

          <p>
            Used this provider? You can be the first to share your experience.
          </p>

        </div>
      `;

    return;

  }


  container.innerHTML =
    recommendations
      .map(
        recommendation =>
          recommendationCard(
            recommendation
          )
      )
      .join("");

}


/*************************************************
 * RECOMMENDATION CARD
 *************************************************/

function recommendationCard(
  recommendation
) {

  const r =
    recommendation ||
    {};


  const reviewer =
    String(
      r.reviewerName ||
      "Neighbor"
    ).trim();


  const city =
    String(
      r.reviewerCity ||
      ""
    ).trim();


  const service =
    String(
      r.serviceProvided ||
      ""
    ).trim();


  const comments =
    String(
      r.comments ||
      ""
    ).trim();


  const date =
    String(
      r.dateApproved ||
      ""
    ).trim();


  const recommend =
    String(
      r.wouldRecommend ||
      ""
    ).trim();


  const useAgain =
    String(
      r.wouldUseAgain ||
      ""
    ).trim();


  return `
    <article
      style="
        padding:22px 0;
        border-top:1px solid var(--line);
      "
    >

      <div
        style="
          display:flex;
          justify-content:space-between;
          gap:16px;
          flex-wrap:wrap;
        "
      >

        <div>

          <strong>
            ${escapeHTML(reviewer)}
          </strong>

          ${
            city
              ? `
                  <span class="small">
                    • ${escapeHTML(city)}
                  </span>
                `
              : ""
          }

        </div>


        ${
          date
            ? `
                <div class="small">
                  ${escapeHTML(date)}
                </div>
              `
            : ""
        }

      </div>


      ${
        service
          ? `
              <p
                class="small"
                style="margin-top:10px;"
              >
                <strong>Service:</strong>
                ${escapeHTML(service)}
              </p>
            `
          : ""
      }


      <div
        class="badges"
        style="margin-top:12px;"
      >

        ${
          recommend
            ? `
                <span
                  class="badge ${
                    recommend.toLowerCase() ===
                    "yes"
                      ? "green"
                      : ""
                  }"
                >
                  ${
                    recommend.toLowerCase() ===
                    "yes"
                      ? "✓"
                      : ""
                  }
                  Recommend: ${escapeHTML(recommend)}
                </span>
              `
            : ""
        }


        ${
          useAgain
            ? `
                <span
                  class="badge ${
                    useAgain.toLowerCase() ===
                    "yes"
                      ? "green"
                      : ""
                  }"
                >
                  ${
                    useAgain.toLowerCase() ===
                    "yes"
                      ? "✓"
                      : ""
                  }
                  Use Again: ${escapeHTML(useAgain)}
                </span>
              `
            : ""
        }

      </div>


      ${
        comments
          ? `
              <p style="margin-top:14px;">
                ${escapeHTML(comments)}
              </p>
            `
          : ""
      }

    </article>
  `;

}


/*************************************************
 * WEBSITE FORM SUBMISSIONS
 *************************************************/

function initSubmissionForms() {

  document
    .querySelectorAll(
      "form[data-form-type]"
    )
    .forEach(
      form => {

        form.addEventListener(
          "submit",
          event => {

            event.preventDefault();


            submitFindLocal757Form(
              form
            );

          }
        );

      }
    );

}


/*************************************************
 * SUBMIT A FORM
 *************************************************/

async function submitFindLocal757Form(
  form
) {

  if (
    !form
  ) {

    return;

  }


  if (
    !form.checkValidity()
  ) {

    form.reportValidity();

    return;

  }


  const submitButton =
    form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );


  const originalButtonText =
    submitButton
      ? submitButton.textContent
      : "";


  if (
    submitButton
  ) {

    if (submitButton.disabled) return;
    submitButton.disabled =
      true;


    submitButton.textContent =
      "Submitting...";

  }


  setFormStatus(
    form,
    "Submitting...",
    "loading"
  );


  try {

    const formData =
      new FormData(
        form
      );


    const formType =
      String(
        form.dataset.formType ||
        formData.get(
          "type"
        ) ||
        ""
      ).trim();


    if (
      !formType
    ) {

      throw new Error(
        "Submission type is missing."
      );

    }


    formData.set(
      "type",
      formType
    );


    let providerSubmissionId =
      "";


    if (
      formType ===
      "provider"
    ) {

      providerSubmissionId =
        createProviderSubmissionId();


      formData.set(
        "submissionId",
        providerSubmissionId
      );

    }


    const body =
      new URLSearchParams();


    for (
      const [
        key,
        value
      ] of formData.entries()
    ) {

      body.append(
        key,
        String(
          value
        )
      );

    }


    const response =
      await fetch(
        API_URL,
        {

          method:
            "POST",

          headers:
            {

              "Content-Type":
                "application/x-www-form-urlencoded;charset=UTF-8"

            },

          body:
            body.toString()

        }
      );


    if (
      !response.ok
    ) {

      throw new Error(
        "The submission could not be completed."
      );

    }


    const responseText =
      await response.text();


    let data;


    try {

      data =
        JSON.parse(
          responseText
        );

    }

    catch (error) {

      throw new Error(
        "The server returned an unexpected response."
      );

    }


    if (
      !data ||
      data.success !==
        true
    ) {

      throw new Error(
        data &&
        data.message
          ? data.message
          : "The submission could not be completed."
      );

    }


    if (
      formType ===
      "provider"
    ) {

      const submissionId =
        String(
          data.id ||
          providerSubmissionId ||
          ""
        ).trim();


      if (
        submissionId
      ) {

        await confirmProviderSubmission(
          submissionId
        );

      }

    }


    setFormStatus(
      form,
      data.message ||
      successMessageForFormType(
        formType
      ),
      "success"
    );

  }

  catch (error) {

    setFormStatus(
      form,
      error instanceof TypeError
        ? "We could not reach the submission service. Your entries are still here. Please try again."
        : error.message || "Something went wrong. Please try again.",
      "error"
    );

  }

  finally {

    if (
      submitButton
    ) {

      submitButton.disabled =
        false;


      submitButton.textContent =
        originalButtonText;

    }

  }

}


/*************************************************
 * CONFIRM NEW PROVIDER SUBMISSION
 *************************************************/

async function confirmProviderSubmission(
  submissionId
) {

  try {

    const url =
      API_URL +
      "?action=submissionstatus" +
      "&id=" +
      encodeURIComponent(
        submissionId
      ) +
      "&_=" +
      Date.now();


    const response =
      await fetch(
        url,
        {

          method:
            "GET",

          cache:
            "no-store",
          signal: AbortSignal.timeout(8000)

        }
      );


    if (
      !response.ok
    ) {

      return false;

    }


    const data =
      await response.json();


    return Boolean(
      data &&
      data.success === true &&
      data.found === true
    );

  }

  catch (error) {

    console.warn(
      "Provider submission confirmation could not be completed:",
      error
    );


    return false;

  }

}


/*************************************************
 * PROVIDER SUBMISSION ID
 *************************************************/

function createProviderSubmissionId() {

  const timestamp =
    Date.now()
      .toString(
        36
      )
      .toUpperCase();


  const random =
    Math.random()
      .toString(
        36
      )
      .slice(
        2,
        10
      )
      .toUpperCase();


  return (
    "PROV-WEB-" +
    timestamp +
    "-" +
    random
  );

}


/*************************************************
 * FORM SUCCESS MESSAGES
 *************************************************/

function successMessageForFormType(
  type
) {

  switch (
    type
  ) {

    case "provider":

      return "Provider submitted for review.";


    case "recommendation":

      return "Recommendation submitted for review.";


    /*
     * The public service-request page has been
     * retired, but this response is intentionally
     * retained for backward compatibility with
     * the existing backend.
     */

    case "serviceRequest":

      return "Service request submitted.";


    case "providerSuggestion":

      return "Provider suggestion submitted.";


    case "listingUpdate":

      return "Listing update request submitted.";


    case "report":

      return "Report submitted.";


    case "contact":

      return "Message received.";


    default:

      return "Submission received.";

  }

}


/*************************************************
 * FORM STATUS MESSAGE
 *************************************************/

function setFormStatus(
  form,
  message,
  type
) {

  const status =
    form.querySelector(
      "#form-status"
    ) ||
    document.querySelector(
      "#form-status"
    );


  if (
    !status
  ) {

    return;

  }


  status.textContent =
    message;


  status.classList.remove(
    "notice",
    "green",
    "warning"
  );


  if (
    type ===
    "success"
  ) {

    status.classList.add(
      "notice",
      "green"
    );

  }

  else if (
    type ===
    "error"
  ) {

    status.classList.add(
      "notice",
      "warning"
    );

  }

  else if (
    type ===
    "loading"
  ) {

    status.classList.add(
      "notice"
    );

  }

}


/*************************************************
 * DIRECTORY UNAVAILABLE MESSAGE
 *************************************************/

function directoryUnavailableMessage() {

  return `
    <div class="card empty-state">

      <h3>
        The directory is temporarily unavailable
      </h3>

      <p>
        We could not load the provider directory right now. Please try refreshing the page.
      </p>

    </div>
  `;

}


/*************************************************
 * SET TEXT
 *************************************************/

function setText(
  selector,
  value
) {

  const element =
    document.querySelector(
      selector
    );


  if (
    element
  ) {

    element.textContent =
      value === null ||
      value === undefined
        ? ""
        : String(
            value
          );

  }

}


/*************************************************
 * HIDE ELEMENT
 *************************************************/

function hideElement(
  selector
) {

  const element =
    document.querySelector(
      selector
    );


  if (
    element
  ) {

    element.style.display =
      "none";

  }

}


/*************************************************
 * PHONE NUMBER FOR TEL LINK
 *************************************************/

function phoneDigits(
  phone
) {

  return String(
    phone ||
    ""
  )
    .replace(
      /[^\d+]/g,
      ""
    );

}


/*************************************************
 * SAFE EXTERNAL URL
 *************************************************/

function safeExternalURL(
  value
) {

  let url =
    String(
      value ||
      ""
    ).trim();


  if (
    !url
  ) {

    return "";

  }


  if (
    !/^https?:\/\//i.test(
      url
    )
  ) {

    url =
      "https://" +
      url;

  }


  try {

    const parsed =
      new URL(
        url
      );


    if (
      parsed.protocol !==
        "http:" &&
      parsed.protocol !==
        "https:"
    ) {

      return "";

    }


    return parsed.href;

  }

  catch (error) {

    return "";

  }

}


/*************************************************
 * ESCAPE USER-PROVIDED HTML
 *************************************************/

function escapeHTML(
  value
) {

  return String(
    value === null ||
    value === undefined
      ? ""
      : value
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/*************************************************
 * BOOT AFTER PAGE LOAD
 *************************************************/

document.addEventListener(
  "DOMContentLoaded",
  boot
);
