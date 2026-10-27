'use strict';

// Guato Burgos et al. (2024), sections 3.1–3.6, are study areas rather
// than mutually exclusive causal classes. Section 3.7 concerns devices.
const burgosGroups = {
  integrity: {label:'Data Integrity Attacks',section:'3.1',color:'#a089b0',description:'Altered readings or false-data injection. Requires independent measurements and evidence that values were manipulated.'},
  consumption: {label:'Unusual Consumption Behaviors and Measurements',section:'3.2',color:'#789463',description:'Unexpected consumption behavior or measurements. The demo HVAC, lighting and plug-load scenarios belong here.'},
  intrusion: {label:'Network Intrusions',section:'3.3',color:'#ac8d78',description:'Unauthorized network access. Requires access, network or intrusion-detection evidence.'},
  infrastructure: {label:'Network Infrastructure Anomalies',section:'3.4',color:'#7d9aab',description:'Problems or compromise in communications, sensors and other smart-grid infrastructure. Requires infrastructure telemetry.'},
  electrical: {label:'Electrical Data Anomalies',section:'3.5',color:'#c0925b',description:'Unusual electrical measurements, including load anomalies. The demo power spike is mapped here; voltage or power-quality diagnoses would need those channels.'},
  cyberattack: {label:'Cyber-Attack Detection',section:'3.6',color:'#b27b83',description:'Investigating whether unusual behavior is an attack rather than a fault or legitimate change. Requires corroborating security evidence.'}
};
const burgosAssignments = {'EVT-001':'consumption','EVT-002':'electrical','EVT-003':'consumption','EVT-004':'consumption','EVT-005':'consumption','EVT-006':'consumption'};
const demonstrationRules = {
  'EVT-001': {threshold:20,label:'Demand above the comparable-time baseline',explanation:'The air handler draws more power than expected for this time. The example review rule highlights readings over 20% above the reference.'},
  'EVT-002': {threshold:35,label:'Short peak above the expected demand range',explanation:'A short power peak is substantially higher than the reference. The example review rule highlights readings over 35% above expected demand.'},
  'EVT-003': {threshold:15,label:'After-hours lighting above its reference',explanation:'Lighting demand remains elevated at 02:00. The example rule combines the overnight context with readings over 15% above expected demand.'},
  'EVT-004': {threshold:10,label:'Rising base load through the day',explanation:'The base-load difference grows over the day. The example review rule marks where it first exceeds 10%; the event window covers the full drift, not only the readings over that threshold.'},
  'EVT-005': {threshold:18,label:'Repeated peaks during equipment cycling',explanation:'Several short cycles exceed the reference rather than forming one isolated peak. The example rule marks individual peaks more than 18% above expected demand.'},
  'EVT-006': {threshold:15,label:'Sustained evening demand above its reference',explanation:'Plug-load demand stays elevated during the evening reduction. The example review rule highlights readings over 15% above expected demand.'}
};
const burgosFor = event => burgosGroups[burgosAssignments[event.id]];
const hourLabel = hour => {
  const minutes=Math.round(hour*60);
  return `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
};

function burgosBadge(event) {
  const category=burgosFor(event);
  return `<span class="burgos-label"><i style="background:${category.color}"></i><span>${category.label}<small>Burgos · §${category.section}</small></span></span>`;
}

function burgosFilter() {
  return `<label class="select-wrap burgos-filter"><select id="burgos-filter" aria-label="Filter Burgos study area"><option value="all">All Burgos categories</option>${Object.entries(burgosGroups).map(([id,group])=>`<option value="${id}" ${state.burgosCategory===id?'selected':''}>${group.label}</option>`).join('')}</select></label>`;
}

function burgosGuide() {
  return `<details class="paper-guide"><summary>How these categories relate to the Burgos paper</summary><p>Burgos’s review groups studies by their subject. These areas can overlap; they are not a validated classifier or proof of a cause. Lai’s Global, Contextual, Shapelet, Seasonal and Trend labels describe the shape of a time series and remain a separate field.</p><div class="paper-category-list">${Object.values(burgosGroups).map(group=>`<div><strong>§${group.section} · ${group.label}</strong><p>${group.description}</p></div>`).join('')}<div><strong>§3.7 · Devices for Detecting Anomalies</strong><p>The seventh area describes detection devices and approaches. It is shown here as research context rather than used as a label for an anomalous event.</p></div></div><p>Source: user-supplied week-1-paper(1).pdf, Guato Burgos et al., <em>A Review of Smart Grid Anomaly Detection Approaches Pertaining to Artificial Intelligence</em>, section 3. No cyberattack, intrusion or data-integrity attack is established in the demo.</p></details>`;
}

// A single five-minute scenario trace supplies the event chart and its metrics.
// These channels are separate fixtures from the coarse campus summary series.
function eventEvidence(event) {
  const rule=demonstrationRules[event.id];
  const building=buildings[event.building];
  const weight=building.scale/buildings.reduce((sum,b)=>sum+b.scale,0);
  const meterShare=event.meter.startsWith('MAIN')?1:event.meter.startsWith('AHU')?.47/2:event.meter.startsWith('LTG')?.24/2:.19/2;
  const powerScale=1000*weight*meterShare/100;
  const samples=eventTrace(event,'event').map(point=>{
    const expected=point.expected*powerScale,measured=point.actual*powerScale;
    const difference=measured-expected,deviation=difference/expected*100;
    return {...point,expected,measured,difference,deviation,threshold:expected*(1+rule.threshold/100),crossed:deviation>rule.threshold+1e-8};
  });
  const eventSamples=samples.filter(point=>point.flagged);
  const peak=eventSamples.reduce((best,point)=>point.deviation>best.deviation?point:best,eventSamples[0]);
  const crossings=eventSamples.filter(point=>point.crossed);
  const excess=samples.slice(0,-1).reduce((sum,point,i)=>sum+(point.flagged?Math.max(0,point.difference):0)*(samples[i+1].hour-point.hour),0);
  return {samples,peak,crossings,excess,rule,intervalMinutes:5};
}

function evidenceMetrics(event) {
  const evidence=eventEvidence(event),peak=evidence.peak;
  return `<div class="evidence-metrics"><div><span>Measured at peak deviation</span><strong>${fmt(peak.measured,2)} <small>kW</small></strong></div><div><span>Expected at that same time</span><strong>${fmt(peak.expected,2)} <small>kW</small></strong></div><div><span>Difference at that time</span><strong>+${fmt(peak.difference,2)} <small>kW</small></strong><small>${signed(peak.deviation)} above expected</small></div><div><span>Event duration</span><strong>${event.duration}</strong><small>${event.time}–${hourLabel(Math.min(24,parseFloat(event.time.slice(0,2))+Number(event.time.slice(3))/60+durationHours(event)))}</small></div><div><span>Estimated extra energy</span><strong>${fmt(evidence.excess,2)} <small>kWh</small></strong><small>From the plotted event interval</small></div><div><span>First rule crossing</span><strong>${evidence.crossings.length?hourLabel(evidence.crossings[0].hour):'None'}</strong><small>${evidence.crossings.length} five-minute samples over threshold</small></div></div>`;
}

function evidenceGeometry(event) {
  const evidence=eventEvidence(event),W=700,H=255,left=47,right=16,top=25,bottom=34;
  const maximum=Math.max(...evidence.samples.map(point=>Math.max(point.measured,point.threshold)))*1.14;
  const low=evidence.samples[0].hour,high=evidence.samples.at(-1).hour;
  return {...evidence,W,H,left,right,top,bottom,maximum,low,high,x:hour=>left+(hour-low)/(high-low)*(W-left-right),y:value=>top+(1-value/maximum)*(H-top-bottom)};
}

function evidenceChart(event,prefix='attention') {
  const g=evidenceGeometry(event),color=categories[event.category];
  const path=key=>g.samples.map((point,i)=>`${i?'L':'M'}${g.x(point.hour).toFixed(2)},${g.y(point[key]).toFixed(2)}`).join(' ');
  const start=Number(event.time.slice(0,2))+Number(event.time.slice(3))/60,end=Math.min(24,start+durationHours(event));
  const width=g.x(end)-g.x(start),peak=g.peak;
  return `<div class="evidence-chart-wrap"><svg id="${prefix}-evidence-chart" class="evidence-chart" data-evidence-chart="${event.id}" data-prefix="${prefix}" tabindex="0" viewBox="0 0 ${g.W} ${g.H}" role="img" aria-label="${event.title}: measured and expected power in kilowatts with the example review threshold. Arrow keys inspect each reading."><text class="chart-axis" x="${g.left}" y="12">Power · kW</text>${[0,.25,.5,.75,1].map(f=>`<line class="chart-grid" x1="${g.left}" x2="${g.W-g.right}" y1="${g.y(g.maximum*f)}" y2="${g.y(g.maximum*f)}"/><text class="chart-axis" text-anchor="end" x="${g.left-9}" y="${g.y(g.maximum*f)+3}">${fmt(g.maximum*f,g.maximum<10?1:0)}</text>`).join('')}<rect class="evidence-window" x="${g.x(start)}" y="${g.top}" width="${width}" height="${g.H-g.top-g.bottom}" fill="${color}" opacity=".1"/><path d="${path('threshold')}" class="review-threshold"/><path d="${path('expected')}" class="expected-line"/><path d="${path('measured')}" class="evidence-measured"/>${g.crossings.map(point=>`<circle cx="${g.x(point.hour)}" cy="${g.y(point.measured)}" r="2.6" fill="${color}" stroke="white" stroke-width="1"/>`).join('')}<circle cx="${g.x(peak.hour)}" cy="${g.y(peak.measured)}" r="4.5" fill="${color}" stroke="white" stroke-width="2"/><text class="peak-label" x="${Math.min(g.W-100,Math.max(g.left,g.x(peak.hour)-25))}" y="${Math.max(15,g.y(peak.measured)-13)}">${signed(peak.deviation)} deviation</text>${[0,1,2,3,4].map(i=>{const hour=g.low+(g.high-g.low)*i/4;return `<text class="chart-axis" x="${g.x(hour)}" y="${g.H-9}" text-anchor="${i===0?'start':i===4?'end':'middle'}">${hourLabel(hour)}</text>`;}).join('')}<line id="${prefix}-evidence-cursor" y1="${g.top}" y2="${g.H-g.bottom}" stroke="#91a87b" stroke-dasharray="3 3" visibility="hidden"/><rect data-evidence-hit x="${g.left}" y="${g.top}" width="${g.W-g.left-g.right}" height="${g.H-g.top-g.bottom}" fill="transparent"/></svg><div id="${prefix}-evidence-tooltip" class="chart-tooltip evidence-tooltip" role="status" aria-live="off"></div></div><div class="legend evidence-legend"><span><i></i>Measured demand</span><span><i class="expected"></i>Expected demand</span><span><i class="threshold-legend"></i>Example review threshold (+${g.rule.threshold}%)</span><span><i style="background:${color}"></i>Readings over threshold</span></div><p class="research-caption">Shading shows the event window. Hover, tap or use arrow keys for exact readings. Power, deviation and excess-energy metrics use this same five-minute simulated trace. The threshold is an illustrative review rule, not output from a trained model.</p>`;
}

function detectionReason(event) {
  const evidence=eventEvidence(event);
  return `<section class="detection-reason"><span class="context-label">WHY THIS EVENT WAS FLAGGED</span><h3>${evidence.rule.label}</h3><p>${evidence.rule.explanation}</p><div class="rule-comparison"><strong>${signed(evidence.peak.deviation)}</strong><span>peak difference versus a<br><b>+${evidence.rule.threshold}%</b> example threshold</span></div><p><strong>Observed:</strong> ${event.reason}</p><p><strong>Could this be normal?</strong> ${event.alternative}</p><div class="first-check"><strong>What to check first</strong><p>${event.action}</p></div></section>`;
}

function selectedAttentionEvent(list=filteredEvents()) {
  return list.find(event=>event.id===state.attentionEvent)||list[0];
}

function attentionInvestigation(list) {
  const event=selectedAttentionEvent(list);
  if(!event)return '';
  return `<section class="card attention-investigation" aria-labelledby="investigation-title"><div class="investigation-heading"><div><span class="eyebrow">INVESTIGATE AN EVENT</span><h2 id="investigation-title" tabindex="-1">${event.title}</h2><p>${buildings[event.building].name} · ${event.meter} · ${dateLabel()} at ${event.time}</p></div><label>Selected event<select id="attention-event" aria-label="Choose event to investigate">${list.map(item=>`<option value="${item.id}" ${item.id===event.id?'selected':''}>${item.id} · ${item.title}</option>`).join('')}</select></label></div><div class="investigation-category">${burgosBadge(event)}<span class="secondary-pattern"><i style="background:${categories[event.category]}"></i>Lai pattern: ${categoryLabels[event.category]} (${event.category})</span>${eventBadge(event)}</div>${evidenceMetrics(event)}<div class="investigation-body"><section class="investigation-chart"><h3>Where measured demand departs from expected</h3>${evidenceChart(event)}</section>${detectionReason(event)}</div><div class="investigation-bottom"><p><strong>Possible explanation · unverified:</strong> ${scenarioFor(event).possible}</p><button class="button primary" data-event-review="${event.id}">${icon('file')}Review context & save notes</button></div></section>`;
}

function renderAttentionPage() {
  const list=filteredEvents(),open=activeEvents(),selected=selectedAttentionEvent(list);
  return heading('Events needing attention','See what changed, why it was flagged, and what to check next.','ANOMALY INVESTIGATION')+filters()+`<div class="anomaly-summary"><div class="card summary-card"><span>Open events</span><h3>${open.length}</h3><p>Unusual usage patterns still to review</p></div><div class="card summary-card"><span>Estimated extra energy</span><h3>${fmt(open.reduce((sum,event)=>sum+event.excess,0),2)} <small>kWh</small></h3><p>Derived from the demo event traces</p></div><div class="card summary-card"><span>Buildings / meters affected</span><h3>${new Set(open.map(event=>event.building)).size} <small>/ ${new Set(open.map(event=>`${event.building}-${event.meter}`)).size}</small></h3><p>With an open event in this building scope</p></div></div><div class="attention-filters"><div><span class="filter-caption">Burgos study area</span>${burgosFilter()}</div><div><span class="filter-caption">Review status</span><label class="select-wrap"><select id="status-filter" aria-label="Filter event status">${['all','open','New','Investigating','Resolved'].map(status=>`<option value="${status}" ${state.eventStatus===status?'selected':''}>${status==='all'?'All statuses':statusLabel(status)}</option>`).join('')}</select></label></div><div><span class="filter-caption">Priority</span><label class="select-wrap"><select id="severity-filter" aria-label="Filter event priority">${['all','High','Medium','Low'].map(value=>`<option value="${value}" ${state.eventSeverity===value?'selected':''}>${value==='all'?'All priorities':value+' priority'}</option>`).join('')}</select></label></div><div><span class="filter-caption">Lai time-series pattern</span><label class="select-wrap"><select id="type-filter" aria-label="Filter Lai time-series pattern"><option value="all">All patterns</option>${Object.keys(categories).map(type=>`<option value="${type}" ${state.eventType===type?'selected':''}>${type} · ${categoryLabels[type]}</option>`).join('')}</select></label></div><div><span class="filter-caption">Possible cause · unverified</span>${causeFilter()}</div></div><div class="register-heading"><span>${list.length} ${list.length===1?'event matches':'events match'} these filters · select an event to update the investigation</span><button class="button" data-export="events">${icon('download')}Export events</button></div>${attentionInvestigation(list)}<section class="card attention-register"><div class="table-scroll"><table class="full-table"><thead><tr><th>Event / building</th><th>Burgos category</th><th>Lai pattern</th><th>Priority</th><th>Peak deviation</th><th>Duration</th><th>Status</th><th></th></tr></thead><tbody>${list.map(event=>`<tr data-investigate="${event.id}" class="${selected?.id===event.id?'selected-event':''}" tabindex="0" aria-label="Investigate ${event.title}"><td><strong class="row-title">${event.title}</strong><span class="event-building">${buildings[event.building].name} · ${event.meter}</span></td><td>${burgosBadge(event)}</td><td><span style="color:${categories[event.category]}">●</span> ${event.category}</td><td>${eventBadge(event)}</td><td class="trend-bad">${signed(eventEvidence(event).peak.deviation)}</td><td>${event.duration}</td><td><span class="badge ${event.status==='New'?'warning':event.status==='Resolved'?'':'neutral'}">${statusLabel(event.status)}</span></td><td><button class="button small" data-select-investigation="${event.id}" aria-label="Show chart and reason for ${event.title}">Inspect ${icon('arrowUpRight')}</button></td></tr>`).join('')}</tbody></table>${!list.length?`<div class="empty-state">No events match these filters.<button class="button clear-filters" id="clear-event-filters">Clear event filters</button>${state.eventCause==='security'?'<p>No cyberattack cases are established in the demo. Corroborating security evidence would be needed.</p>':''}${state.burgosCategory!=='all'?'<p>Only consumption and electrical-load scenarios are present in this demo. No security, intrusion or data-integrity attack is established.</p>':''}</div>`:''}</div></section>${anomalyDistribution(list)}${burgosGuide()}<p class="section-note">Burgos labels identify a study area; Lai labels identify a time-series pattern. Neither label establishes a cause. The event register is the selected demo day’s queue; week/month controls change the aggregate context, not the queue’s time span.</p>`;
}

function eventDrawerContent(event) {
  return `<div class="drawer-heading"><span class="eyebrow">EVENT DETAILS · ${event.id}</span><button class="icon-button" id="close-drawer" aria-label="Close event details">${icon('x')}</button></div>${eventBadge(event)}<h2>${event.title}</h2><p class="drawer-subtitle">${buildings[event.building].name} · ${event.meter}<br>${dateLabel()} at ${event.time} · Simulated event</p>${burgosBadge(event)}<section class="drawer-section"><h3>Measured versus expected demand</h3>${evidenceChart(event,'drawer')}${evidenceMetrics(event)}</section>${detectionReason(event)}${eventContextPanel(event)}<label for="event-status">Review status</label><select id="event-status">${['New','Investigating','Resolved'].map(status=>`<option value="${status}" ${status===event.status?'selected':''}>${statusLabel(status)}</option>`).join('')}</select><label for="event-note">Investigation notes</label><textarea id="event-note" placeholder="e.g. Evening event confirmed. Schedule checked with facilities…">${escapeHTML(event.note||'')}</textarea><button class="button primary save-event" id="save-event">${icon('check')}Save review</button><p class="data-note">Reviews are saved in this browser only. Possible causes are unverified scenario guidance.</p>`;
}

function bindEvidenceCharts(root=document) {
  root.querySelectorAll('[data-evidence-chart]').forEach(svg=>{
    const event=events.find(item=>item.id===svg.dataset.evidenceChart),geometry=evidenceGeometry(event),prefix=svg.dataset.prefix;
    const tooltip=document.getElementById(prefix+'-evidence-tooltip'),cursor=document.getElementById(prefix+'-evidence-cursor'),hit=svg.querySelector('[data-evidence-hit]');
    let index=geometry.samples.findIndex(point=>point===geometry.peak),frame;
    const inspect=next=>{
      index=Math.max(0,Math.min(geometry.samples.length-1,next));
      const point=geometry.samples[index],x=geometry.x(point.hour);
      cursor.setAttribute('x1',x);cursor.setAttribute('x2',x);cursor.setAttribute('visibility','visible');
      tooltip.innerHTML=`<strong>${hourLabel(point.hour)}</strong><p>Measured: ${fmt(point.measured,2)} kW</p><p>Expected: ${fmt(point.expected,2)} kW</p><p>Difference: ${point.difference>=0?'+':''}${fmt(point.difference,2)} kW (${signed(point.deviation)})</p><p>Review threshold: ${fmt(point.threshold,2)} kW</p>`;
      const anchor=svg.createSVGPoint();anchor.x=x;anchor.y=geometry.y(point.measured);
      const screen=anchor.matrixTransform(svg.getScreenCTM()),rect=tooltip.parentElement.getBoundingClientRect();
      const left=Math.max(5,Math.min(rect.width-tooltip.offsetWidth-5,screen.x-rect.left+12));
      const top=Math.max(5,Math.min(rect.height-tooltip.offsetHeight-5,screen.y-rect.top-40));
      tooltip.style.transform=`translate3d(${left}px,${top}px,0)`;tooltip.classList.add('visible');
    };
    const hide=()=>{cancelAnimationFrame(frame);frame=null;cursor.setAttribute('visibility','hidden');tooltip.classList.remove('visible');};
    const move=pointer=>{
      cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
        const point=svg.createSVGPoint();point.x=pointer.clientX;point.y=pointer.clientY;
        const local=point.matrixTransform(svg.getScreenCTM().inverse());
        inspect(Math.round((local.x-geometry.left)/(geometry.W-geometry.left-geometry.right)*(geometry.samples.length-1)));
      });
    };
    hit.addEventListener('pointermove',move);hit.addEventListener('pointerdown',move);hit.addEventListener('pointerleave',hide);
    svg.addEventListener('focus',()=>inspect(index));svg.addEventListener('blur',hide);
    svg.addEventListener('keydown',key=>{
      if(['ArrowLeft','ArrowRight','Home','End'].includes(key.key)){key.preventDefault();inspect(key.key==='Home'?0:key.key==='End'?geometry.samples.length-1:index+(key.key==='ArrowRight'?1:-1));}
      if(key.key==='Escape')hide();
    });
  });
}

function bindInvestigation() {
  const select=id=>{
    state.attentionEvent=id;render({animate:false});
    const target=$('#investigation-title');target?.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'start'});
    target?.focus({preventScroll:true});
  };
  $('#attention-event')?.addEventListener('change',event=>{state.attentionEvent=event.target.value;render({animate:false});});
  document.querySelectorAll('[data-investigate]').forEach(row=>{
    row.onclick=event=>{if(event.target.closest('button'))return;select(row.dataset.investigate);};
    row.onkeydown=event=>{if(event.target!==row)return;if(event.key==='Enter'||event.key===' '){event.preventDefault();select(row.dataset.investigate);}};
  });
  document.querySelectorAll('[data-select-investigation]').forEach(button=>button.onclick=()=>select(button.dataset.selectInvestigation));
  document.querySelectorAll('[data-event-review]').forEach(button=>button.onclick=()=>openEvent(button.dataset.eventReview));
  bindEvidenceCharts();
}

function burgosDistribution(list) {
  return `<div class="two-columns"><section class="card analysis-card"><h3>Burgos categories in this selection</h3><p>Study areas from §§3.1–3.6 of the review. Zero counts mean no corresponding demo cases, not proof that a campus is free of that issue.</p>${Object.entries(burgosGroups).map(([id,category])=>{const count=list.filter(event=>burgosAssignments[event.id]===id).length;return `<div class="distribution-row burgos-distribution"><span><i style="background:${category.color}"></i>${category.label}</span><div class="bar-track"><i style="width:${list.length?count/list.length*100:0}%;background:${category.color}"></i></div><b>${count}</b></div>`;}).join('')}</section><section class="card analysis-card"><h3>Lai time-series patterns</h3><p>A separate description of the shape or timing of the readings, rather than a cause.</p>${Object.keys(categories).map(type=>{const count=list.filter(event=>event.category===type).length;return `<div class="distribution-row"><span><i style="background:${categories[type]}"></i>${type} · ${categoryLabels[type]}</span><div class="bar-track"><i style="width:${list.length?count/list.length*100:0}%;background:${categories[type]}"></i></div><b>${count}</b></div>`;}).join('')}${patternLegend()}</section></div>`;
}
