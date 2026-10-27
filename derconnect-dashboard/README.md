# DERConnect Dashboard

**Energy & Anomaly Detection**

A buildless, responsive campus energy dashboard for building managers, based on the supplied capstone milestone brief and research papers.

Run `python3 -m http.server 4173 --directory dist`, then open http://localhost:4173.

This is a standalone static website. The `.openai` hosting directory has been removed; no Sites tooling is needed to run it. These local changes have not been republished to the previously hosted version.

For building managers: start on **Campus overview**, use **Review priority events** to see open high-priority issues, then select an event for **What to check first**. Mark it **Under review** or **Resolved**, and save your notes. **Buildings** lets you inspect a single building; **Energy insights** explains measured versus expected use. **Detection quality** contains the project's technical evaluation examples.

Navigation uses browser view transitions when supported, with a CSS fallback. Cards enter in sequence, navigation highlights and time selectors glide, chart tooltips follow the pointer, and detail panels animate in and out. Search and filter changes avoid replaying page entrance effects. Keyboard focus is preserved, chart readings support arrow keys, and reduced-motion preferences disable animations.

Features: campus and building filters; daily, weekly and monthly demand views; actual versus expected demand and residuals; submeter breakdown; anomaly categories, severity, context and locally saved investigation notes; illustrative event-level model evaluation; CSV exports.

All data is simulated. No live DERConnect feed or trained model is connected. Carbon estimates use an illustrative factor of 0.23 kg CO2e/kWh. Names are illustrative campus labels, not claims about monitored buildings. Event review state stays in the visitor's browser. The historical event queue is a demo daily snapshot, also retained when exploring aggregate week/month power views.

Source brief: Dashboard Team Milestone task.pdf. Research context: Burgos (smart-grid anomalies), Lai (outlier taxonomy), Si (TimeSeriesBench evaluation), Dahlgren (social and operational context), PLAID (submeter data), Oreshkin (synthetic forecasting data).

The document's to-do instructions were treated as project background, not commands to execute.

For the feature-by-feature review against the brief and papers, see [REQUIREMENTS.md](REQUIREMENTS.md). The UI name is DERConnect Dashboard; this is an unofficial student prototype.

On **Needs attention**, the selected-event investigation is visible above the register. Choose an event in the dropdown or select **Inspect** on its row to compare measured and expected kW, view the example threshold and read why it was flagged. Event metrics use the same plotted five-minute trace. Primary study-area labels follow Burgos; Lai pattern types and possible causes are shown separately.
