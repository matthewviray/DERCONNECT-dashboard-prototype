'use strict';

// These are scenario fixtures, not diagnoses or predictions from a trained model.
const causeGroups = {
  equipment: {label:'Equipment / controls', color:'#76916b'},
  operations: {label:'Schedule / occupancy', color:'#b29a64'},
  demand: {label:'Unusual demand', color:'#bb8171'},
  integrity: {label:'Meter / data quality', color:'#7e9ba7'},
  security: {label:'Cyberattack · needs evidence', color:'#9b8bb0'}
};
const eventContext = {
  'EVT-001': {cause:'equipment',system:'Heating, cooling & ventilation',possible:'A ventilation override or a control setting may be keeping the air handler at high demand.',check:'Room bookings, occupancy records, the AHU schedule and controller override history.',days:[0,2,4]},
  'EVT-002': {cause:'demand',system:'Building main meter',possible:'Equipment startup or a large activity may have caused the short peak.',check:'Equipment startup records and simultaneous readings from other submeters.',days:[0]},
  'EVT-003': {cause:'operations',system:'Lighting',possible:'Lights may be scheduled to remain on outside normal occupied hours.',check:'Cleaning and security schedules, room bookings and lighting timer settings.',days:[0,1,3,5]},
  'EVT-004': {cause:'equipment',system:'Plug loads',possible:'Additional equipment or devices left on may have increased the base load.',check:'Equipment inventory changes and plug-load readings during unoccupied hours.',days:[0,1,2,3,4,5,6]},
  'EVT-005': {cause:'equipment',system:'Heating, cooling & ventilation',possible:'A controller setting or equipment fault may be causing repeated short cycles.',check:'Maintenance records, temperature setpoints and the control-system event log.',days:[0,2]},
  'EVT-006': {cause:'operations',system:'Plug loads',possible:'Extended opening hours or equipment left running may explain evening demand.',check:'The evening event schedule, building access hours and shutdown procedures.',days:[0,3]}
};
const signed = value => `${value>0?'+':''}${fmt(value,1)}%`;
const scenarioFor = event => eventContext[event.id];
const inBuildingScope = event => state.building==='all'||event.building===Number(state.building);

function causeFilter() {
  return `<label class="select-wrap"><select id="cause-filter" aria-label="Filter possible cause category"><option value="all">All possible causes</option>${Object.entries(causeGroups).map(([id,c])=>`<option value="${id}" ${state.eventCause===id?'selected':''}>${c.label}</option>`).join('')}</select></label>`;
}

function patternLegend() {
  return `<div class="pattern-legend" aria-label="Consistent anomaly pattern legend">${Object.entries(categories).map(([type,color])=>`<span><i style="background:${color}"></i>${categoryLabels[type]} <small>(${type})</small></span>`).join('')}</div>`;
}

function anomalyDistribution(list=filteredEvents()){return burgosDistribution(list);}

function feedAudit(selected=scopedBuildings()) {
  const expected=selected.reduce((sum,b)=>sum+b.meters*48,0);
  const missing=selected.reduce((sum,b)=>sum+(b.id%7===0?2:0),0);
  const invalid=selected.reduce((sum,b)=>sum+(b.id===15?3:0),0);
  return {expected,received:expected-missing,missing,invalid,availability:(expected-missing)/expected*100};
}

function healthIndicators() {
  const queue=events.filter(inBuildingScope),history=queue.flatMap(e=>scenarioFor(e).days.map(day=>({id:e.id,day})));
  const recurring=queue.filter(e=>scenarioFor(e).days.length>1),audit=feedAudit();
  return `<section class="card health-card"><div class="card-heading"><div><h2>Patterns and data health</h2><p>Recurrence uses the last 7 demo days ending ${dateLabel()}. Feed checks use the selected demo day.</p></div></div><div class="health-grid"><div><span>Affected meters today</span><strong>${new Set(activeEvents().map(e=>`${e.building}-${e.meter}`)).size}</strong><small>With an open event</small></div><div><span>Events over 7 demo days</span><strong>${history.length}</strong><small>${fmt(history.length/7,1)} events per day</small></div><div><span>Recurring meter patterns</span><strong>${recurring.length}</strong><small>More than one occurrence</small></div><div><span>Demo data availability</span><strong>${fmt(audit.availability,2)}%</strong><small>${audit.missing} missing · ${audit.invalid} invalid readings</small></div></div><p class="research-caption">Illustrative feed audit: ${fmt(audit.received)} of ${fmt(audit.expected)} expected 30-minute chart records received. Invalid records are included in received counts. These fixture counts are not a live DERConnect data-quality assessment.</p></section>`;
}

function durationHours(event) {
  const number=parseFloat(event.duration);
  return event.duration.includes('min')?number/60:number;
}

function eventTrace(event,zoom='day') {
  const start=Number(event.time.slice(0,2))+Number(event.time.slice(3))/60;
  const end=Math.min(24,start+durationHours(event));
  const low=zoom==='event'?Math.max(0,start-1):0;
  const high=zoom==='event'?Math.min(24,end+1):24;
  const step=zoom==='event'?1/12:.25;
  const length=Math.round((high-low)/step)+1;
  return Array.from({length},(_,i)=>{
    const hour=low+i*step,trend=60+hour*.1,seasonality=12*Math.sin((hour-6)/24*2*Math.PI),shape=28+18*Math.max(0,Math.sin((hour-6)/24*2*Math.PI));
    const expected=trend+seasonality+shape;
    const flagged=hour>=start-1e-7&&(hour<end-1e-7||(end===24&&hour===24));
    let deviation=event.deviation/100;
    if(event.category==='Trend')deviation*=hour/24;
    if(event.category==='Shapelet')deviation*=Math.round((hour-start)*12)%2===0?1:.25;
    const actual=expected*(flagged?1+deviation:.985+.012*Math.sin(hour*2));
    return {hour,trend,seasonality,shape,expected,actual,flagged};
  });
}

function traceSvg(event,{zoom='day',history=false,reference=null,component=null}={}) {
  const data=eventTrace(event,zoom),W=650,H=200,left=39,right=12,top=20,bottom=30,width=W-left-right,height=H-top-bottom;
  const hour0=data[0].hour,hour1=data.at(-1).hour;
  const color=categories[event.category];
  const entries=component?[{key:component,color:'#64834d',label:component}]:[{key:'expected',color:'#9eac91',label:'Expected'},{key:'actual',color:'#376e4c',label:'Measured'}];
  const values=data.flatMap(p=>entries.map(entry=>p[entry.key]));
  const minimum=component==='seasonality'?-20:0,maximum=Math.ceil(Math.max(20,...values)/40)*40;
  const x=h=>left+(h-hour0)/(hour1-hour0)*width,y=value=>top+height-(value-minimum)/(maximum-minimum)*height;
  const path=fn=>data.map((p,i)=>`${i?'L':'M'}${x(p.hour).toFixed(2)},${y(fn(p,i)).toFixed(2)}`).join(' ');
  const start=Number(event.time.slice(0,2))+Number(event.time.slice(3))/60,end=Math.min(24,start+durationHours(event));
  const interval=!component&&event.category!=='Global'?`<rect x="${x(Math.max(hour0,start))}" y="${top}" width="${Math.max(2,x(Math.min(hour1,end))-x(Math.max(hour0,start)))}" height="${height}" fill="${color}" opacity=".12"/>`:'';
  const historyPaths=history&&!component?[1,2,3].map(n=>`<path d="${path(p=>p.expected*(.96+n*.012+.009*Math.sin(p.hour+n)))}" fill="none" stroke="${['#a4bcb5','#b7c9bd','#cfdbce'][n-1]}" stroke-width="1.4"/>`).join(''):'';
  const referencePath=reference!==null&&!component?`<path d="${path(p=>p.expected*(.96+.02*Math.sin(p.hour+Number(reference))))}" fill="none" stroke="#6e96b0" stroke-width="1.8"/>`:'';
  return `<svg class="research-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${component?component+' component of the synthetic reference':event.title+' illustrative meter trace: measured versus expected demand'}"><text class="chart-axis" x="${left}" y="10">${component?'Relative units':'Relative demand · nominal = 100'}</text>${[0,.5,1].map(f=>{const value=minimum+(maximum-minimum)*f;return `<line class="chart-grid" x1="${left}" x2="${W-right}" y1="${y(value)}" y2="${y(value)}"/><text class="chart-axis" x="${left-8}" y="${y(value)+3}" text-anchor="end">${fmt(value)}</text>`;}).join('')}${interval}${historyPaths}${referencePath}${entries.map(entry=>`<path d="${path(p=>p[entry.key])}" fill="none" stroke="${entry.color}" stroke-width="${entry.key==='actual'?2.3:1.6}" ${entry.key==='expected'?'stroke-dasharray="5 5"':''}/>`).join('')}${!component&&event.category==='Global'?data.filter(p=>p.flagged).slice(0,1).map(p=>`<circle cx="${x(p.hour)}" cy="${y(p.actual)}" r="4.5" fill="${color}" stroke="white" stroke-width="1.5"/>`).join(''):''}${[0,1,2,3,4].map(i=>{const hour=hour0+(hour1-hour0)*i/4;return `<text class="chart-axis" x="${x(hour)}" y="${H-7}" text-anchor="${i===0?'start':i===4?'end':'middle'}">${String(Math.floor(hour)).padStart(2,'0')}:${String(Math.round(hour%1*60)).padStart(2,'0')}</text>`;}).join('')}</svg>`;
}

function eventContextPanel(event) {
  const context=scenarioFor(event),cause=causeGroups[context.cause];
  return `<section class="context-panel"><div class="context-label">LAI TIME-SERIES PATTERN</div><strong class="pattern-title" style="color:${categories[event.category]}">● ${categoryLabels[event.category]} <small>(${event.category})</small></strong><div class="context-label">POSSIBLE CAUSE CATEGORY · UNVERIFIED</div><span class="cause-tag" style="--cause-color:${cause.color}">${cause.label}</span><p>${context.possible}</p><div class="context-facts"><span><b>System</b>${context.system}</span><span><b>Timing</b>${event.time} · ${event.duration}</span><span><b>Demo recurrence</b>${context.days.length} occurrences in 7 days</span></div><h3>Evidence to check</h3><p>${context.check}</p><p class="research-caption">This category is written scenario guidance. No causal classifier is connected. A cyberattack cannot be confirmed from consumption alone.</p></section>`;
}

function eventTracePanel(event) {
  return `<section class="drawer-section"><h3>Reading in context</h3>${traceSvg(event,{zoom:'event'})}<p class="research-caption">${event.category==='Global'?'A colored dot marks a point anomaly.':'The shaded interval marks the full event duration.'} Solid = measured; dashed = expected. Relative demand is an illustrative meter trace, separate from campus kWh totals.</p></section>`;
}

function selectedTraceEvent() {
  const available=events.filter(inBuildingScope);
  return available.find(e=>e.id===state.traceEvent)||available[0];
}

function researchComparison() {
  const available=events.filter(inBuildingScope),event=selectedTraceEvent();
  if(!event)return `<section class="card analysis-card research-section"><h3>Meter and historical comparisons</h3><p>No example anomaly meters are attached to this building. Select all buildings to explore the demonstration traces.</p></section>`;
  let reference=Number(state.referenceBuilding);
  if(reference===event.building)reference=(reference+1)%buildings.length;
  const c=scenarioFor(event);
  return `<section class="card analysis-card research-section"><div class="research-heading"><div><h3>Investigate a meter pattern</h3><p>Compare a flagged meter with a reference meter and three synthetic comparable days.</p></div><span class="demo-label">SCENARIO TRACES</span></div><div class="research-controls"><label>Flagged meter<select id="trace-event">${available.map(e=>`<option value="${e.id}" ${e.id===event.id?'selected':''}>${buildings[e.building].name} · ${e.meter}</option>`).join('')}</select></label><label>Reference building<select id="reference-building">${buildings.filter(b=>b.id!==event.building).map(b=>`<option value="${b.id}" ${b.id===reference?'selected':''}>${b.name} · ${event.meter}</option>`).join('')}</select></label><label>Time window<select id="trace-zoom"><option value="day" ${state.traceZoom==='day'?'selected':''}>Full day · 15-minute intervals</option><option value="event" ${state.traceZoom==='event'?'selected':''}>Around event · 5-minute intervals</option></select></label></div><div class="research-subheading"><strong>${categoryLabels[event.category]} <span>(${event.category})</span></strong><span>Peak deviation ${signed(event.deviation)} · ${event.duration}</span></div>${traceSvg(event,{zoom:state.traceZoom,history:state.historyOverlay,reference})}<div class="legend research-legend"><span><i></i>Flagged meter</span><span><i class="expected"></i>Expected</span><span><i style="background:#6e96b0"></i>Reference meter</span>${state.historyOverlay?'<span><i style="background:#b7c9bd"></i>3 comparable days</span>':''}</div><button class="button history-toggle" id="history-toggle" aria-pressed="${state.historyOverlay}">${icon('layers')}${state.historyOverlay?'Hide':'Show'} comparable days</button><p class="research-caption">Both meters are simulated ${c.system.toLowerCase()} scenarios, normalized to the same nominal scale of 100 for shape comparison. The reference meter is not a verified fault-free building. The historical curves are generated reference examples, not retrieved measurements.</p><details class="component-details"><summary>Explore the reference components <span>Trend · seasonality · daily load shape</span></summary><p>The synthetic reference is the sum of these known components. This demonstrates Lai’s pattern context; it is not a decomposition fitted by a trained model.</p><div class="component-grid">${[['trend','Long-term trend'],['seasonality','Daily seasonality'],['shape','Basic load shape']].map(([key,label])=>`<section><h4>${label}</h4>${traceSvg(event,{component:key})}</section>`).join('')}</div></details></section>`;
}

function schemaComparison() {
  const baseline=modelMetrics('naive');
  const change=(current,base)=>{const delta=(current/base-1)*100;return Math.abs(delta)>5?`<span class="${delta>0?'trend-good':'trend-bad'}">${delta>0?'↑':'↓'} ${fmt(Math.abs(delta),1)}%</span>`:'<span class="neutral-change">—</span>';};
  return `<section class="card research-section"><div class="card-heading"><div><h2>Seen versus unseen meters</h2><p>Side-by-side demo evaluation · arrows mark relative score changes greater than 5% versus per-meter training.</p></div></div><div class="table-scroll"><table class="schema-table"><thead><tr><th>Training / test setup</th><th>Precision</th><th>Recall</th><th>Event F1</th><th>Latency</th></tr></thead><tbody>${[['naive','Per-meter','Previously seen meters'],['all-in-one','One unified model','Previously seen meters'],['zero-shot','Zero-shot','Previously unseen meters']].map(([id,title,sub])=>{const m=modelMetrics(id);return `<tr><td><strong class="row-title">${title}</strong><span class="event-building">${sub}</span></td>${['p','r','f'].map(key=>`<td>${fmt(m[key]*100,1)}% ${id==='naive'?'':change(m[key],baseline[key])}</td>`).join('')}<td>${m.lat} s</td></tr>`;}).join('')}</tbody></table></div><p class="research-caption">These figures come from the demo confusion-count fixtures. They are not results from Si’s paper or from a model trained for this project.</p></section>`;
}

function pointEvaluation(schema=state.schema) {
  const truth=Array.from({length:32},(_,i)=>[5,6,7,14,15,24,25,29,30].includes(i));
  const detectedIndices={naive:[6,7,14,15,19,25],'all-in-one':[5,6,7,14,15,19,24,25],'zero-shot':[6,7,14,19,20,25]}[schema];
  const predicted=truth.map((_,i)=>detectedIndices.includes(i));
  const counts={tp:0,fp:0,fn:0,tn:0};
  truth.forEach((v,i)=>counts[v?(predicted[i]?'tp':'fn'):(predicted[i]?'fp':'tn')]++);
  return {truth,predicted,...counts};
}

function pointTimeline() {
  const fixture=pointEvaluation(),colors={tp:'#72945e',fp:'#d4a363',fn:'#bf7f75',tn:'#e5ecdd'};
  const cells=(values,row)=>values.map((flag,i)=>{const result=fixture.truth[i]?(fixture.predicted[i]?'tp':'fn'):(fixture.predicted[i]?'fp':'tn');const color=row==='truth'?(flag?'#799b62':'#edf1e7'):row==='predicted'?(flag?'#6d94aa':'#edf1e7'):colors[result];return `<span style="background:${color}" title="Window ${i+1}: ${row==='outcome'?result.toUpperCase():flag?'anomalous':'normal'}"><span class="screen-reader">${row} window ${i+1}: ${row==='outcome'?result:flag?'anomalous':'normal'}</span></span>`;}).join('');
  const p=fixture.tp/(fixture.tp+fixture.fp),r=fixture.tp/(fixture.tp+fixture.fn);
  return `<section class="card analysis-card research-section"><h3>Ground truth versus detections</h3><p>Separate 32-window fixture for the selected schema. Each column is the same timestamp across all three rows.</p><div class="point-timeline">${[['truth','Ground truth',fixture.truth],['predicted','Detected',fixture.predicted],['outcome','Outcome',fixture.truth]].map(([key,label,values])=>`<div class="timeline-row"><b>${label}</b><div>${cells(values,key)}</div></div>`).join('')}</div><div class="legend research-legend"><span><i></i>True positive</span><span><i style="background:#d4a363"></i>False positive</span><span><i style="background:#bf7f75"></i>False negative</span><span><i style="background:#e5ecdd"></i>True negative</span></div><p>Point precision ${fmt(p*100,1)}% · recall ${fmt(r*100,1)}% · ${fixture.tp} TP / ${fixture.fp} FP / ${fixture.fn} FN / ${fixture.tn} TN.</p><p class="research-caption">Contiguous anomalous windows form events. Point metrics here and the full 200-event evaluation above have different denominators and should not be compared as equivalent scores.</p></section>`;
}

function mixedTypeEvaluation() {
  const rows=Array.from({length:5},(_,i)=>{const tp=20-i*2,fp=2+i,fn=2+i*2;return {types:i+1,tp,fp,fn,f1:2*tp/(2*tp+fp+fn)};});
  return `<section class="card analysis-card research-section"><h3>Performance as pattern types are mixed</h3><p>Illustrative stress-test fixtures, inspired by Lai’s mixed-outlier comparison. These are not measured performance results.</p>${rows.map(row=>`<div class="distribution-row"><span>${row.types} ${row.types===1?'pattern type':'pattern types'}</span><div class="bar-track"><i style="width:${row.f1*100}%"></i></div><b>${fmt(row.f1,2)}</b></div>`).join('')}<p class="research-caption">F1 = 2TP / (2TP + FP + FN). The demo counts vary from 20/2/2 to 12/6/10 (TP/FP/FN); the displayed decrease is a constructed example, not a finding about a chosen model.</p></section>`;
}

function bindResearch() {
  for(const [id,key] of [['trace-event','traceEvent'],['reference-building','referenceBuilding'],['trace-zoom','traceZoom']]) {
    document.getElementById(id)?.addEventListener('change',event=>{state[key]=event.target.value;render({animate:false});});
  }
  $('#history-toggle')?.addEventListener('click',()=>{state.historyOverlay=!state.historyOverlay;render({animate:false});});
}

function overviewEventAt(point) {
  if(state.period!=='day')return null;
  const id=point.index===21?'EVT-002':[28,29].includes(point.index)?'EVT-001':null;
  return id?events.find(event=>event.id===id&&inBuildingScope(event)):null;
}
