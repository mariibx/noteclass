function isRecord(value) {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value);
}

function isValidIdentifier(value) {
  return (
    (typeof value === 'string' && value.trim().length > 0) ||
    (typeof value === 'number' && Number.isFinite(value))
  );
}

function isOptionalIdentifier(value) {
  return value === undefined ||
    value === null ||
    isValidIdentifier(value);
}

function isOptionalString(value) {
  return value === undefined ||
    value === null ||
    typeof value === 'string';
}

function isOptionalBoolean(value) {
  return value === undefined || typeof value === 'boolean';
}

function isOptionalDate(value) {
  return value === undefined ||
    value === null ||
    typeof value === 'string' ||
    (typeof value === 'number' && Number.isFinite(value));
}

export function isValidNote(note) {
  return isRecord(note) &&
    isValidIdentifier(note.id) &&
    isOptionalString(note.title) &&
    isOptionalString(note.content) &&
    isOptionalIdentifier(note.categoryId) &&
    isOptionalString(note.categoryName) &&
    isOptionalString(note.categoryColor) &&
    isOptionalBoolean(note.favorite) &&
    isOptionalBoolean(note.archived) &&
    isOptionalDate(note.createdAt) &&
    isOptionalDate(note.updatedAt);
}

export function isValidCategory(category) {
  return isRecord(category) &&
    isValidIdentifier(category.id) &&
    typeof category.name === 'string' &&
    category.name.trim().length > 0 &&
    isOptionalString(category.color);
}

export function readStoredRecords(key, validateRecord) {
  let rawValue;

  try {
    rawValue = globalThis.localStorage.getItem(key);
  } catch (error) {
    return {
      records: [],
      invalidEntries: [],
      canWrite: false,
      error
    };
  }

  if (rawValue === null) {
    return {
      records: [],
      invalidEntries: [],
      canWrite: true,
      error: null
    };
  }

  let parsedValue;

  try {
    parsedValue = JSON.parse(rawValue);
  } catch (error) {
    return {
      records: [],
      invalidEntries: [],
      canWrite: false,
      error
    };
  }

  if (!Array.isArray(parsedValue)) {
    return {
      records: [],
      invalidEntries: [],
      canWrite: false,
      error: new Error('Stored value is not an array.')
    };
  }

  const records = [];
  const invalidEntries = [];
  const seenIds = new Set();

  parsedValue.forEach((record, index) => {
    const hasUniqueId =
      isRecord(record) &&
      isValidIdentifier(record.id) &&
      !seenIds.has(record.id);

    if (!validateRecord(record) || !hasUniqueId) {
      invalidEntries.push({ index, value: record });
      return;
    }

    seenIds.add(record.id);
    records.push(record);
  });

  return {
    records,
    invalidEntries,
    canWrite: true,
    error: null
  };
}

export function writeStoredRecords(key, records, readResult) {
  if (!readResult || !readResult.canWrite) {
    return { skipped: true, error: null };
  }

  const recordsToWrite = [...records];
  const invalidEntries = readResult.invalidEntries || [];

  invalidEntries.forEach(entry => {
    const index = Math.min(entry.index, recordsToWrite.length);
    recordsToWrite.splice(index, 0, entry.value);
  });

  try {
    globalThis.localStorage.setItem(
      key,
      JSON.stringify(recordsToWrite)
    );

    return { skipped: false, error: null };
  } catch (error) {
    return { skipped: false, error };
  }
}

export function readStoredString(key, fallback) {
  try {
    const value = globalThis.localStorage.getItem(key);

    return {
      value: value === null ? fallback : value,
      error: null
    };
  } catch (error) {
    return { value: fallback, error };
  }
}

export function writeStoredString(key, value) {
  try {
    globalThis.localStorage.setItem(key, value);
    return { error: null };
  } catch (error) {
    return { error };
  }
}
