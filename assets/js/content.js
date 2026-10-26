const GENERIC_PROFILE_NAME = "Portfolio";

const SECTION_FILES = [
  { key: "profile", path: "./data/profile.json", payloadKey: "profile", validate: validateProfile },
  { key: "skills", path: "./data/skills.json", validate: validateSkills },
  { key: "education", path: "./data/education.json", validate: validateEducation },
  { key: "experience", path: "./data/experience.json", validate: validateExperience },
  { key: "projects", path: "./data/projects.json", validate: validateProjects },
  { key: "achievements", path: "./data/achievements.json", validate: validateAchievements },
];

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function optionalString(record, key, markIssue) {
  if (!hasOwn(record, key)) return undefined;
  if (typeof record[key] !== "string" || record[key].trim() === "") {
    markIssue();
    return undefined;
  }
  return record[key].trim();
}

function optionalStringArray(record, key, markIssue) {
  if (!hasOwn(record, key)) return undefined;
  if (!Array.isArray(record[key])) {
    markIssue();
    return undefined;
  }
  const values = record[key].filter((value) => typeof value === "string" && value.trim() !== "")
    .map((value) => value.trim());
  if (values.length !== record[key].length) markIssue();
  return values.length > 0 ? values : undefined;
}

function isValidDate(value) {
  if (!/^\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/.test(value)) return false;
  const parts = value.split("-").map(Number);
  if (parts.length < 3) return true;
  const [year, month, day] = parts;
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function optionalDate(record, key, markIssue, allowNull = false) {
  if (!hasOwn(record, key)) return undefined;
  if (allowNull && record[key] === null) return null;
  if (typeof record[key] !== "string" || !isValidDate(record[key].trim())) {
    markIssue();
    return undefined;
  }
  return record[key].trim();
}

function validateLink(value) {
  if (!isObject(value) || typeof value.label !== "string" || value.label.trim() === "" ||
    typeof value.url !== "string" || value.url.trim() === "") return null;
  try {
    const url = new URL(value.url.trim());
    if (url.protocol !== "https:" && url.protocol !== "mailto:") return null;
    return { label: value.label.trim(), url: url.href };
  } catch {
    return null;
  }
}

function optionalLinks(record, key, markIssue) {
  if (!hasOwn(record, key)) return undefined;
  if (!Array.isArray(record[key])) {
    markIssue();
    return undefined;
  }
  const links = record[key].map(validateLink).filter(Boolean);
  if (links.length !== record[key].length) markIssue();
  return links.length > 0 ? links : undefined;
}

function optionalImage(record, markIssue) {
  if (!hasOwn(record, "image")) return undefined;
  const image = record.image;
  if (typeof image !== "string" ||
    !/^(?:\.\/)?assets\/images\/(?:[A-Za-z0-9_-][A-Za-z0-9._-]*\/)*[A-Za-z0-9_-][A-Za-z0-9._-]*\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(image)) {
    markIssue();
    return undefined;
  }
  return image.startsWith("./") ? image : `./${image}`;
}

function optionalEmail(contact, markIssue) {
  if (!hasOwn(contact, "email")) return undefined;
  const email = contact.email;
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    markIssue();
    return undefined;
  }
  return email.trim();
}

function validateProfile(value, markIssue) {
  if (!isObject(value)) {
    markIssue();
    return null;
  }
  const name = optionalString(value, "name", markIssue) ?? GENERIC_PROFILE_NAME;
  const result = { name };
  for (const key of ["headline", "summary", "location"]) {
    const field = optionalString(value, key, markIssue);
    if (field !== undefined) result[key] = field;
  }
  if (hasOwn(value, "contact")) {
    if (!isObject(value.contact)) {
      markIssue();
    } else {
      const contact = {};
      const email = optionalEmail(value.contact, markIssue);
      const links = optionalLinks(value.contact, "links", markIssue);
      if (email !== undefined) contact.email = email;
      if (links !== undefined) contact.links = links;
      if (Object.keys(contact).length > 0) result.contact = contact;
    }
  }
  return result;
}

function validateRecord(record, section, markIssue) {
  if (!isObject(record)) {
    markIssue();
    return null;
  }
  const id = optionalString(record, "id", markIssue);
  if (!id) return null;

  const result = { id };
  const requiredFields = {
    skills: ["name"],
    education: ["institution"],
    experience: ["role", "organization"],
    projects: ["title"],
    achievements: ["title"],
  }[section];

  for (const key of requiredFields) {
    const field = optionalString(record, key, markIssue);
    if (field === undefined) return null;
    result[key] = field;
  }

  const optionalStringFields = {
    skills: ["category", "level"],
    education: ["qualification", "fieldOfStudy", "description"],
    experience: ["description"],
    projects: ["description", "role"],
    achievements: ["issuer", "description"],
  }[section];
  for (const key of optionalStringFields) {
    const field = optionalString(record, key, markIssue);
    if (field !== undefined) result[key] = field;
  }

  if (section === "education" || section === "experience") {
    for (const key of ["startDate", "endDate"]) {
      const field = optionalDate(record, key, markIssue, section === "experience" && key === "endDate");
      if (field !== undefined) result[key] = field;
    }
  }
  if (section === "achievements") {
    const date = optionalDate(record, "date", markIssue);
    if (date !== undefined) result.date = date;
  }
  if (section === "experience") {
    for (const key of ["achievements", "skills"]) {
      const values = optionalStringArray(record, key, markIssue);
      if (values !== undefined) result[key] = values;
    }
  }
  if (section === "projects") {
    for (const key of ["technologies", "outcomes"]) {
      const values = optionalStringArray(record, key, markIssue);
      if (values !== undefined) result[key] = values;
    }
    const links = optionalLinks(record, "links", markIssue);
    const image = optionalImage(record, markIssue);
    if (links !== undefined) result.links = links;
    if (image !== undefined) result.image = image;
  }
  if (section === "achievements") {
    const links = optionalLinks(record, "links", markIssue);
    if (links !== undefined) result.links = links;
  }
  return result;
}

function validateCollection(value, section, markIssue) {
  if (!isObject(value) || !Array.isArray(value.items)) {
    markIssue();
    return [];
  }
  const ids = new Set();
  const records = [];
  for (const record of value.items) {
    const validated = validateRecord(record, section, markIssue);
    if (!validated) continue;
    if (ids.has(validated.id)) {
      markIssue();
      continue;
    }
    ids.add(validated.id);
    records.push(validated);
  }
  return records;
}

function validateSkills(value, markIssue) {
  return validateCollection(value, "skills", markIssue);
}

function validateEducation(value, markIssue) {
  return validateCollection(value, "education", markIssue);
}

function validateExperience(value, markIssue) {
  return validateCollection(value, "experience", markIssue);
}

function validateProjects(value, markIssue) {
  return validateCollection(value, "projects", markIssue);
}

function validateAchievements(value, markIssue) {
  return validateCollection(value, "achievements", markIssue);
}

async function loadSection(definition) {
  let hasIssues = false;
  const markIssue = () => {
    hasIssues = true;
  };

  try {
    const url = new URL(definition.path, document.baseURI);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    const documentData = await response.json();
    if (!isObject(documentData) || documentData.schemaVersion !== "1.0") {
      throw new Error("Unsupported or missing schema version");
    }
    const payload = definition.payloadKey ? documentData[definition.payloadKey] : documentData;
    if (definition.key === "profile") {
      const profile = definition.validate(payload, markIssue);
      return { key: definition.key, value: profile, hasIssues };
    }
    const value = definition.validate(documentData, markIssue);
    return { key: definition.key, value, hasIssues };
  } catch (error) {
    console.warn(`Portfolio content section "${definition.key}" is unavailable.`, error);
    return { key: definition.key, value: definition.key === "profile" ? null : [], hasIssues: true };
  }
}

export async function loadPortfolio() {
  const loadedSections = await Promise.all(SECTION_FILES.map(loadSection));
  const portfolio = { hasIssues: false };
  for (const section of loadedSections) {
    portfolio[section.key] = section.value;
    portfolio.hasIssues ||= section.hasIssues;
  }
  return portfolio;
}
