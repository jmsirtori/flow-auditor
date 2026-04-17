export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "PAGESPEED_API_KEY no configurada" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL requerida" });

  try {
    const [mobile, desktop] = await Promise.all([
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&key=${apiKey}`),
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&key=${apiKey}`)
    ]);

    const [mobileData, desktopData] = await Promise.all([mobile.json(), desktop.json()]);

    const extract = (data) => {
      const cats = data?.lighthouseResult?.categories;
      const audits = data?.lighthouseResult?.audits;
      return {
        performance: Math.round((cats?.performance?.score || 0) * 100),
        seo: Math.round((cats?.seo?.score || 0) * 100),
        accessibility: Math.round((cats?.accessibility?.score || 0) * 100),
        bestPractices: Math.round((cats?.["best-practices"]?.score || 0) * 100),
        lcp: audits?.["largest-contentful-paint"]?.displayValue || "N/A",
        fid: audits?.["total-blocking-time"]?.displayValue || "N/A",
        cls: audits?.["cumulative-layout-shift"]?.displayValue || "N/A",
        fcp: audits?.["first-contentful-paint"]?.displayValue || "N/A",
        speedIndex: audits?.["speed-index"]?.displayValue || "N/A",
      };
    };

    res.status(200).json({
      mobile: extract(mobileData),
      desktop: extract(desktopData),
      url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
