/*************************************************
 * NEIGHBORSOURCE
 * MAIN JAVASCRIPT
 *************************************************/


/*************************************************
 * DATABASE API
 *************************************************/

const API_URL =
  "https://script.google.com/macros/s/AKfycbx4bTHYgVwb9rB66m4hnFKvxtPHrTwe6qoqdERU_eRVb4yg1cdrH1zkeIHHl54573_8/exec";


/*************************************************
 * DATA
 *************************************************/

let providers = [];


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

    <header class="site-header">

      <div class="container nav">

        <a
          class="brand"
          href="index.html"
        >

          <span class="brand-mark">
            🏡
          </span>

          <span>
            NeighborSource
          </span>

        </a>


        <button
          class="menu-btn"
          aria-label="Open menu"
        >
          ☰
        </button>


        <nav class="nav-links">

          <a href="services.html">
            Find Services
          </a>

          <a href="request-help.html">
            I Need Someone
          </a>

          <a href="list-service.html">
            List Your Service
          </a>

          <a href="update-listing.html">
            Update a Listing
          </a>

          <a href="how-it-works.html">
            How It Works
          </a>

          <a
            class="nav-cta"
            href="suggest-provider.html"
          >
            Recommend Someone
          </a>

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
                NeighborSource
              </span>

            </a>


            <p
              class="small"
              style="color:#b9cadb;margin-top:12px"
            >
              Find who your neighbors actually use.
            </p>

          </div>



          <div>

            <h4>
              Find Help
            </h4>

            <a href="services.html">
              Browse Services
            </a>

            <a href="request-help.html">
              Post What You Need
            </a>

            <a href="suggest-provider.html">
              Suggest a Provider
            </a>

          </div>



          <div>

            <h4>
              For Providers
            </h4>

            <a href="list-service.html">
              List Your Service
            </a>

            <a href="update-listing.html">
              Update a Listing
            </a>

            <a href="verification.html">
              Verification
            </a>

          </div>



          <div>

            <h4>
              NeighborSource
            </h4>

            <a href="about.html">
              About
            </a>

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


        <div class="footer-bottom">

          ©
          <span id="year"></span>
          NeighborSource.

        </div>


      </div>

    </footer>

  `;

}


/*************************************************
 * START WEBSITE
 *************************************************/

async function boot() {

  document.body.insertAdjacentHTML(
    "afterbegin",
    header()
  );


  document.body.insertAdjacentHTML(
    "beforeend",
    footer()
  );


  const yearElement =
    document.querySelector(
      "#year"
    );


  if (yearElement) {

    yearElement.textContent =
      new Date().getFullYear();

  }


  const menuButton =
    document.querySelector(
      ".menu-btn"
    );


  if (menuButton) {

    menuButton.addEventListener(
      "click",
      function () {

        document
          .querySelector(
            ".nav-links"
          )
          ?.classList.toggle(
            "open"
          );

      }
    );

  }


  initSearchForms();


  showLoadingState();


  await loadProviders();


  renderDynamic();

}


/*************************************************
 * LOAD PROVIDERS
 *************************************************/

async function loadProviders() {

  try {

    const response =
      await fetch(

        API_URL +
        "?action=providers&t=" +
        Date.now(),

        {

          method:
            "GET",

          redirect:
            "follow",

          cache:
            "no-store"

        }

      );


    if (
      !response.ok
    ) {

      throw new Error(
        "Database request failed."
      );

    }


    const data =
      await response.json();


    if (
      !data.success
    ) {

      throw new Error(
        data.message ||
        "Database error."
      );

    }


    providers =
      Array.isArray(
        data.providers
      )
        ? data.providers
        : [];


    console.log(
      "NeighborSource loaded " +
      providers.length +
      " approved provider(s)."
    );

  }

  catch (error) {

    console.error(
      "NeighborSource database error:",
      error
    );


    providers =
      [];


    showDatabaseError();

  }

}


/*************************************************
 * SEARCH FORMS
 *************************************************/

function initSearchForms() {

  document
    .querySelectorAll(
      "[data-search-form]"
    )
    .forEach(
      function (form) {

        form.addEventListener(
          "submit",
          function (event) {

            event.preventDefault();


            const input =
              form.querySelector(
                "input"
              );


            const query =
              input
                ? input.value.trim()
                : "";


            window.location.href =
              "search.html?q=" +
              encodeURIComponent(
                query
              );

          }
        );

      }
    );

}


/*************************************************
 * CURRENT PAGE
 *************************************************/

function renderDynamic() {

  const path =
    window.location.pathname
      .split("/")
      .pop() ||
    "index.html";


  if (
    path === "index.html" ||
    path === ""
  ) {

    renderHomeCategories();

    renderFeatured();

  }


  if (
    path ===
    "services.html"
  ) {

    renderCategories(
      "all-categories"
    );

  }


  if (
    path ===
    "search.html"
  ) {

    renderSearch();

  }


  if (
    path ===
    "category.html"
  ) {

    renderCategoryPage();

  }


  if (
    path ===
    "provider.html"
  ) {

    renderProvider();

  }

}


/*************************************************
 * HOME CATEGORIES
 *************************************************/

function renderHomeCategories() {

  const element =
    document.querySelector(
      "#home-categories"
    );


  if (!element) {

    return;

  }


  element.innerHTML =
    categories
      .slice(
        0,
        8
      )
      .map(
        function (
          category
        ) {

          const name =
            category[0];


          const icon =
            category[1];


          const description =
            category[2];


          return `

            <a
              class="card category-card"
              href="category.html?name=${encodeURIComponent(name)}"
            >

              <div class="category-icon">
                ${icon}
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
      )
      .join("");

}


/*************************************************
 * ALL CATEGORIES
 *************************************************/

function renderCategories(
  id
) {

  const element =
    document.getElementById(
      id
    );


  if (!element) {

    return;

  }


  element.innerHTML =
    categories
      .map(
        function (
          category
        ) {

          const name =
            category[0];


          const icon =
            category[1];


          const description =
            category[2];


          return `

            <a
              class="card category-card"
              href="category.html?name=${encodeURIComponent(name)}"
            >

              <div class="category-icon">
                ${icon}
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
      )
      .join("");

}


/*************************************************
 * PROVIDER CARD
 *************************************************/

function providerCard(
  provider
) {

  const providerId =
    encodeURIComponent(
      provider.id ||
      ""
    );


  const phone =
    String(
      provider.phone ||
      ""
    );


  const phoneLink =
    phone.replace(
      /\D/g,
      ""
    );


  const areas =
    Array.isArray(
      provider.area
    )
      ? provider.area
      : [];


  const verification =
    Array.isArray(
      provider.verified
    )
      ? provider.verified
      : [];


  const recommendations =
    Number(
      provider.recommendations
    ) ||
    0;


  return `

    <article
      class="card provider-card"
    >

      <div class="small">

        ${escapeHTML(
          provider.type ||
          ""
        )}

        ${
          provider.category
            ? " • "
            : ""
        }

        ${escapeHTML(
          provider.category ||
          ""
        )}

      </div>


      <h3>

        ${escapeHTML(
          provider.name ||
          "Unnamed Provider"
        )}

      </h3>


      <div class="meta">

        <span>

          👍
          ${recommendations}
          recommendation${recommendations === 1 ? "" : "s"}

        </span>


        ${
          areas.length

            ? `

              <span>

                📍
                ${escapeHTML(
                  areas.join(
                    ", "
                  )
                )}

              </span>

            `

            : ""

        }

      </div>


      ${
        verification.length

          ? `

            <div class="badges">

              ${verification
                .slice(
                  0,
                  4
                )
                .map(
                  function (
                    badge
                  ) {

                    return `

                      <span class="badge green">

                        ✓ ${escapeHTML(
                          badge
                        )}

                      </span>

                    `;

                  }
                )
                .join("")
              }

            </div>

          `

          : ""

      }


      ${
        provider.description

          ? `

            <p>

              ${escapeHTML(
                provider.description
              )}

            </p>

          `

          : ""

      }


      <div class="provider-actions">

        <a
          class="btn btn-primary"
          href="provider.html?id=${providerId}"
        >

          View Profile

        </a>


        ${
          phoneLink

            ? `

              <a
                class="btn btn-outline"
                href="tel:${phoneLink}"
              >

                Call

              </a>

            `

            : ""

        }

      </div>

    </article>

  `;

}


/*************************************************
 * FEATURED PROVIDERS
 *************************************************/

function renderFeatured() {

  const element =
    document.querySelector(
      "#featured-providers"
    );


  if (!element) {

    return;

  }


  if (
    !providers.length
  ) {

    element.innerHTML = `

      <div class="card empty-state">

        <h3>
          No providers listed yet
        </h3>

        <p>
          Approved local providers will appear here.
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


  const featuredProviders =
    [...providers]
      .sort(
        function (
          a,
          b
        ) {

          return (
            Number(
              b.recommendations
            ) ||
            0
          ) -
          (
            Number(
              a.recommendations
            ) ||
            0
          );

        }
      )
      .slice(
        0,
        3
      );


  element.innerHTML =
    featuredProviders
      .map(
        providerCard
      )
      .join("");

}


/*************************************************
 * SEARCH
 *************************************************/

function renderSearch() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const query =
    (
      params.get(
        "q"
      ) ||
      ""
    ).trim();


  const queryDisplay =
    document.querySelector(
      "#search-query"
    );


  if (queryDisplay) {

    queryDisplay.textContent =
      query ||
      "all services";

  }


  const searchInput =
    document.querySelector(
      "#search-page-input"
    );


  if (searchInput) {

    searchInput.value =
      query;

  }


  const normalizedQuery =
    query.toLowerCase();


  const results =
    providers.filter(
      function (
        provider
      ) {

        const haystack =
          [

            provider.name ||
              "",

            provider.type ||
              "",

            provider.category ||
              "",

            Array.isArray(
              provider.services
            )
              ? provider.services.join(
                  " "
                )
              : "",

            Array.isArray(
              provider.area
            )
              ? provider.area.join(
                  " "
                )
              : "",

            provider.description ||
              ""

          ]
            .join(
              " "
            )
            .toLowerCase();


        return (
          !normalizedQuery ||
          haystack.includes(
            normalizedQuery
          )
        );

      }
    );


  const resultCount =
    document.querySelector(
      "#result-count"
    );


  if (resultCount) {

    resultCount.textContent =
      results.length +
      " provider" +
      (
        results.length === 1
          ? ""
          : "s"
      ) +
      " found";

  }


  const element =
    document.querySelector(
      "#search-results"
    );


  if (!element) {

    return;

  }


  if (
    !results.length
  ) {

    element.innerHTML = `

      <div class="card empty-state">

        <h3>
          No exact matches yet
        </h3>

        <p>
          Try a broader search or tell the community what you need.
        </p>

        <a
          class="btn btn-green"
          href="request-help.html"
        >
          Post What You Need
        </a>

      </div>

    `;


    return;

  }


  element.innerHTML =
    results
      .map(
        providerCard
      )
      .join("");

}


/*************************************************
 * CATEGORY PAGE
 *************************************************/

function renderCategoryPage() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const name =
    params.get(
      "name"
    ) ||
    "Home & Repair";


  document
    .querySelectorAll(
      "[data-category-name]"
    )
    .forEach(
      function (
        element
      ) {

        element.textContent =
          name;

      }
    );


  const category =
    categories.find(
      function (
        item
      ) {

        return (
          item[0] ===
          name
        );

      }
    ) ||
    [

      name,

      "🛠️",

      "Local providers and services."

    ];


  const categoryIcon =
    document.querySelector(
      "#category-icon"
    );


  if (categoryIcon) {

    categoryIcon.textContent =
      category[1];

  }


  const categoryDescription =
    document.querySelector(
      "#category-desc"
    );


  if (
    categoryDescription
  ) {

    categoryDescription.textContent =
      category[2];

  }


  const results =
    providers.filter(
      function (
        provider
      ) {

        return (
          String(
            provider.category ||
            ""
          ).toLowerCase() ===
          String(
            name
          ).toLowerCase()
        );

      }
    );


  const element =
    document.querySelector(
      "#category-providers"
    );


  if (!element) {

    return;

  }


  if (
    !results.length
  ) {

    element.innerHTML = `

      <div class="card empty-state">

        <h3>
          No providers listed yet
        </h3>

        <p>
          There are currently no approved providers in this category.
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


  element.innerHTML =
    results
      .map(
        providerCard
      )
      .join("");

}


/*************************************************
 * PROVIDER PROFILE
 *************************************************/

async function renderProvider() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const id =
    params.get(
      "id"
    ) ||
    "";


  const provider =
    providers.find(
      function (
        item
      ) {

        return (
          String(
            item.id
          ) ===
          String(
            id
          )
        );

      }
    );


  if (!provider) {

    showProviderNotFound();

    return;

  }


  /**********************************************
   * BASIC INFO
   **********************************************/

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


  document
    .querySelectorAll(
      "#provider-description"
    )
    .forEach(
      function (
        element
      ) {

        element.textContent =
          provider.description ||
          "";

      }
    );


  /**********************************************
   * STATS
   **********************************************/

  setText(
    "#provider-recs",
    Number(
      provider.recommendations
    ) ||
    0
  );


  setText(
    "#provider-rehire",
    Number(
      provider.rehire
    ) ||
    0
  );


  /**********************************************
   * SERVICE AREA
   **********************************************/

  setText(
    "#provider-area",
    Array.isArray(
      provider.area
    )
      ? provider.area.join(
          ", "
        )
      : ""
  );


  /**********************************************
   * PHONE
   **********************************************/

  setText(
    "#provider-phone",
    provider.phone ||
    ""
  );


  const callButton =
    document.querySelector(
      "#provider-call"
    );


  if (callButton) {

    const phone =
      String(
        provider.phone ||
        ""
      ).replace(
        /\D/g,
        ""
      );


    if (phone) {

      callButton.href =
        "tel:" +
        phone;

    }

    else {

      callButton.style.display =
        "none";

    }

  }


  /**********************************************
   * SERVICES
   **********************************************/

  const servicesContainer =
    document.querySelector(
      "#provider-services"
    );


  if (
    servicesContainer
  ) {

    const services =
      Array.isArray(
        provider.services
      )
        ? provider.services
        : [];


    servicesContainer.innerHTML =
      services.length

        ? services
            .map(
              function (
                service
              ) {

                return `

                  <span class="pill">

                    ${escapeHTML(
                      service
                    )}

                  </span>

                `;

              }
            )
            .join("")

        : `

          <span class="small">

            No services listed.

          </span>

        `;

  }


  /**********************************************
   * VERIFICATION
   **********************************************/

  const badges =
    Array.isArray(
      provider.verified
    )
      ? provider.verified
      : [];


  const badgeContainer =
    document.querySelector(
      "#provider-badges"
    );


  if (
    badgeContainer
  ) {

    badgeContainer.innerHTML =
      badges.length

        ? badges
            .map(
              function (
                badge
              ) {

                return `

                  <span class="badge green">

                    ✓ ${escapeHTML(
                      badge
                    )}

                  </span>

                `;

              }
            )
            .join("")

        : `

          <span class="small">

            No verification badges yet.

          </span>

        `;

  }


  updateVerificationStat(
    badges
  );


  /**********************************************
   * RECOMMEND LINK
   **********************************************/

  const recommendLink =
    document.querySelector(
      "#recommend-provider-link"
    );


  if (
    recommendLink
  ) {

    recommendLink.href =
      "recommend.html?providerId=" +
      encodeURIComponent(
        provider.id
      ) +
      "&provider=" +
      encodeURIComponent(
        provider.name
      );

  }


  /**********************************************
   * REPORT LISTING LINK
   *
   * This is the important fix.
   **********************************************/

  let reportLink =
    document.querySelector(
      "#report-provider-link"
    );


  if (
    !reportLink
  ) {

    reportLink =
      document.querySelector(
        'a[href^="report.html"]'
      );

  }


  if (
    reportLink
  ) {

    reportLink.href =
      "report.html?providerId=" +
      encodeURIComponent(
        provider.id
      ) +
      "&provider=" +
      encodeURIComponent(
        provider.name
      );

  }


  /**********************************************
   * UPDATE LISTING LINK
   *
   * If provider.html contains an Update Listing
   * link, it will also automatically carry the
   * provider ID and name.
   **********************************************/

  let updateLink =
    document.querySelector(
      "#update-provider-link"
    );


  if (
    updateLink
  ) {

    updateLink.href =
      "update-listing.html?providerId=" +
      encodeURIComponent(
        provider.id
      ) +
      "&provider=" +
      encodeURIComponent(
        provider.name
      );

  }


  /**********************************************
   * LOAD RECOMMENDATIONS
   **********************************************/

  await loadProviderRecommendations(
    provider.id
  );

}


/*************************************************
 * VERIFIED INFO STAT
 *************************************************/

function updateVerificationStat(
  badges
) {

  const stats =
    document.querySelectorAll(
      ".profile-stats .stat"
    );


  if (
    stats.length <
    3
  ) {

    return;

  }


  const verificationStat =
    stats[2];


  const value =
    verificationStat.querySelector(
      "strong"
    );


  const label =
    verificationStat.querySelector(
      ".small"
    );


  const count =
    Array.isArray(
      badges
    )
      ? badges.length
      : 0;


  if (
    count >
    0
  ) {

    if (value) {

      value.textContent =
        "✓";

    }


    if (label) {

      label.textContent =
        count === 1
          ? "1 Verified Item"
          : count +
            " Verified Items";

    }


    verificationStat.title =
      badges.join(
        ", "
      );

  }

  else {

    if (value) {

      value.textContent =
        "—";

    }


    if (label) {

      label.textContent =
        "Not Verified";

    }


    verificationStat.title =
      "No verification information has been confirmed.";

  }

}


/*************************************************
 * LOAD PROVIDER RECOMMENDATIONS
 *************************************************/

async function loadProviderRecommendations(
  providerId
) {

  try {

    const response =
      await fetch(

        API_URL +
        "?action=recommendations" +
        "&providerId=" +
        encodeURIComponent(
          providerId
        ) +
        "&t=" +
        Date.now(),

        {

          method:
            "GET",

          redirect:
            "follow",

          cache:
            "no-store"

        }

      );


    if (
      !response.ok
    ) {

      return;

    }


    const data =
      await response.json();


    if (
      !data.success ||
      !Array.isArray(
        data.recommendations
      )
    ) {

      return;

    }


    renderRecommendations(
      data.recommendations
    );

  }

  catch (error) {

    console.error(
      "Could not load recommendations:",
      error
    );

  }

}


/*************************************************
 * DISPLAY RECOMMENDATIONS
 *************************************************/

function renderRecommendations(
  recommendations
) {

  const headings =
    Array.from(
      document.querySelectorAll(
        "h2"
      )
    );


  const heading =
    headings.find(
      function (
        element
      ) {

        return (
          element.textContent
            .trim()
            .toLowerCase() ===
          "neighbor recommendations"
        );

      }
    );


  if (!heading) {

    return;

  }


  const card =
    heading.closest(
      ".card"
    );


  if (!card) {

    return;

  }


  if (
    !recommendations.length
  ) {

    card.innerHTML = `

      <h2>
        Neighbor Recommendations
      </h2>

      <p class="small">
        No approved recommendations yet.
      </p>

    `;


    return;

  }


  const recommendationHTML =
    recommendations
      .map(
        function (
          recommendation
        ) {

          const reviewer =
            recommendation.reviewerName

              ? escapeHTML(
                  recommendation.reviewerName
                )

              : "Neighbor";


          const city =
            recommendation.reviewerCity

              ? " from " +
                escapeHTML(
                  recommendation.reviewerCity
                )

              : "";


          const service =
            recommendation.serviceProvided

              ? `

                <div class="small">

                  Service:
                  ${escapeHTML(
                    recommendation.serviceProvided
                  )}

                </div>

              `

              : "";


          const comments =
            recommendation.comments

              ? `

                <p>

                  “${escapeHTML(
                    recommendation.comments
                  )}”

                </p>

              `

              : "";


          const useAgain =
            recommendation.wouldUseAgain

              ? `

                <span class="badge">

                  Would use again:
                  ${escapeHTML(
                    recommendation.wouldUseAgain
                  )}

                </span>

              `

              : "";


          return `

            <div
              style="
                padding:16px 0;
                border-bottom:1px solid var(--line);
              "
            >

              ${comments}

              ${service}


              <div class="badges">

                ${useAgain}

              </div>


              <div class="small">

                ${reviewer}${city}

              </div>


            </div>

          `;

        }
      )
      .join("");


  card.innerHTML = `

    <h2>
      Neighbor Recommendations
    </h2>

    ${recommendationHTML}

  `;

}


/*************************************************
 * PROVIDER NOT FOUND
 *************************************************/

function showProviderNotFound() {

  const main =
    document.querySelector(
      "main"
    );


  if (!main) {

    return;

  }


  main.innerHTML = `

    <section class="section">

      <div class="container">

        <div class="card empty-state">

          <h2>
            Provider Not Found
          </h2>

          <p>
            This provider may have been removed or the link may be incorrect.
          </p>

          <a
            class="btn btn-primary"
            href="services.html"
          >
            Browse Services
          </a>

        </div>

      </div>

    </section>

  `;

}


/*************************************************
 * LOADING
 *************************************************/

function showLoadingState() {

  const ids = [

    "#featured-providers",

    "#search-results",

    "#category-providers"

  ];


  ids.forEach(
    function (
      selector
    ) {

      const element =
        document.querySelector(
          selector
        );


      if (element) {

        element.innerHTML = `

          <div class="card empty-state">

            <p>
              Loading local providers...
            </p>

          </div>

        `;

      }

    }
  );

}


/*************************************************
 * DATABASE ERROR
 *************************************************/

function showDatabaseError() {

  const ids = [

    "#featured-providers",

    "#search-results",

    "#category-providers"

  ];


  ids.forEach(
    function (
      selector
    ) {

      const element =
        document.querySelector(
          selector
        );


      if (element) {

        element.innerHTML = `

          <div class="card empty-state">

            <h3>
              Unable to load providers
            </h3>

            <p>
              NeighborSource could not connect to the provider database.
              Please try again.
            </p>

          </div>

        `;

      }

    }
  );

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


  if (element) {

    element.textContent =
      value ??
      "";

  }

}


/*************************************************
 * HTML SECURITY
 *************************************************/

function escapeHTML(
  value
) {

  return String(
    value ??
    ""
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
 * START
 *************************************************/

document.addEventListener(
  "DOMContentLoaded",
  boot
);
