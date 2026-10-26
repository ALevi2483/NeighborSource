const providers = [
  {
    id:"kdh-construction",
    name:"KDH Construction, LLC",
    type:"Business",
    category:"Home & Repair",
    services:["Decks","Fences","Exterior Construction","Repairs"],
    area:["Chesapeake","Suffolk","Portsmouth"],
    recommendations:27,
    rehire:24,
    phone:"757-651-3910",
    website:"#",
    facebook:"#",
    verified:["Phone Verified","Business Verified","License Verified","Insurance Verified"],
    description:"Locally owned construction company specializing in decks, fences, repairs, and exterior residential projects."
  },
  {
    id:"tidewater-lawn-care",
    name:"Tidewater Lawn Care",
    type:"Business",
    category:"Lawn & Outdoor",
    services:["Lawn Mowing","Yard Cleanup","Mulch"],
    area:["Chesapeake","Portsmouth"],
    recommendations:19,
    rehire:18,
    phone:"757-555-0142",
    website:"#",
    facebook:"#",
    verified:["Phone Verified","Business Verified"],
    description:"Residential lawn mowing, cleanup, and seasonal yard services."
  },
  {
    id:"western-branch-mobile-notary",
    name:"Western Branch Mobile Notary",
    type:"Individual",
    category:"Notary & Professional",
    services:["Mobile Notary","Document Witnessing"],
    area:["Chesapeake","Suffolk"],
    recommendations:14,
    rehire:14,
    phone:"757-555-0188",
    website:"#",
    facebook:"#",
    verified:["Phone Verified","Identity Verified"],
    description:"Mobile notary service for homes, offices, and public meeting locations."
  },
  {
    id:"port-rover-pet-care",
    name:"Port Rover Pet Care",
    type:"Business",
    category:"Pets",
    services:["Dog Daycare","Boarding","Dog Walking"],
    area:["Chesapeake","Suffolk"],
    recommendations:31,
    rehire:29,
    phone:"757-555-0120",
    website:"#",
    facebook:"#",
    verified:["Phone Verified","Business Verified"],
    description:"Dog daycare, boarding, and walking services for local families."
  }
];

const categories = [
  ["Home & Repair","🏠","Handyman, plumbing, electrical, windows, decks, fences and more."],
  ["Lawn & Outdoor","🌿","Lawn care, landscaping, tree work, pressure washing and outdoor projects."],
  ["Cleaning","🧹","House cleaning, move-out cleaning, organization and specialty cleaning."],
  ["Pets","🐾","Dog walking, pet sitting, boarding, grooming and pet care."],
  ["Automotive","🚗","Mobile mechanics, detailing, towing, tires and other vehicle services."],
  ["Child Care","🧸","Babysitting, child care, mother's helpers and family support."],
  ["Tutoring & Lessons","📚","Academic tutoring, music lessons, coaching and instruction."],
  ["Events & Photography","📸","Photography, DJs, party help, event services and rentals."],
  ["Moving & Hauling","📦","Moving help, junk removal, hauling and delivery."],
  ["Technology","💻","Computer repair, setup, websites, networking and tech support."],
  ["Notary & Professional","✍️","Notary, bookkeeping, tax support and other professional services."],
  ["Other Services","🛠️","Everything that does not fit another category."]
];

function header(){
  return `
  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="index.html">
        <span class="brand-mark">🏡</span>
        <span>NeighborSource</span>
      </a>

      <button class="menu-btn" aria-label="Open menu">☰</button>

      <nav class="nav-links">
        <a href="services.html">Find Services</a>
        <a href="request-help.html">I Need Someone</a>
        <a href="list-service.html">List Your Service</a>
        <a href="how-it-works.html">How It Works</a>
        <a class="nav-cta" href="suggest-provider.html">
          Recommend Someone
        </a>
      </nav>
    </div>
  </header>`;
}

function footer(){
  return `
  <footer class="footer">
    <div class="container">

      <div class="footer-grid">

        <div>
          <a class="brand" href="index.html" style="color:#fff">
            <span class="brand-mark">🏡</span>
            <span>NeighborSource</span>
          </a>

          <p class="small" style="color:#b9cadb;margin-top:12px">
            Find who your neighbors actually use.
          </p>
        </div>

        <div>
          <h4>Find Help</h4>
          <a href="services.html">Browse Services</a>
          <a href="request-help.html">Post What You Need</a>
          <a href="suggest-provider.html">Suggest a Provider</a>
        </div>

        <div>
          <h4>For Providers</h4>
          <a href="list-service.html">List Your Service</a>
          <a href="update-listing.html">Update a Listing</a>
          <a href="verification.html">Verification</a>
        </div>

        <div>
          <h4>NeighborSource</h4>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
          <a href="privacy.html">Privacy</a>
          <a href="terms.html">Terms</a>
        </div>

      </div>

      <div class="footer-bottom">
        © <span id="year"></span> NeighborSource. Community directory prototype.
      </div>

    </div>
  </footer>`;
}

function boot(){

  document.body.insertAdjacentHTML(
    "afterbegin",
    header()
  );

  document.body.insertAdjacentHTML(
    "beforeend",
    footer()
  );

  document.querySelector("#year")
    ?.replaceChildren(
      document.createTextNode(
        new Date().getFullYear()
      )
    );

  document.querySelector(".menu-btn")
    ?.addEventListener("click", () => {

      document.querySelector(".nav-links")
        ?.classList.toggle("open");

    });

  initSearchForms();

  initDemoForms();

  renderDynamic();
}

function initSearchForms(){

  document.querySelectorAll("[data-search-form]")
    .forEach(form => {

      form.addEventListener("submit", e => {

        e.preventDefault();

        const q =
          form.querySelector("input")
            ?.value.trim() || "";

        location.href =
          `search.html?q=${encodeURIComponent(q)}`;

      });

    });
}

function initDemoForms(){

  document.querySelectorAll("form[data-demo-form]")
    .forEach(form => {

      form.addEventListener("submit", e => {

        e.preventDefault();

        const msg =
          form.querySelector(".success-message");

        if(msg){

          msg.classList.add("show");

          msg.scrollIntoView({
            behavior:"smooth",
            block:"center"
          });

        }

      });

    });
}

function renderDynamic(){

  const path =
    location.pathname
      .split("/")
      .pop() || "index.html";

  if(
    path === "index.html" ||
    path === ""
  ){
    renderHomeCategories();
    renderFeatured();
  }

  if(path === "services.html"){
    renderCategories("all-categories");
  }

  if(path === "search.html"){
    renderSearch();
  }

  if(path === "category.html"){
    renderCategoryPage();
  }

  if(path === "provider.html"){
    renderProvider();
  }

}

function categorySlug(name){

  return name
    .toLowerCase()
    .replace(/&/g,"and")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-|-$/g,"");

}

function renderHomeCategories(){

  const el =
    document.querySelector("#home-categories");

  if(!el) return;

  el.innerHTML =
    categories
      .slice(0,8)
      .map(([name,icon,desc]) => `

        <a
          class="card category-card"
          href="category.html?name=${encodeURIComponent(name)}"
        >

          <div class="category-icon">
            ${icon}
          </div>

          <h3>
            ${name}
          </h3>

          <div class="small">
            ${desc}
          </div>

        </a>

      `)
      .join("");

}

function renderCategories(id){

  const el =
    document.getElementById(id);

  if(!el) return;

  el.innerHTML =
    categories
      .map(([name,icon,desc]) => `

        <a
          class="card category-card"
          href="category.html?name=${encodeURIComponent(name)}"
        >

          <div class="category-icon">
            ${icon}
          </div>

          <h3>
            ${name}
          </h3>

          <div class="small">
            ${desc}
          </div>

        </a>

      `)
      .join("");

}

function providerCard(p){

  return `
    <article class="card provider-card">

      <div class="small">
        ${p.type} • ${p.category}
      </div>

      <h3>
        ${p.name}
      </h3>

      <div class="meta">

        <span>
          👍 ${p.recommendations} recommendations
        </span>

        <span>
          📍 ${p.area.join(", ")}
        </span>

      </div>

      <div class="badges">

        ${p.verified
          .slice(0,3)
          .map(v => `
            <span class="badge green">
              ✓ ${v}
            </span>
          `)
          .join("")
        }

      </div>

      <p>
        ${p.description}
      </p>

      <div class="provider-actions">

        <a
          class="btn btn-primary"
          href="provider.html?id=${encodeURIComponent(p.id)}"
        >
          View Profile
        </a>

        <a
          class="btn btn-outline"
          href="tel:${p.phone.replace(/\D/g,"")}"
        >
          Call
        </a>

      </div>

    </article>
  `;

}

function renderFeatured(){

  const el =
    document.querySelector("#featured-providers");

  if(el){

    el.innerHTML =
      providers
        .slice(0,3)
        .map(providerCard)
        .join("");

  }

}

function renderSearch(){

  const params =
    new URLSearchParams(
      location.search
    );

  const q =
    (params.get("q") || "")
      .trim();

  const qEl =
    document.querySelector("#search-query");

  if(qEl){

    qEl.textContent =
      q || "all services";

  }

  const input =
    document.querySelector("#search-page-input");

  if(input){

    input.value = q;

  }

  const results =
    providers.filter(p => {

      const hay = [
        p.name,
        p.type,
        p.category,
        p.services.join(" "),
        p.area.join(" "),
        p.description
      ]
      .join(" ")
      .toLowerCase();

      return (
        !q ||
        hay.includes(q.toLowerCase())
      );

    });

  document.querySelector("#result-count")
    ?.replaceChildren(
      document.createTextNode(
        `${results.length} provider${results.length === 1 ? "" : "s"} found`
      )
    );

  const el =
    document.querySelector("#search-results");

  if(el){

    el.innerHTML =
      results.length
      ?
      results
        .map(providerCard)
        .join("")
      :
      `
      <div class="card empty-state">

        <h3>
          No exact matches yet
        </h3>

        <p>
          Try a broader search or
          <a
            href="request-help.html"
            style="color:var(--blue);font-weight:800"
          >
            post what you need
          </a>.
        </p>

      </div>
      `;

  }

}

function renderCategoryPage(){

  const name =
    new URLSearchParams(
      location.search
    )
    .get("name") ||
    "Home & Repair";

  document.querySelectorAll(
    "[data-category-name]"
  )
  .forEach(el => {

    el.textContent = name;

  });

  const cat =
    categories.find(
      c => c[0] === name
    ) ||
    categories[0];

  document.querySelector("#category-icon")
    ?.replaceChildren(
      document.createTextNode(
        cat[1]
      )
    );

  document.querySelector("#category-desc")
    ?.replaceChildren(
      document.createTextNode(
        cat[2]
      )
    );

  const results =
    providers.filter(
      p => p.category === name
    );

  const el =
    document.querySelector("#category-providers");

  if(el){

    el.innerHTML =
      results.length
      ?
      results
        .map(providerCard)
        .join("")
      :
      `
      <div class="card empty-state">

        <h3>
          No providers listed yet
        </h3>

        <p>
          Be the first to
          <a
            href="list-service.html"
            style="color:var(--blue);font-weight:800"
          >
            list a service
          </a>
          in this category.
        </p>

      </div>
      `;

  }

}

function renderProvider(){

  const id =
    new URLSearchParams(
      location.search
    )
    .get("id") ||
    providers[0].id;

  const p =
    providers.find(
      x => x.id === id
    ) ||
    providers[0];

  const set =
    (sel,val) => {

      const el =
        document.querySelector(sel);

      if(el){
        el.textContent = val;
      }

    };

  set(
    "#provider-name",
    p.name
  );

  set(
    "#provider-category",
    `${p.type} • ${p.category}`
  );

  document.querySelectorAll(
    "#provider-description"
  )
  .forEach(el => {

    el.textContent =
      p.description;

  });

  set(
    "#provider-recs",
    p.recommendations
  );

  set(
    "#provider-rehire",
    p.rehire
  );

  set(
    "#provider-area",
    p.area.join(", ")
  );

  set(
    "#provider-phone",
    p.phone
  );

  document.querySelector(
    "#provider-call"
  )
  ?.setAttribute(
    "href",
    `tel:${p.phone.replace(/\D/g,"")}`
  );

  document.querySelector(
    "#provider-services"
  )
  .innerHTML =
    p.services
      .map(
        s => `
          <span class="pill">
            ${s}
          </span>
        `
      )
      .join("");

  document.querySelector(
    "#provider-badges"
  )
  .innerHTML =
    p.verified
      .map(
        v => `
          <span class="badge green">
            ✓ ${v}
          </span>
        `
      )
      .join("");

  document.querySelector(
    "#recommend-provider-link"
  )
  ?.setAttribute(
    "href",
    `recommend.html?provider=${encodeURIComponent(p.name)}`
  );

}

document.addEventListener(
  "DOMContentLoaded",
  boot
);
