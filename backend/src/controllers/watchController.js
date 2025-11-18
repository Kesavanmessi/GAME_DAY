const WATCH_PROVIDERS = {
  IN: ["JioCinema", "SonyLIV", "Star Sports"],
  US: ["ESPN+", "Peacock", "fuboTV"],
  GB: ["Sky Sports", "BT Sport"],
  AU: ["Optus Sport"],
  CA: ["DAZN Canada"],
  Default: ["YouTube / Official Broadcaster"]
};

exports.getProvidersForMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const country = req.user.location || "Default";

    const countryCode = country.toUpperCase().substring(0, 2);
    const providers = WATCH_PROVIDERS[countryCode] || WATCH_PROVIDERS.Default;

    res.json({ matchId, providers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch providers" });
  }
};
