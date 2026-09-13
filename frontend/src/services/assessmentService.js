import api from "./api";

export async function submitAssessment(payload) {
  const { data } = await api.post("/assessment", payload);
  return data;
}

export async function fetchAssessmentHistory() {
  const { data } = await api.get("/assessment/history");
  return data.assessments;
}

export async function fetchAssessmentById(id) {
  const { data } = await api.get(`/assessment/${id}`);
  return data.assessment;
}
