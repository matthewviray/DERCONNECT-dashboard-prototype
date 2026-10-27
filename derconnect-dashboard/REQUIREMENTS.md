# DERConnect Dashboard: feature coverage

This review is based on the user-provided **Dashboard Team Milestone task.pdf** and the six supplied reading PDFs. Document to-do lists were treated as project context. The audience is campus building managers, as chosen by the user.

Everything below is a standalone, static prototype. Data, meter traces, event labels, expected profiles, cause suggestions, recurrence history, ingestion audits and evaluation counts are fixtures. No anomaly detector, cause classifier, live DERConnect connection or security integration is running.

| Brief / research idea | Where to find it | Current behavior |
| --- | --- | --- |
| Campus and building energy use | Overview; Buildings | Campus/building filters, consumption, peak demand, emissions and building comparisons. |
| Actual versus expected | Overview; Energy insights; Needs attention | Needs attention has a visible selected-event investigation with measured/expected kW, the example threshold, exact hover/keyboard readings and highlighted deviations. Expected use is a synthetic reference. |
| Time-range and context filters | Page header; event register; meter investigation | Date, building, day/week/month; observed pattern, possible cause, priority and status; event traces offer a full day at 15-minute intervals or an event window at 5-minute intervals. |
| Submeter breakdown (PLAID / milestone context) | Overview; Energy insights; event drawer | Heating/cooling/ventilation, lighting, plug loads and other categories. Fixtures are not derived from PLAID recordings or real DERConnect channels. |
| Point and interval visualization (Lai) | Event drawer; investigate a meter | A dot for a global point anomaly; shaded intervals for contextual and pattern events; magnitude and duration are displayed together. |
| Fixed pattern legend (Lai) | Event register; event context and traces | Consistent colors and both plain-language and scientific labels: Global, Contextual, Shapelet, Seasonal and Trend. |
| Burgos study categories; Lai patterns; possible causes | Needs attention, category guide and event drawer | Primary event labels and a filter follow Burgos sections 3.1–3.6. Lai pattern types and unverified cause suggestions are separate fields. Section 3.7 (detection devices) appears in the guide as an approach, not as an event type. Study areas overlap and do not establish causes. |
| Cyberattacks and data-integrity issues | Possible-cause filter; context explanations | Filter categories are represented; the current fixtures contain no established security or integrity cases. Cyberattack classification requires corroborating logs or integrity evidence. A power anomaly is not automatically labeled an attack. |
| Reason flagged, benign explanations, action and status | Needs attention investigation; event drawer | The visible investigation explains the example threshold, peak deviation, first crossing and operational context next to its graph. Context, evidence, benign explanations and suggested action remain available with local review notes. Thresholds are illustrative review rules, not trained-model decisions. |
| People and operational context (Dahlgren) | Event drawer and action guidance | Occupancy, bookings, cleaning, security, maintenance and operating schedules are considered before requesting maintenance. No automated equipment control. |
| Meter-to-meter and historical comparison | Energy insights → Investigate a meter pattern | Select a flagged meter and reference building; overlay three generated comparable-day curves. Relative units make shape comparisons explicit; these traces are separate from campus kWh totals. |
| Trend / seasonality / basic shape (Lai) | Energy insights → Explore the reference components | The three known generator components are visualized. Their sum is the synthetic expected reference; this is not an inferred decomposition of real readings. |
| Category distributions | Needs attention, below register | Filter-linked counts by Burgos study area and Lai pattern, including explicit zero counts for categories not represented by the demo. |
| Frequency, recurrence, affected meters, availability | Overview → Patterns and data health | Last-seven-demo-day history, event rate, recurring meters, meters with open events and a count-based example feed audit. Each time scope is stated. |
| Event evidence and excess energy | Needs attention; drawer; summary; CSV | Measured kW, expected kW, residual, peak percentage, crossing time and integrated excess kWh come from one five-minute event evidence trace. Campus summary curves and the normalized research-comparison traces remain separate fixtures. |
| Accuracy, precision, recall, F1, false alarms and latency (Si) | Detection quality | Metrics are derived from preset event confusion counts, including false-alarm rate and example detection latency. |
| Seen versus unseen meters and >5% score markers (Si) | Detection quality → Seen versus unseen meters | Side-by-side per-meter, unified and zero-shot setups. Arrows show relative score changes greater than 5% against the per-meter fixture. |
| Point labels versus detections (Si / milestone) | Detection quality → Ground truth versus detections | Aligned truth, prediction and TP/FP/FN/TN rows for a separate 32-window fixture. Point metrics are computed from those exact rows. They are not presented as equivalent to the full event-level evaluation. |
| Mixed anomaly-type F1 (Lai) | Detection quality → Performance as pattern types are mixed | A constructed F1-versus-type-count illustration with disclosed counts. It is not a measured model result or a reproduction of the paper's experiment. |
| Exportable records | Reports; event register | Filter-aware event CSV includes Burgos area/section, Lai pattern, measured/expected/residual kW, threshold, first crossing, explanation, unverified cause, recurrence, duration, excess kWh, status and notes. |
| Smooth and accessible interactions | Throughout | Page transitions, hover feedback, drawer transitions, keyboard chart inspection and reduced-motion preferences. |

## Remaining integration work

- Connect or generate a shared time-series dataset suitable for training and inference, preserving timestamps, meter IDs, cadence, missing values and labels. The current aggregate curves and event traces are separate presentation fixtures.
- Train or integrate an anomaly detector and replace preset labels with its outputs. Evaluate it against independently defined ground-truth events, matching rules and latency limits.
- Replace the cause guidance with validated rules or a classifier if the project needs causal suggestions. Obtain supporting evidence before assigning cybersecurity or power-quality diagnoses.
- Connect live data updates and authenticated ingestion; the static prototype has no live polling, stream or backend.
- Fit decomposition and expected-use models to actual history if moving beyond the illustrative reference components.
- Run real mixed-type and seen/unseen-meter experiments before reporting model performance. The separate illustrative benchmark fixtures are not evidence of detection quality.

## Supplied readings

- `week-0-(1).pdf`: Dahlgren et al., *Bringing energy futures to life* — everyday and operational context.
- `week-0-(2).pdf`: Medico et al., *A voltage and current measurement dataset for plug load appliance identification in households* — PLAID and appliance/submeter context.
- `week-1-paper(1).pdf`: Guato Burgos et al., *A Review of Smart Grid Anomaly Detection Approaches Pertaining to Artificial Intelligence* — anomaly study categories and context.
- `week-1-paper(2).pdf`: Lai et al., *Revisiting Time Series Outlier Detection: Definitions and Benchmarks* — pattern taxonomy and synthetic benchmark context.
- `week-1-paper(3).pdf`: Si et al., *TimeSeriesBench* — training schemas, events and detection evaluation.
- `week-1-paper(4).pdf`: Oreshkin et al., *Zero-shot Forecasting by Simulation Alone* — simulation as research context. Its SarSim0 pipeline has not been implemented here.
