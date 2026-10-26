const SECTION_CONFIG = [
  { key: "profile", id: "profile-section", label: "Profile" },
  { key: "skills", id: "skills-section", label: "Skills" },
  { key: "experience", id: "experience-section", label: "Experience" },
  { key: "projects", id: "projects-section", label: "Projects" },
  { key: "education", id: "education-section", label: "Education" },
  { key: "achievements", id: "achievements-section", label: "Achievements" },
];

function element(tagName, className, text) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function appendText(parent, tagName, className, text) {
  if (text === undefined || text === null || text === "") return null;
  const node = element(tagName, className, text);
  parent.append(node);
  return node;
}

function appendList(parent, values, className = "card-list") {
  if (!values?.length) return;
  const list = element("ul", className);
  for (const value of values) list.append(element("li", "", value));
  parent.append(list);
}

function appendTags(parent, values) {
  if (!values?.length) return;
  const list = element("ul", "tag-list");
  for (const value of values) list.append(element("li", "", value));
  parent.append(list);
}

function appendLinks(parent, links, className = "card-links") {
  if (!links?.length) return;
  const container = element("div", className);
  for (const link of links) {
    const anchor = element("a", "", link.label);
    anchor.href = link.url;
    if (link.url.startsWith("https:")) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    container.append(anchor);
  }
  parent.append(container);
}

function formatDate(value) {
  if (value === null) return "Present";
  return value?.replaceAll("-", " / ") ?? "";
}

function appendDateRange(parent, record, singleDate = false) {
  const date = singleDate
    ? formatDate(record.date)
    : [formatDate(record.startDate), formatDate(record.endDate)].filter(Boolean).join(" — ");
  appendText(parent, "p", "card-meta", date);
}

function makeCard(kicker, title, record) {
  const card = element("article", "content-card");
  appendText(card, "p", "card-kicker", kicker);
  appendText(card, "h3", "", title);
  if (record.description) appendText(card, "p", "card-description", record.description);
  return card;
}

function renderProfile(profile) {
  const section = document.getElementById("profile-section");
  section.replaceChildren();
  section.hidden = !profile;
  if (!profile) return;

  section.append(element("p", "eyebrow", "A professional portfolio"));
  const heading = element("h1", "", profile.name);
  heading.id = "profile-name";
  section.append(heading);
  if (profile.headline) appendText(section, "p", "profile-headline", profile.headline);
  if (profile.summary) appendText(section, "p", "profile-summary", profile.summary);

  const meta = element("div", "profile-meta");
  appendText(meta, "span", "", profile.location);
  if (profile.contact?.email) {
    const email = element("a", "", profile.contact.email);
    email.href = `mailto:${profile.contact.email}`;
    meta.append(email);
  }
  if (meta.childElementCount > 0) section.append(meta);
  appendLinks(section, profile.contact?.links, "profile-links");
}

function renderSkills(skills) {
  const section = document.getElementById("skills-section");
  const container = document.getElementById("skills-content");
  container.replaceChildren();
  section.hidden = skills.length === 0;
  if (skills.length === 0) return;

  const groups = new Map();
  for (const skill of skills) {
    const category = skill.category ?? "Core skills";
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(skill);
  }
  const grid = element("div", "skill-groups");
  for (const [category, entries] of groups) {
    const group = element("div", "skill-group");
    group.append(element("h3", "", category));
    const list = element("ul", "skill-list");
    for (const skill of entries) {
      const item = element("li", "skill-item");
      item.append(element("span", "", skill.name));
      appendText(item, "span", "skill-level", skill.level);
      list.append(item);
    }
    group.append(list);
    grid.append(group);
  }
  container.append(grid);
}

function renderExperience(experience) {
  const section = document.getElementById("experience-section");
  const container = document.getElementById("experience-content");
  container.replaceChildren();
  section.hidden = experience.length === 0;
  for (const record of experience) {
    const card = makeCard(record.organization, record.role, record);
    appendDateRange(card, record);
    appendList(card, record.achievements);
    appendTags(card, record.skills);
    container.append(card);
  }
}

function renderProjects(projects) {
  const section = document.getElementById("projects-section");
  const container = document.getElementById("projects-content");
  container.replaceChildren();
  section.hidden = projects.length === 0;
  for (const record of projects) {
    const card = element("article", "content-card");
    if (record.image) {
      const image = element("img", "project-image");
      image.src = record.image;
      image.alt = `Project: ${record.title}`;
      image.addEventListener("error", () => {
        image.remove();
        document.getElementById("content-notice").hidden = false;
      }, { once: true });
      card.append(image);
    }
    appendText(card, "p", "card-kicker", record.role);
    appendText(card, "h3", "", record.title);
    appendText(card, "p", "card-description", record.description);
    appendList(card, record.outcomes);
    appendTags(card, record.technologies);
    appendLinks(card, record.links);
    container.append(card);
  }
}

function renderEducation(education) {
  const section = document.getElementById("education-section");
  const container = document.getElementById("education-content");
  container.replaceChildren();
  section.hidden = education.length === 0;
  for (const record of education) {
    const title = record.qualification ?? record.fieldOfStudy ?? record.institution;
    const card = makeCard(record.institution, title, record);
    if (record.qualification && record.fieldOfStudy) {
      appendText(card, "p", "card-meta", record.fieldOfStudy);
    }
    appendDateRange(card, record);
    container.append(card);
  }
}

function renderAchievements(achievements) {
  const section = document.getElementById("achievements-section");
  const container = document.getElementById("achievements-content");
  container.replaceChildren();
  section.hidden = achievements.length === 0;
  for (const record of achievements) {
    const card = makeCard(record.issuer, record.title, record);
    appendDateRange(card, record, true);
    appendLinks(card, record.links);
    container.append(card);
  }
}

function renderNavigation(portfolio) {
  const nav = document.getElementById("section-navigation");
  nav.replaceChildren();
  for (const config of SECTION_CONFIG) {
    const available = config.key === "profile"
      ? Boolean(portfolio.profile)
      : portfolio[config.key].length > 0;
    if (!available) continue;
    const item = element("li");
    const link = element("a", "", config.label);
    link.href = `#${config.id}`;
    item.append(link);
    nav.append(item);
  }
  nav.closest("nav").hidden = nav.childElementCount === 0;
}

export function renderPortfolio(portfolio) {
  renderProfile(portfolio.profile);
  renderSkills(portfolio.skills);
  renderExperience(portfolio.experience);
  renderProjects(portfolio.projects);
  renderEducation(portfolio.education);
  renderAchievements(portfolio.achievements);
  renderNavigation(portfolio);

  const hasProfile = Boolean(portfolio.profile);
  document.getElementById("portfolio-fallback").hidden = hasProfile;
  document.getElementById("content-notice").hidden = !portfolio.hasIssues;
  document.title = hasProfile ? `${portfolio.profile.name} — Portfolio` : "Professional Portfolio";
}

export function showRenderingFailure(error) {
  console.error("The portfolio could not be rendered.", error);
  document.getElementById("content-notice").hidden = false;
  document.getElementById("portfolio-fallback").hidden = false;
}
