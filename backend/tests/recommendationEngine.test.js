jest.mock("../models/Product", () => ({
  find: jest.fn(),
}));

const Product = require("../models/Product");
const { getRecommendations } = require("../services/recommendationEngine");

describe("recommendationEngine.getRecommendations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("never recommends products when riskLevel is URGENT", async () => {
    const result = await getRecommendations({ symptoms: ["cough", "high_fever"], riskLevel: "URGENT" });
    expect(result.skip).toBe(true);
    expect(result.reason).toMatch(/URGENT/);
    expect(Product.find).not.toHaveBeenCalled();
  });

  test("never recommends products when risk level is INSUFFICIENT_INFO", async () => {
    const result = await getRecommendations({ symptoms: [], riskLevel: "INSUFFICIENT_INFO" });
    expect(result.skip).toBe(true);
    expect(Product.find).not.toHaveBeenCalled();
  });

  test("skips when no symptoms map to any known wellness category", async () => {
    const result = await getRecommendations({ symptoms: ["family_history"], riskLevel: "LOW" });
    expect(result.skip).toBe(true);
    expect(Product.find).not.toHaveBeenCalled();
  });

  test("queries and ranks products by matched category when symptoms map to categories", async () => {
    const fakeProducts = [
      { _id: "1", category: "Digestive Health", name: "A" },
      { _id: "2", category: "Cold & Immunity", name: "B" },
    ];
    Product.find.mockReturnValue({ lean: () => Promise.resolve(fakeProducts) });

    const result = await getRecommendations({ symptoms: ["cough", "constipation"], riskLevel: "LOW" });

    expect(result.skip).toBe(false);
    expect(Product.find).toHaveBeenCalledWith(
      expect.objectContaining({ category: expect.objectContaining({ $in: expect.any(Array) }) })
    );
    expect(result.products.length).toBe(2);
  });

  test("limits results to at most 6 products", async () => {
    const fakeProducts = Array.from({ length: 10 }, (_, i) => ({
      _id: String(i),
      category: "Cold & Immunity",
      name: `Product ${i}`,
    }));
    Product.find.mockReturnValue({ lean: () => Promise.resolve(fakeProducts) });

    const result = await getRecommendations({ symptoms: ["cough"], riskLevel: "LOW" });
    expect(result.products.length).toBeLessThanOrEqual(6);
  });
});
