const axios = require("axios");

const client = axios.create({
  baseURL: process.env.ML_SERVICE_URL || "http://localhost:8000",
  timeout: 8000,
});

/**
 * Calls the FastAPI /predict endpoint. Throws a normalized error with a
 * .statusCode the errorHandler middleware understands, instead of letting
 * axios errors (with internal URLs/stack) leak to the client.
 */
async function getPrediction({ symptoms, freeText, age, gender, durationDays, severity }) {
  try {
    const { data } = await client.post("/predict", {
      symptoms: symptoms || [],
      free_text: freeText || null,
      age: age ?? null,
      gender: gender || null,
      duration_days: durationDays ?? null,
      severity: severity || null,
    });
    return data;
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
      const e = new Error("The ML service is currently unavailable. Please try again shortly.");
      e.statusCode = 503;
      throw e;
    }
    const e = new Error("Unable to process the symptom assessment right now.");
    e.statusCode = 502;
    throw e;
  }
}

async function extractSymptomsFromText(text) {
  try {
    const { data } = await client.post("/extract-symptoms", { text });
    return data.symptoms || [];
  } catch (err) {
    const e = new Error("Unable to process the symptom text right now.");
    e.statusCode = 502;
    throw e;
  }
}

module.exports = { getPrediction, extractSymptomsFromText };
