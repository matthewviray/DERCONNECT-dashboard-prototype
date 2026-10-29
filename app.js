'use strict';
const icons={leaf:'<path d="M19 3C10 2 3 6 4 13c1 7 10 8 13 2 2-4 2-8 2-12Z"/><path d="M3 21 15 8M8 15l-1-5m5 1 5 1"/>',sprout:'<path d="M12 21v-9M12 15C4 16 2 11 3 6c6-1 9 2 9 9ZM12 12c-1-7 3-10 9-9 1 6-3 10-9 9Z"/>',building:'<path d="M4 21V5l8-2v18M12 8h8v13M2 21h20M7 7h2m-2 4h2m-2 4h2m6-3h2m-2 4h2M7 21v-3h2v3"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',chart:'<path d="M3 3v18h18M7 15l4-5 4 3 6-8"/>',alert:'<path d="m10 4-8 14a2 2 0 0 0 2 3h16a2 2 0 0 0 2-3L14 4a2.3 2.3 0 0 0-4 0Z"/><path d="M12 9v5m0 3v.2"/>',activity:'<path d="M2 12h4l3-8 6 16 3-8h4"/>',file:'<path d="M14 2H5v20h14V7ZM14 2v6h5M8 12h8m-8 4h6"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3v.1"/>',arrowUpRight:'<path d="M6 18 18 6M6 6h12v12"/>',arrowRight:'<path d="M4 12h16m-6-6 6 6-6 6"/>',chevrons:'<path d="m8 8 4-4 4 4m-8 8 4 4 4-4"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',bolt:'<path d="m14 2-10 12h7l-1 8 10-12h-7Z"/>',meter:'<path d="M4 18a9 9 0 1 1 16 0ZM12 13l4-5"/><circle cx="12" cy="13" r="1"/>',cloud:'<path d="M7 18h11a5 5 0 1 0-2-9A7 7 0 0 0 3 11a4 4 0 0 0 4 7Z"/>',filter:'<path d="M3 6h18M6 12h12m-8 6h4"/>',x:'<path d="m6 6 12 12M6 18 18 6"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',check:'<path d="m5 12 4 4L19 6"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',layers:'<path d="m12 3 10 6-10 6L2 9Zm-9 11 9 5 9-5M3 18l9 5 9-5"/>'};
const icon=(name)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.activity}</svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));}
const names=['Geisel Library','Price Center','Jacobs Hall','Atkinson Hall','RIMAC','York Hall','Mandeville Center','Warren Lecture Hall','Galbraith Hall','Center Hall','Bonner Hall','Mayer Hall','Urey Hall','Revelle Commons','Pacific Hall','AP&M Building','Social Sciences Building','Cognitive Science Building','Student Services Center','Structural Engineering','Music Center','Oceanview Terrace','Biomedical Sciences','Science & Engineering'];
const buildings=names.map((name,i)=>({id:i,name,meters:i<20?10:9,scale:1.85-i*.045,status:[2,4,7,15].includes(i)?'Needs review':'Healthy',change:[-8.2,-5.1,12.4,-6.7,8.3,-3.6,-4.5,7.8,-2.9,-5.2,-3.4,-7.2,-6.1,-3.3,-8.5,9.1,-4.8,-2.2,-6.5,-4.3,-5.8,-3.5,-7.3,-4.9][i]}));
const categories={Global:'#c68470',Contextual:'#d3a25b',Shapelet:'#7ba2b4',Seasonal:'#a196bc',Trend:'#9cae62'};
const events=[
 {id:'EVT-001',building:2,meter:'AHU-03',title:'Unexpected HVAC demand',category:'Contextual',severity:'High',time:'14:00',duration:'45 min',deviation:42,status:'New',reason:'Air-handling demand exceeded the comparable-day baseline during an otherwise stable occupancy period.',alternative:'A scheduled laboratory session or a temporary ventilation override could explain the elevated demand.',action:'Confirm occupancy and check the AHU-03 operating schedule before requesting a maintenance inspection.'},
 {id:'EVT-002',building:4,meter:'MAIN-01',title:'Short-duration demand spike',category:'Global',severity:'High',time:'10:30',duration:'15 min',deviation:56,status:'New',reason:'A single demand peak exceeded the synthetic expected range by 56%.',alternative:'An equipment startup or scheduled large event could cause a legitimate short-duration peak.',action:'Compare the main meter with equipment startup logs and other submeters.'},
 {id:'EVT-003',building:7,meter:'LTG-02',title:'Lighting outside occupied hours',category:'Seasonal',severity:'Medium',time:'02:00',duration:'2 hr',deviation:28,status:'Investigating',reason:'The usual overnight lighting reduction did not occur in this simulated daily pattern.',alternative:'Cleaning, security rounds, or an overnight event may require lighting to remain on.',action:'Confirm room bookings and cleaning schedules, then review lighting timers.'},
 {id:'EVT-004',building:15,meter:'PLG-04',title:'Gradual increase in base load',category:'Trend',severity:'Medium',time:'00:00',duration:'24 hr',deviation:18,status:'New',reason:'The simulated daily base load is rising relative to comparable days.',alternative:'New equipment or a change in laboratory occupancy could increase the legitimate base load.',action:'Review recently installed equipment and compare unoccupied-hours plug loads.'},
 {id:'EVT-005',building:2,meter:'AHU-01',title:'Unusual equipment cycling',category:'Shapelet',severity:'Medium',time:'08:00',duration:'1 hr',deviation:23,status:'Investigating',reason:'The observed load shape contains repeated short cycles that differ from the synthetic baseline.',alternative:'A temporary controller test or a change in temperature setpoints may produce this pattern.',action:'Check the maintenance log and review controller setpoints with the facilities team.'},
 {id:'EVT-006',building:4,meter:'PLG-01',title:'Sustained evening demand',category:'Contextual',severity:'Low',time:'18:00',duration:'3 hr',deviation:21,status:'New',reason:'Plug-load consumption remained above the expected evening reduction.',alternative:'An evening athletics event or extended building hours could explain the reading.',action:'Confirm the event schedule and review equipment shutdown practices.'}
];
events.forEach(event=>{event.excess=Number(eventEvidence(event).excess.toFixed(2));});
try{const saved=JSON.parse((localStorage.getItem('derconnect-dashboard-events')||localStorage.getItem('verdant-events'))||'{}');events.forEach(e=>{if(saved[e.id]){if(['New','Investigating','Resolved'].includes(saved[e.id].status))e.status=saved[e.id].status;if(typeof saved[e.id].note==='string')e.note=saved[e.id].note;}});}catch{}
const state={view:'overview',building:'all',period:'day',date:'2026-10-26',query:'',buildingDisplay:'heatmap',buildingSort:'energy',eventType:'all',eventStatus:'open',eventSeverity:'all',eventCause:'all',burgosCategory:'all',attentionEvent:'EVT-001',traceEvent:'EVT-001',referenceBuilding:'3',traceZoom:'day',historyOverlay:false,schema:'all-in-one',compare:false};
const $=(s)=>document.querySelector(s), fmt=(v,d=0)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
const escapeHTML=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const activeEvents=()=>events.filter(e=>e.status!=='Resolved'&&(state.building==='all'||e.building===Number(state.building)));
const filteredEvents=()=>events.filter(e=>(state.building==='all'||e.building===Number(state.building))&&(state.eventType==='all'||e.category===state.eventType)&&(state.eventStatus==='all'||(state.eventStatus==='open'?e.status!=='Resolved':e.status===state.eventStatus))&&(state.eventSeverity==='all'||e.severity===state.eventSeverity)&&(state.eventCause==='all'||scenarioFor(e).cause===state.eventCause)&&(state.burgosCategory==='all'||burgosAssignments[e.id]===state.burgosCategory));
const scopedBuildings=()=>state.building==='all'?buildings:buildings.filter(b=>b.id===Number(state.building));
const navs=[['overview','grid','Overview'],['buildings','building','Buildings'],['analytics','chart','Energy insights'],['anomalies','alert','Needs attention'],['models','activity','Detection quality'],['reports','file','Reports'],['methodology','layers','Data & methodology']];
function renderNav() {
  const nav = $('#navigation');
  if (!nav.querySelector('.nav-indicator')) {
    nav.innerHTML = '<span class="nav-indicator" aria-hidden="true"></span>' + navs.map(([id,ic,label]) => `<a href="#${id}" data-nav="${id}" class="nav-item">${icon(ic)}<span>${label}</span>${id==='anomalies'?'<span class="nav-count"></span>':''}</a>`).join('');
  }
  nav.querySelectorAll('[data-nav]').forEach(link => {
    const active = link.dataset.nav === state.view;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
  const count = nav.querySelector('.nav-count');
  count.textContent = events.filter(e=>e.status!=='Resolved').length;
  const active = nav.querySelector('.nav-item.active');
  const indicator = nav.querySelector('.nav-indicator');
  indicator.style.transform = `translateY(${active.offsetTop}px)`;
  indicator.style.height = active.offsetHeight+'px';
}
function series(building=state.building){const count=state.period==='day'?49:state.period==='week'?28:30;const scope=building==='all'?1:buildings[Number(building)].scale/buildings.reduce((a,b)=>a+b.scale,0);const dateSeed=Number(state.date.slice(-2))%5;return Array.from({length:count},(_,i)=>{let h=state.period==='day'?i/2:(i%4)*6;let expected=(470+650*Math.max(0,Math.sin((h-6)/24*Math.PI*2))+(state.period==='day'?0:70*Math.sin(i/3))+dateSeed*9)*scope;let actual=expected*(.94+.045*Math.sin(i*1.7));if(events.some(e=>e.id==='EVT-001'&&(building==='all'||e.building===Number(building)))&&state.period==='day'&&i>=28&&i<=29)actual*=1+.42*(building==='all'?buildings[2].scale/buildings.reduce((a,b)=>a+b.scale,0):1);if(events.some(e=>e.id==='EVT-002'&&(building==='all'||e.building===Number(building)))&&state.period==='day'&&i===21)actual*=1+.25*(building==='all'?buildings[4].scale/buildings.reduce((a,b)=>a+b.scale,0):1);if(state.period!=='day'&&i%11===6)actual*=1.24;return {expected,actual,h,index:i};});}
function totals(building=state.building){const data=series(building);const step=state.period==='day'?.5:state.period==='week'?6:24;const energy=data.reduce((a,p,i)=>a+p.actual*(state.period==='day'&&(i===0||i===data.length-1)?.5:1),0)*step;const expected=data.reduce((a,p,i)=>a+p.expected*(state.period==='day'&&(i===0||i===data.length-1)?.5:1),0)*step;return {energy,expected,peak:Math.max(...data.map(x=>x.actual)),carbon:energy*.23/1000,saved:Math.max(0,expected-energy),meters:(building==='all'?buildings:buildings.filter(b=>b.id===Number(building))).reduce((a,b)=>a+b.meters,0)};}
function dateLabel(){const d=new Date(state.date+'T12:00:00');return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}
function heading(title,sub,eyebrow='CAMPUS ENERGY'){return `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${sub}</p></div><div class="heading-actions"><label class="select-wrap date-button"><span>${icon('calendar')}</span><select id="date-filter" aria-label="Dataset date">${['2026-10-26','2026-10-25','2026-10-24'].map(d=>`<option value="${d}" ${state.date===d?'selected':''}>${new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</option>`).join('')}</select></label><button class="button primary" data-export="energy">${icon('download')}Export report</button></div></div>`;}
function filters(){return `<div class="filterbar"><div class="filter-group"><label class="select-wrap"><span>${icon('building')}</span><select id="building-filter" aria-label="Filter by building"><option value="all" ${state.building==='all'?'selected':''}>All buildings · 24</option>${buildings.map(b=>`<option value="${b.id}" ${String(b.id)===state.building?'selected':''}>${b.name}</option>`).join('')}</select></label><div class="period-switch ${state.periodMoving?'period-moving':''}" style="--period-index:${['day','week','month'].indexOf(state.period)};--period-from:${state.periodFrom??0}" aria-label="Time range">${[['day','Day'],['week','Week'],['month','Month']].map(([id,l])=>`<button data-period="${id}" class="${state.period===id?'active':''}" aria-pressed="${state.period===id}">${l}</button>`).join('')}</div></div><span class="freshness"><i></i>Demo snapshot · ${dateLabel()}</span></div>`;}
function spark(type){const paths=['M1 22L7 19 13 20 20 11 27 14 34 13 41 7 48 11 55 5 62 9 70 3','M1 17L8 17 15 10 22 14 29 7 36 11 43 14 50 8 57 10 64 5 72 7','M1 20L9 20 16 15 24 17 32 8 40 12 48 8 56 13 64 6 72 10','M1 7L9 7 16 7 23 18 30 18 37 11 44 11 51 18 58 18 65 15 72 15'];return `<svg class="sparkline" viewBox="0 0 75 28" aria-hidden="true"><path d="${paths[type]}L72 28H1Z" fill="${type===3?'#f9f2e6':'#eef4e7'}"/><path d="${paths[type]}" fill="none" stroke="${type===3?'#cba56e':'#86a66a'}" stroke-width="1.4" stroke-linejoin="round"/></svg>`;}
function kpis(){const t=totals(),prior=scopedBuildings().reduce((a,b)=>a+totals(String(b.id)).energy/(1+b.change/100),0),periodChange=(t.energy/prior-1)*100,delta=`${periodChange<0?'↘':'↗'} ${fmt(Math.abs(periodChange),1)}%`;return `<div class="kpi-grid">${[
 ['Total energy use',fmt(t.energy),'kWh','bolt',delta,'vs. previous period',0],
 ['Peak demand',fmt(t.peak),'kW','meter','↘ 3.2%','vs. previous period',1],
 ['Estimated emissions',fmt(t.carbon,2),'t CO₂e','leaf',delta,'vs. previous period',2],
 ['Events to review',activeEvents().length,'events','alert',`${scopedBuildings().filter(b=>activeEvents().some(e=>e.building===b.id)).length} buildings`,'need a closer look',3]
 ].map(([label,value,unit,ic,change,note,n])=>`<div class="card kpi"><div class="kpi-top">${label}<span class="kpi-icon">${icon(ic)}</span></div><div class="kpi-value">${value}<small>${unit}</small></div><p class="metric-explanation">${['Electricity used over this period','Highest electricity demand','Estimated greenhouse-gas emissions','Unusual usage patterns to review'][n]}</p><div class="kpi-bottom"><div class="change ${n===3||(n!==1&&periodChange>0)?'amber':''}">${change}<span>${note}</span></div>${spark(n)}</div></div>`).join('')}</div>`;}
function chartMarkup(){const data=series(),W=710,H=230,left=44,right=17,top=25,bottom=29,plotW=W-left-right,plotH=H-top-bottom;const max=Math.ceil(Math.max(...data.map(p=>Math.max(p.actual,p.expected)))/ (state.building==='all'?400:20))*(state.building==='all'?400:20);const x=i=>left+i/(data.length-1)*plotW,y=v=>top+plotH-(v/max)*plotH;const path=key=>data.map((p,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');const actual=path('actual');let labels=Array.from({length:7},(_,i)=>{if(state.period==='day')return String(i*4).padStart(2,'0')+':00';const d=new Date(state.date+'T12:00:00');d.setDate(d.getDate()-(state.period==='week'?6-i:Math.round((6-i)*29/6)));return d.toLocaleDateString('en-US',state.period==='week'?{weekday:'short'}:{month:'short',day:'2-digit'});});return `<svg class="energy-chart" id="energy-chart" tabindex="0" viewBox="0 0 ${W} ${H}" role="img" aria-label="${state.period} electricity demand: actual and expected power in kilowatts, with highlighted simulated anomalies. Use left and right arrow keys to inspect readings"><defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#90b574" stop-opacity=".22"/><stop offset="100%" stop-color="#90b574" stop-opacity=".01"/></linearGradient></defs><text class="chart-axis" x="${left}" y="11">kW</text>${Array.from({length:5},(_,i)=>{const v=max/4*i;return `<line class="chart-grid" x1="${left}" x2="${W-right}" y1="${y(v)}" y2="${y(v)}"/><text class="chart-axis" text-anchor="end" x="${left-10}" y="${y(v)+3}">${fmt(v)}</text>`;}).join('')}${state.period==='day'&&events.some(e=>e.id==='EVT-001'&&inBuildingScope(e))?`<rect class="chart-band" style="fill:${categories.Contextual}" x="${x(27.7)}" y="${top}" width="${x(29.5)-x(27.7)}" height="${plotH}"/>`:''}<path d="${actual}L${x(data.length-1)} ${top+plotH}L${left} ${top+plotH}Z" fill="url(#chart-fill)"/><path class="expected-line" d="${path('expected')}"/>${state.compare?`<path d="${data.map((p,i)=>`${i?'L':'M'}${x(i)},${y(p.expected*.81)}`).join(' ')}" fill="none" stroke="#83a4b3" stroke-width="1.5"/>`:''}<path class="actual-line" d="${actual}"/>${data.filter(p=>overviewEventAt(p)||p.actual>p.expected*1.15).map(p=>`<circle class="chart-marker" style="fill:${categories[overviewEventAt(p)?.category||'Global']}" cx="${x(p.index)}" cy="${y(p.actual)}" r="4.5"/>`).join('')}${labels.map((l,i)=>`<text class="chart-axis" text-anchor="${i===0?'start':i===6?'end':'middle'}" x="${left+i/6*plotW}" y="${H-6}">${l}</text>`).join('')}<line id="chart-hover-line" x1="0" y1="${top}" x2="0" y2="${top+plotH}" stroke="#b1c49c" stroke-dasharray="3 3" visibility="hidden"/><circle id="chart-hover-dot" r="4" fill="#396c49" stroke="white" stroke-width="2" visibility="hidden"/><rect id="chart-hit-area" x="${left}" y="${top}" width="${plotW}" height="${plotH}" fill="transparent"/></svg><div class="chart-tooltip" id="chart-tooltip" role="status" aria-live="off"></div>`;}
function energyCard(detailed=false){return `<section class="card"><div class="card-heading"><div><h2>Electricity demand</h2><p>${state.building==='all'?'Campus-wide electricity demand':buildings[Number(state.building)].name+' demand'} · ${state.period==='day'?'30-minute':'Aggregated'} intervals</p></div><div class="chart-head-right"><div class="legend"><span><i></i>Measured</span><span><i class="expected"></i>Expected</span></div>${detailed?'':`<button class="button small" data-view="analytics" aria-label="Explore energy insights">${icon('arrowUpRight')}</button>`}</div></div><div class="chart-wrap">${chartMarkup()}</div><div class="chart-foot"><span>${icon('alert')}${state.period==='day'?(events.some(e=>e.id==='EVT-001'&&inBuildingScope(e))?'Example HVAC submeter event at 14:00':'Compare the measured and expected profiles'):'Highlighted points exceed the simulated baseline'}</span><span class="unit-note">${detailed?'Hover to inspect readings':'Shaded area = unusual demand'}</span></div><p class="chart-help">The solid line shows measured demand. The dashed line shows expected demand for a comparable day. Hover, tap, or use arrow keys to inspect. Select a highlighted point or press Enter for its event details.</p></section>`;}
function breakdown(){const t=totals(),shares=[['Heating, cooling & ventilation',47,'#43694a'],['Lighting',24,'#85a56a'],['Plug loads',19,'#bdd19a'],['Other',10,'#e8eddd']];let off=0;return `<section class="card breakdown"><div class="card-heading"><div><h2>Where energy goes</h2><p>Share of electricity used by each system</p></div><span style="color:#a9b299">${icon('layers')}</span></div><div class="donut-content"><svg class="donut" viewBox="0 0 160 160" role="img" aria-label="Energy breakdown: HVAC 47%, lighting 24%, plug loads 19%, other 10%">${shares.map(([,p,c])=>{const d=off;off+=p;return `<circle cx="80" cy="80" r="63" pathLength="100" stroke="${c}" stroke-dasharray="${p-1.1} ${101.1-p}" stroke-dashoffset="${-d}"/>`;}).join('')}</svg><div class="donut-center"><strong>${fmt(t.energy)}</strong><span>kWh total</span></div></div><div class="breakdown-list">${shares.map(([l,p,c])=>`<div class="breakdown-item"><span><i style="background:${c}"></i>${l}</span><b>${p}%</b></div>`).join('')}</div></section>`;}
function buildingRows(list){return list.map(b=>{const energy=totals(String(b.id)).energy;const open=events.filter(e=>e.building===b.id&&e.status!=='Resolved').length;return `<tr data-building="${b.id}" tabindex="0" aria-label="Inspect ${b.name}"><td><span class="building-name"><span class="building-mini-icon">${icon('building')}</span>${b.name}</span></td><td class="table-energy">${fmt(energy)} <span>kWh</span></td><td><span class="${b.change<0?'trend-good':'trend-bad'}">${b.change<0?'↘':'↗'} ${Math.abs(b.change)}%</span></td><td><span class="badge ${open?'warning':''}"><i></i>${open?'Needs review':'Healthy'}</span></td><td style="color:#a5af98">${icon('arrowUpRight')}</td></tr>`;}).join('');}
function buildingTable(){return `<section class="card building-card"><div class="card-heading"><div><h2>Building performance</h2><p>Select a building to see details and open events.</p></div><button class="heading-link" data-view="buildings">View all buildings ${icon('arrowRight')}</button></div><div class="table-scroll"><table><thead><tr><th>Building</th><th>Energy use</th><th>vs. prior period</th><th>Status</th><th></th></tr></thead><tbody>${buildingRows(scopedBuildings().slice(0,4))}</tbody></table></div><div class="table-bottom"><span>Showing ${Math.min(scopedBuildings().length,4)} of ${scopedBuildings().length} buildings</span><span>${totals().meters} meters in this selection</span></div></section>`;}
function opportunityCard(){const overnight=events.find(e=>e.id==='EVT-003'&&e.status!=='Resolved'&&(state.building==='all'||e.building===Number(state.building)));return `<section class="card insight-card"><div class="insight-label">${icon('sun')}AN OPPORTUNITY TO SAVE</div><h3>${overnight?'Check after-hours lighting':'Find opportunities in your energy use'}</h3><p>${overnight?'Warren Lecture Hall shows elevated overnight lighting use. Check room bookings and cleaning schedules first.':'Compare measured and expected demand to see when operating schedules could be improved.'}</p><button id="insight-investigate" data-insight-event="${overnight?.id||''}">${overnight?'Review this event':'Explore energy use'} ${icon('arrowRight')}</button></section>`;}
function overview(){return heading('Campus overview','See how your buildings are using energy and what needs attention.')+filters()+kpis()+priorityBanner()+`<div class="dashboard-row">${energyCard()}${breakdown()}</div><div class="lower-row">${buildingTable()}${opportunityCard()}</div>${healthIndicators()}`;}
const buildingMetrics = [
  {key:'energy',label:'Energy use',unit:'kWh',digits:0},
  {key:'peak',label:'Peak demand',unit:'kW',digits:1},
  {key:'deviation',label:'vs. expected',unit:'%',digits:1,signed:true},
  {key:'change',label:'vs. prior period',unit:'%',digits:1,signed:true},
  {key:'events',label:'Open events',unit:'events',digits:0},
  {key:'availability',label:'Data availability',unit:'%',digits:2}
];
function buildingComparisonData() {
  return buildings.map(building=>{
    const total=totals(String(building.id));
    return {building,energy:total.energy,peak:total.peak,deviation:(total.energy/total.expected-1)*100,
      change:building.change,events:events.filter(event=>event.building===building.id&&event.status!=='Resolved').length,
      availability:feedAudit([building]).availability};
  });
}
function heatmapColor(value,min,max) {
  // Keep colors stable across searches and building filters, using the full portfolio.
  const level=max===min ? .5 : Math.max(0,Math.min(1,(value-min)/(max-min)));
  const low=[239,245,232],high=[47,101,76];
  const rgb=low.map((channel,i)=>Math.round(channel+(high[i]-channel)*level));
  const linear=rgb.map(channel=>{const value=channel/255;return value<=.04045?value/12.92:((value+.055)/1.055)**2.4;});
  const luminance=linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
  return {background:`rgb(${rgb.join(',')})`,foreground:luminance>.179?'#000000':'#ffffff'};
}
function buildingHeatmap(rows,portfolio) {
  const ranges=buildingMetrics.map(metric=>{
    const values=portfolio.map(row=>row[metric.key]);
    return {min:Math.min(...values),max:Math.max(...values)};
  });
  return `<section class="card heatmap-card" aria-labelledby="heatmap-title">
    <div class="card-heading"><div><h2 id="heatmap-title">Buildings × metrics</h2><p>Read down a column to compare buildings. Select a cell to open its building profile.</p></div><span class="demo-label">SIMULATED DATA</span></div>
    <div class="heatmap-key" id="heatmap-description"><span>Lower value</span><span class="heatmap-gradient" aria-hidden="true"></span><span>Higher value</span><p>Each column has its own scale across all 24 buildings. Darker means higher, regardless of whether higher is desirable.</p></div>
    <div class="table-scroll heatmap-scroll" role="region" aria-label="Building comparison heat map" tabindex="0">
      <table class="heatmap-table" aria-describedby="heatmap-description heatmap-note"><caption class="screen-reader">Building metrics for ${state.period} ending ${dateLabel()}. Values and units are shown in every cell.</caption>
        <thead><tr><th scope="col">Building</th>${buildingMetrics.map(metric=>`<th scope="col">${metric.label}<span>${metric.unit}</span></th>`).join('')}</tr></thead>
        <tbody>${rows.map(row=>`<tr><th scope="row"><button class="heatmap-building" data-building="${row.building.id}">${icon('building')}<span>${row.building.name}</span></button></th>${buildingMetrics.map((metric,i)=>{
          const value=row[metric.key],color=heatmapColor(value,ranges[i].min,ranges[i].max);
          const display=`${metric.signed&&value>0?'+':''}${fmt(value,metric.digits)}`;
          const description=`${row.building.name} · ${metric.label}: ${display} ${metric.unit}. Open building profile.`;
          return `<td><button class="heatmap-cell" data-building="${row.building.id}" style="background:${color.background};color:${color.foreground}" title="${escapeHTML(description)}" aria-label="${escapeHTML(description)}"><strong>${display}</strong><span>${metric.unit}</span></button></td>`;
        }).join('')}</tr>`).join('')}</tbody>
      </table>${!rows.length?'<div class="empty-state">No buildings match your search.</div>':''}
    </div><p class="research-caption" id="heatmap-note">Energy, peak demand and expected-use differences follow the selected date and period. Open events and data availability describe the selected demo day. Prior-period changes are constructed fixtures. <a href="#methodology">Read the data and methodology ${icon('arrowUpRight')}</a></p>
  </section>`;
}
function buildingsView() {
  const query=state.query.toLowerCase(),portfolio=buildingComparisonData();
  const rows=portfolio.filter(row=>(state.building==='all'||row.building.id===Number(state.building))&&row.building.name.toLowerCase().includes(query));
  rows.sort((a,b)=>state.buildingSort==='name'?a.building.name.localeCompare(b.building.name):b[state.buildingSort]-a[state.buildingSort]||a.building.id-b.building.id);
  return heading('Your buildings','Compare buildings across energy, demand, events and data quality.','BUILDING PORTFOLIO')+filters()+`
    <div class="toolbar building-toolbar"><div class="building-view-switch" role="group" aria-label="Building comparison view">${[['heatmap','grid','Heat map'],['table','building','Table']].map(([id,symbol,label])=>`<button data-building-display="${id}" class="${state.buildingDisplay===id?'active':''}" aria-pressed="${state.buildingDisplay===id}">${icon(symbol)}${label}</button>`).join('')}</div>
    <div class="building-comparison-controls"><label class="search">${icon('search')}<input id="building-search" placeholder="Search buildings…" value="${escapeHTML(state.query)}" aria-label="Search buildings"></label><label class="select-wrap"><span class="sort-label">Sort by</span><select id="building-sort" aria-label="Sort buildings"><option value="name" ${state.buildingSort==='name'?'selected':''}>Building name · A–Z</option>${buildingMetrics.map(metric=>`<option value="${metric.key}" ${state.buildingSort===metric.key?'selected':''}>${metric.label} · high to low</option>`).join('')}</select></label></div></div>
    <p class="building-result-count" role="status">${rows.length} ${rows.length===1?'building':'buildings'} · ${rows.reduce((sum,row)=>sum+row.building.meters,0)} submeters shown</p>
    ${state.buildingDisplay==='heatmap'?buildingHeatmap(rows,portfolio):`<section class="card full-table"><div class="table-scroll"><table><thead><tr><th>Building</th><th>Energy use</th><th>vs. prior period</th><th>Status</th><th>Details</th></tr></thead><tbody>${buildingRows(rows.map(row=>row.building))}</tbody></table>${!rows.length?'<div class="empty-state">No buildings match your search.</div>':''}</div></section>`}
    <p class="data-note">Building names and readings are illustrative. Select a building to inspect its demand and meter events. Changes compare against a constructed prior-period baseline.</p>`;
}
function methodologyView() {
  const definitions=[
    ['Energy use','kWh','Integrate simulated demand over the selected period. Day totals use 30-minute samples with half weight at the two endpoints; week totals use 6-hour samples, and month totals use daily samples.'],
    ['Peak demand','kW','The highest simulated measured demand sample in the selected period.'],
    ['Difference vs. expected','%','100 × (measured energy ÷ expected energy − 1). Expected demand comes from a generated comparable-day profile.'],
    ['Change vs. prior period','%','A fixed illustrative change assigned to each building. Prior-period energy is constructed as current energy ÷ (1 + change ÷ 100); no historical meter feed is retrieved.'],
    ['Estimated emissions','t CO₂e','Energy in kWh × 0.23 kg CO₂e/kWh ÷ 1,000. The emissions factor is illustrative and constant.'],
    ['Open events','events','Count events for the building whose review status is not Resolved. This is the selected demo day’s queue, including in week and month views.'],
    ['Data availability','%','100 × received ÷ expected records. Each meter expects 48 half-hour records per demo day. Missing records reduce availability; invalid records are included in received counts and reported separately.'],
    ['Event excess energy','kWh','Sum positive measured-minus-expected power over the flagged event interval, using the five-minute scenario trace. This trace is separate from the coarse campus summary.']
  ];
  return heading('Data & methodology','Understand the demo data, metric definitions and comparison assumptions.','BEHIND THE DASHBOARD')+`
    <section class="methodology-intro"><span class="methodology-intro-icon">${icon('layers')}</span><div><h2>A transparent view of a simulated campus</h2><p>All readings, building allocations, anomalies and detection results are simulated. This independent capstone prototype has no live DERConnect feed or trained anomaly-detection model connected.</p></div></section>
    <div class="methodology-facts">${[['24','Illustrative buildings'],['236','Simulated submeters'],['3','Selectable demo dates'],['6','Scenario events']].map(([value,label])=>`<div class="card"><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>
    <div class="two-columns methodology-columns"><section class="card analysis-card"><h3>Where the data comes from</h3><p>The portfolio uses 24 illustrative UC San Diego building names. The first 20 buildings have 10 meters each and the remaining four have nine, for 236 meters.</p><p>Demand is generated from a daily load shape, a small date-dependent adjustment and deterministic variation. Building profiles share this shape and are scaled by assigned weights, with selected example demand spikes.</p><p>The selectable snapshots are October 24–26, 2026. The day view has 49 endpoint samples across 24 hours; the week view has 28 six-hour samples; the month view represents a fixed 30-day window. These are generated scenarios rather than retrieved history.</p></section><section class="card analysis-card"><h3>How to read the heat map</h3><p>Buildings are rows and metrics are columns. Every cell displays its value and unit; selecting it opens the building profile.</p><p>Each column is normalized independently: (value − portfolio minimum) ÷ (portfolio maximum − minimum). Colors use all 24 buildings for the selected date and period, so searching or filtering does not rescale the comparison. Equal values use the midpoint color.</p><p>Darker cells mean higher values. A darker availability cell means more records received; a darker open-events cell means more events to review. Colors describe magnitude rather than a performance rating.</p><a class="methodology-link" href="#buildings">Explore the building heat map ${icon('arrowRight')}</a></section></div>
    <section class="card metric-definitions"><div class="card-heading"><div><h2>Metric definitions</h2><p>The same calculations supply the heat map, building profiles and energy reports.</p></div></div><div class="table-scroll"><table><thead><tr><th scope="col">Metric</th><th scope="col">Unit</th><th scope="col">Calculation & interpretation</th></tr></thead><tbody>${definitions.map(([label,unit,description])=>`<tr><th scope="row">${label}</th><td>${unit}</td><td>${description}</td></tr>`).join('')}</tbody></table></div></section>
    <div class="two-columns methodology-columns"><section class="card analysis-card"><h3>Anomaly investigation</h3><p>The six scenario events use five-minute traces and illustrative review thresholds ranging from 10% to 35% above expected demand. Consecutive unusual readings are reviewed in their event context. An alert is a prompt to investigate; possible explanations remain unverified.</p><p>Burgos study-area labels describe research context. Lai’s Global, Contextual, Shapelet, Seasonal and Trend labels describe time-series patterns. These labels do not establish a cause.</p><p>Review statuses and notes are stored in this browser. Resolving an event updates open-event counts, including the heat map, without changing the simulated energy readings.</p><a class="methodology-link" href="#anomalies">Review scenario evidence ${icon('arrowRight')}</a></section><section class="card analysis-card"><h3>Detection evaluation</h3><p>Per-meter, unified and zero-shot results use separate constructed 200-event fixtures, each containing 22 ground-truth anomalies. They demonstrate evaluation views rather than measured model performance.</p><dl class="formula-list"><div><dt>Precision</dt><dd>TP ÷ (TP + FP)</dd></div><div><dt>Recall</dt><dd>TP ÷ (TP + FN)</dd></div><div><dt>F1</dt><dd>2TP ÷ (2TP + FP + FN)</dd></div><div><dt>Accuracy</dt><dd>(TP + TN) ÷ total events</dd></div></dl><p>The aligned 32-window timeline is a separate point-level fixture. Its denominators differ from the event-level benchmark; latency values are illustrative.</p><a class="methodology-link" href="#models">Explore detection quality ${icon('arrowRight')}</a></section></div>
    <section class="card analysis-card methodology-foundations"><h3>Design foundations & limits</h3><p>The supplied milestone brief and research references guide the prototype: Burgos for study areas and possible explanations; Lai for pattern types and time context; Si for event-level evaluation and unseen meters; Dahlgren for operational context; PLAID for appliance and submeter context; and Oreshkin for simulation as research context.</p><p>Building floor area, occupancy, weather and tariffs are not connected. Absolute building totals are not adjusted for size or use, so this comparison cannot establish relative efficiency. Generated submeter shares and scenario traces do not reconcile to an operational meter ledger.</p><p>CSV downloads are labeled as simulated data. Use the reports tab to export the selected energy scope, event register or evaluation fixtures.</p><button class="button" data-view="reports">${icon('download')}Open reports & downloads</button></section>`;
}
function eventBadge(e){return `<span class="badge ${e.severity==='High'?'danger':e.severity==='Medium'?'warning':'neutral'}"><i></i>${e.severity}</span>`;}
function anomaliesView(){return renderAttentionPage();}
function analyticsView(){return heading('Energy use & patterns','See when electricity use changes and where it comes from.','ENERGY INSIGHTS')+filters()+kpis()+energyCard(true)+researchComparison()+`<div class="two-columns"><section class="card analysis-card"><h3>Difference from expected use</h3><p>Bars above zero show more electricity demand than expected. Bars below zero show less.</p>${residualMarkup()}<div class="legend"><span><i></i>Below expected</span><span><i class="anomaly"></i>Above expected</span></div></section><section class="card analysis-card"><h3>Read the comparison in context</h3><p>Expected demand is a synthetic comparable-day baseline. A difference may reflect occupancy, an operating schedule, equipment behavior or a data issue.</p><p>Use the meter comparison above to inspect an event at 5-minute intervals, overlay reference days and explore the reference components.</p><button class="button" data-view="anomalies">${icon('alert')}Review event context</button></section></div><div class="dashboard-row" style="margin-top:20px"><section class="card analysis-card"><h3>What contributes to consumption?</h3><p>Simulated submeter allocation for ${state.building==='all'?'the campus':buildings[Number(state.building)].name}.</p>${[['HVAC / AHUs',47],['Lighting',24],['Plug loads',19],['Other',10]].map(([l,v])=>`<div class="bar-row"><span>${l}</span><span class="bar-track"><i style="width:${v*2}%"></i></span><b>${fmt(totals().energy*v/100)} kWh</b></div>`).join('')}</section>${breakdown()}</div>`;}
function residualMarkup(){const data=series(),max=Math.max(...data.map(p=>Math.abs(p.actual-p.expected)));return `<svg class="residual" viewBox="0 0 500 120" role="img" aria-label="Residual demand: actual minus expected in kilowatts"><line x1="28" y1="60" x2="495" y2="60" stroke="#dce4d2"/><text x="1" y="64" class="chart-axis">0</text><text x="1" y="13" class="chart-axis">+kW</text>${data.map((p,i)=>{const r=p.actual-p.expected,h=Math.max(1,Math.abs(r)/max*45);return `<rect x="${30+i*460/data.length}" y="${r>0?60-h:60}" width="${Math.max(2,460/data.length-2)}" height="${h}" fill="${r>0?'#d5ac71':'#97b17e'}" rx="1"/>`;}).join('')}</svg>`;}
function modelMetrics(schema=state.schema){const matrix={naive:{tp:17,fp:4,fn:5,tn:174,lat:48},'all-in-one':{tp:20,fp:3,fn:2,tn:175,lat:34},'zero-shot':{tp:16,fp:5,fn:6,tn:173,lat:41}};const m=matrix[schema];return {...m,p:m.tp/(m.tp+m.fp),r:m.tp/(m.tp+m.fn),f:2*m.tp/(2*m.tp+m.fp+m.fn),a:(m.tp+m.tn)/200};}
function modelsBaseView(){const m=modelMetrics();return heading('Detection quality','For the project team: see how well example models find unusual energy use.','MODEL PERFORMANCE')+`<div class="methodology" style="margin-top:0;margin-bottom:20px"><strong>Simulated benchmark · no trained model connected</strong>These example results demonstrate the evaluation views requested in the milestone brief. Each schema uses 200 labeled demo events, including 22 ground-truth anomalies. Metrics are calculated from the confusion counts below.</div><div class="model-tabs" style="margin-bottom:20px" aria-label="Training schema">${[['naive','Per-meter (naive)'],['all-in-one','Unified (all-in-one)'],['zero-shot','Unseen meters (zero-shot)']].map(([s,l])=>`<button data-schema="${s}" class="${state.schema===s?'active':''}" aria-pressed="${state.schema===s}">${l}</button>`).join('')}</div><div class="kpi-grid">${[['Event precision',m.p],['Event recall',m.r],['Event F1',m.f],['Event accuracy',m.a]].map(([l,v],i)=>`<div class="card kpi"><div class="kpi-top">${l}<span class="kpi-icon">${icon('activity')}</span></div><div class="kpi-value">${fmt(v*100,1)}<small>%</small></div><div class="kpi-bottom"><span class="change">Derived from demo labels</span>${spark(i)}</div></div>`).join('')}</div><div class="two-columns"><section class="card analysis-card"><h3>Detection outcomes</h3><p>Event-level confusion counts · ${state.schema} schema</p>${[['True positives',m.tp,'#73965b'],['False positives',m.fp,'#d6aa6b'],['False negatives',m.fn,'#c78176'],['True negatives',m.tn,'#becda9']].map(([l,v,c])=>`<div class="bar-row"><span>${l}</span><span class="bar-track"><i style="width:${v/200*100}%;background:${c}"></i></span><b>${v}</b></div>`).join('')}<p>False-alarm rate: ${fmt(m.fp/(m.fp+m.tn)*100,1)}% · Average detection latency: ${m.lat} seconds</p></section><section class="card analysis-card"><h3>Events, not just individual timestamps</h3><p>Consecutive anomalous readings should be reviewed as one event. An operational evaluation also checks whether the first alert arrives soon enough to be useful.</p><p>The event metrics here use a synthetic 200-event fixture. The aligned timeline below is a separate, smaller point-level example.</p><div class="drawer-section"><h3>Previously unseen meters</h3><p>The zero-shot setup tests generalization without fitting the model to each new meter. Compare that setup against per-meter and unified models below.</p></div></section></div><div class="methodology"><strong>How to read these metrics</strong>Precision = TP / (TP + FP). Recall = TP / (TP + FN). F1 balances both. Accuracy includes true negatives and can look strong when normal events dominate. In a real evaluation, event windows, detection latency, meter holdouts, and labeling assumptions must be fixed before comparing models.</div>`;}
function modelsView(){return modelsBaseView()+schemaComparison()+pointTimeline()+mixedTypeEvaluation();}
function reportsView(){return heading('Reports & downloads','Export energy use and event reviews for your facilities team.','REPORTS & EXPORTS')+filters()+`<div class="report-grid">${[['energy','bolt','Energy & building report','Consumption, expected usage, estimated emissions, and building-level changes for the selected scope.'],['events','alert','Anomaly event register','Event type, severity, magnitude, duration, review status, and possible explanations.'],['benchmark','activity','Model evaluation','Confusion counts, precision, recall, F1, accuracy, and detection latency across all three demo schemas.']].map(([id,ic,title,desc])=>`<section class="card report-card"><span class="report-icon">${icon(ic)}</span><h2>${title}</h2><p>${desc}</p><button class="button" data-export="${id}">${icon('download')}Download CSV</button></section>`).join('')}</div><div class="methodology"><strong>Prepared for your current selection</strong>Scope: ${state.building==='all'?'All 24 campus buildings':buildings[Number(state.building)].name} · ${state.period} ending ${dateLabel()}. Every export is labeled as simulated data. Carbon estimates use an illustrative factor of 0.23 kg CO₂e/kWh.</div>`;}
let activeViewTransition;
let renderVersion = 0;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function render({transition=false, animate=true, focus=false}={}) {
  const version = ++renderVersion;
  const focusedId = document.activeElement?.id;
  const focusedDataset = document.activeElement?.dataset;
  const focusedControl = ['period','schema'].find(key=>focusedDataset?.[key]);
  const focusedValue = focusedControl && focusedDataset[focusedControl];
  const nativeTransition = transition && !reducedMotion() && document.startViewTransition;
  const commit = () => {
    if (version !== renderVersion) return;
    renderNav();
    $('#breadcrumb').textContent = navs.find(n=>n[0]===state.view)?.[2] || 'Overview';
    const views = {overview,buildings:buildingsView,anomalies:anomaliesView,analytics:analyticsView,models:modelsView,reports:reportsView,methodology:methodologyView};
    $('#main').innerHTML = `<div class="${animate&&!nativeTransition?'view-enter':'view-static'}">${(views[state.view]||overview)()}</div>`;
    bind();
    if (focus) { $('#main').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
    else if (focusedId) document.getElementById(focusedId)?.focus({preventScroll:true});
    else if (focusedControl) document.querySelector(`[data-${focusedControl}="${focusedValue}"]`)?.focus({preventScroll:true});
  };
  activeViewTransition?.skipTransition();
  if (nativeTransition) {
    activeViewTransition = document.startViewTransition(commit);
    const current = activeViewTransition;
    current.finished.catch(()=>{}).finally(()=>{if(activeViewTransition===current)activeViewTransition=null;});
  } else commit();
}
function bind() {
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>navigate(b.dataset.view));
  document.querySelectorAll('[data-period]').forEach(b=>b.onclick=()=>{if(state.period===b.dataset.period)return;state.periodFrom=['day','week','month'].indexOf(state.period);state.periodMoving=true;state.period=b.dataset.period;render({animate:false});state.periodMoving=false;});
  document.querySelectorAll('[data-export]').forEach(b=>b.onclick=()=>exportCSV(b.dataset.export));
  for (const [id,key] of [['building-filter','building'],['date-filter','date'],['type-filter','eventType'],['status-filter','eventStatus'],['severity-filter','eventSeverity'],['cause-filter','eventCause'],['burgos-filter','burgosCategory']]) {
    document.getElementById(id)?.addEventListener('change',e=>{state[key]=e.target.value;render({animate:false});});
  }
  $('#building-sort')?.addEventListener('change',event=>{state.buildingSort=event.target.value;render({animate:false});});
  document.querySelectorAll('[data-building-display]').forEach(button=>button.onclick=()=>{state.buildingDisplay=button.dataset.buildingDisplay;render({animate:false});document.querySelector(`[data-building-display="${state.buildingDisplay}"]`)?.focus({preventScroll:true});});
  $('#building-search')?.addEventListener('input',e=>{
    const pos=e.target.selectionStart;state.query=e.target.value;render({animate:false});
    const el=$('#building-search');el.focus({preventScroll:true});el.setSelectionRange(pos,pos);
  });
  for (const [attr,open] of [['building',v=>openBuilding(Number(v))],['event',openEvent]]) {
    document.querySelectorAll(`[data-${attr}]`).forEach(row=>{
      row.onclick=()=>open(row.dataset[attr]);
      row.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();row.click();}};
    });
  }
  $('#insight-investigate')?.addEventListener('click',e=>{const id=e.currentTarget.dataset.insightEvent;id?openEvent(id):navigate('analytics');});
  $('#compare-button')?.addEventListener('click',()=>{state.compare=!state.compare;render({animate:false});});
  document.querySelectorAll('[data-schema]').forEach(b=>b.onclick=()=>{state.schema=b.dataset.schema;render({animate:false});});
  $('#review-priority')?.addEventListener('click',()=>{
    state.burgosCategory='all';state.eventCause='all';state.eventType='all';state.eventStatus='open';state.eventSeverity=activeEvents().some(e=>e.severity==='High')?'High':'all';
    navigate('anomalies');
  });
  $('#clear-event-filters')?.addEventListener('click',()=>{state.burgosCategory='all';state.eventCause='all';state.eventType='all';state.eventStatus='all';state.eventSeverity='all';render({animate:false});});
  bindChart();
  bindResearch();
  bindInvestigation();
}
function bindChart() {
  const hit=$('#chart-hit-area'),svg=$('#energy-chart'),tip=$('#chart-tooltip');
  if (!hit) return;
  const data=series(),line=$('#chart-hover-line'),dot=$('#chart-hover-dot');
  let index=0, frame=0, pointerEvent;
  const inspect = next => {
    index=Math.max(0,Math.min(data.length-1,next));
    const p=data[index],event=overviewEventAt(p),x=44+index/(data.length-1)*649;
    const max=Math.ceil(Math.max(...data.map(v=>Math.max(v.actual,v.expected)))/(state.building==='all'?400:20))*(state.building==='all'?400:20);
    const y=25+176-p.actual/max*176;
    line.setAttribute('x1',x);line.setAttribute('x2',x);line.setAttribute('visibility','visible');
    dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('visibility','visible');
    const date=new Date(state.date+'T12:00:00');
    if(state.period!=='day') date.setDate(date.getDate()-(state.period==='week'?6-Math.floor(index/4):29-index));
    const time=state.period==='day'?`${String(Math.floor(p.h)).padStart(2,'0')}:${p.h%1?'30':'00'}`:date.toLocaleDateString('en-US',{month:'short',day:'numeric'})+(state.period==='week'?' · '+String(p.h).padStart(2,'0')+':00':'');
    tip.innerHTML=`<strong>${time}</strong><p>Measured: ${fmt(p.actual,1)} kW</p><p>Expected: ${fmt(p.expected,1)} kW</p><p>Difference: ${p.actual-p.expected>0?'+':''}${fmt(p.actual-p.expected,1)} kW</p>${event?`<p>${buildings[event.building].name} · ${event.meter}</p><p>${categoryLabels[event.category]} · ${event.duration}</p>`:''}`;
    const point=svg.createSVGPoint();point.x=x;point.y=y;
    const screen=point.matrixTransform(svg.getScreenCTM()),wrap=tip.parentElement.getBoundingClientRect();
    const left=Math.max(8,Math.min(wrap.width-tip.offsetWidth-8,screen.x-wrap.left+14));
    const top=Math.max(12,Math.min(wrap.height-tip.offsetHeight-12,screen.y-wrap.top-35));
    tip.style.transform=`translate3d(${left}px,${top}px,0)`;
    tip.classList.add('visible');
  };
  const hide=()=>{cancelAnimationFrame(frame);frame=0;tip.classList.remove('visible');line.setAttribute('visibility','hidden');dot.setAttribute('visibility','hidden');};
  const move=e=>{
    pointerEvent=e;
    if(frame)return;
    frame=requestAnimationFrame(()=>{
      frame=0;const point=svg.createSVGPoint();point.x=pointerEvent.clientX;point.y=pointerEvent.clientY;
      const local=point.matrixTransform(svg.getScreenCTM().inverse());
      inspect(Math.round((local.x-44)/649*(data.length-1)));
    });
  };
  hit.addEventListener('pointermove',move);hit.addEventListener('pointerdown',move);hit.addEventListener('pointerleave',hide);
  svg.addEventListener('focus',()=>inspect(index));svg.addEventListener('blur',hide);
  hit.addEventListener('click',()=>{const event=overviewEventAt(data[index]);if(event)openEvent(event.id);});
  svg.addEventListener('keydown',e=>{if(e.key==='Enter'){const event=overviewEventAt(data[index]);if(event)openEvent(event.id);}if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();inspect(e.key==='Home'?0:e.key==='End'?data.length-1:index+(e.key==='ArrowRight'?1:-1));}if(e.key==='Escape')hide();});
}
function navigate(view) {
  setMenu(false);
  if(location.hash==='#'+view){state.view=view;render({transition:true,focus:true});}
  else location.hash=view;
}
let lastFocus;
let drawerCloseTimer;
let drawerIsOpen=false;
function showDrawer(content) {
  clearTimeout(drawerCloseTimer);
  drawerIsOpen=true;
  const d=$('#drawer'),backdrop=$('#drawer-backdrop');
  if(d.hidden)lastFocus=document.activeElement;
  d.innerHTML=`<div class="drawer-content">${content}</div>`;
  d.hidden=false;backdrop.hidden=false;d.scrollTop=0;
  document.body.style.overflow='hidden';$('.shell').inert=true;$('#sidebar').inert=true;
  hydrate(d);$('#close-drawer').onclick=closeDrawer;
  requestAnimationFrame(()=>{if(!drawerIsOpen||d.hidden)return;d.classList.add('is-open');backdrop.classList.add('is-open');$('#close-drawer').focus({preventScroll:true});});
}
function closeDrawer() {
  const d=$('#drawer'),backdrop=$('#drawer-backdrop');
  if(d.hidden)return;
  drawerIsOpen=false;
  d.classList.remove('is-open');backdrop.classList.remove('is-open');
  clearTimeout(drawerCloseTimer);
  const finish=()=>{
    d.hidden=true;backdrop.hidden=true;document.body.style.overflow='';$('.shell').inert=false;$('#sidebar').inert=false;
    if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});else $('#main').focus({preventScroll:true});
  };
  if(reducedMotion())finish();else drawerCloseTimer=setTimeout(finish,260);
}
function openBuilding(id){const b=buildings[id],ev=events.filter(e=>e.building===id&&e.status!=='Resolved'),energy=totals(String(id)).energy;showDrawer(`<div class="drawer-heading"><span class="eyebrow">BUILDING PROFILE · DEMO</span><button class="icon-button" id="close-drawer" aria-label="Close building details">${icon('x')}</button></div><span class="building-mini-icon">${icon('building')}</span><h2>${b.name}</h2><p class="drawer-subtitle">Campus facilities · ${b.meters} simulated submeters<br>${dateLabel()} · ${state.period} view</p><span class="badge ${ev.length?'warning':''}"><i></i>${ev.length?'Needs review':'Healthy'}</span><div class="detail-grid"><div><span>Energy consumption</span><strong>${fmt(energy)} kWh</strong></div><div><span>Open events</span><strong>${ev.length}</strong></div><div><span>Data availability</span><strong>${fmt(feedAudit([b]).availability,2)}%</strong></div><div><span>Change vs. previous period</span><strong>${b.change}%</strong></div></div><div class="drawer-section"><h3>Submeter coverage</h3><p>HVAC and air handling · lighting · plug loads · miscellaneous loads. Availability comes from the illustrative chart-record audit, not a live feed.</p></div><div class="drawer-section"><h3>Events to investigate</h3>${ev.length?ev.map(e=>`<button class="button" style="width:100%;margin-bottom:9px;justify-content:space-between" data-drawer-event="${e.id}">${e.title}${icon('arrowRight')}</button>`).join(''):'<p>No open events in this demo snapshot.</p>'}</div><button class="button primary save-event" id="building-demand">${icon('chart')}Explore building demand</button>`);document.querySelectorAll('[data-drawer-event]').forEach(el=>el.onclick=()=>openEvent(el.dataset.drawerEvent));$('#building-demand').onclick=()=>{state.building=String(id);closeDrawer();navigate('analytics');};}
function openEvent(id){const e=events.find(x=>x.id===id);showDrawer(eventDrawerContent(e));bindEvidenceCharts($('#drawer'));$('#save-event').onclick=()=>{e.status=$('#event-status').value;e.note=$('#event-note').value;let success=true;try{localStorage.setItem('derconnect-dashboard-events',JSON.stringify(Object.fromEntries(events.map(x=>[x.id,{status:x.status,note:x.note||''}]))));}catch{success=false;}closeDrawer();render();toast(success?'Review saved in this browser.':'Review updated for this session. Browser storage is unavailable.');};}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('visible'),3200);}
function exportCSV(type){let rows,filename;const context=['SIMULATED DATA',state.date,state.period,state.building==='all'?'All buildings':buildings[Number(state.building)].name];if(type==='events'){rows=[['Data','Snapshot date','Period','Building','Event ID','Meter','Burgos study area','Burgos section','Lai time-series pattern','Measured at peak kW','Expected at peak kW','Residual at peak kW','Example threshold percent','First rule crossing','Rule explanation','Possible cause category (unverified)','Possible explanation (scenario)','Evidence to check','Occurrences in last 7 demo days','Severity','Time','Duration','Deviation percent','Excess kWh','Status','Possible explanation','Review notes'],...filteredEvents().map(e=>['SIMULATED DATA',state.date,state.period,buildings[e.building].name,e.id,e.meter,burgosFor(e).label,burgosFor(e).section,e.category,eventEvidence(e).peak.measured.toFixed(4),eventEvidence(e).peak.expected.toFixed(4),eventEvidence(e).peak.difference.toFixed(4),eventEvidence(e).rule.threshold,hourLabel(eventEvidence(e).crossings[0].hour),eventEvidence(e).rule.explanation,causeGroups[scenarioFor(e).cause].label,scenarioFor(e).possible,scenarioFor(e).check,scenarioFor(e).days.length,e.severity,e.time,e.duration,e.deviation,e.excess,e.status,e.alternative,e.note||''])];filename='anomaly-events';}else if(type==='benchmark'){const prev=state.schema;rows=[['Data','Schema','TP','FP','FN','TN','Precision','Recall','F1','Accuracy','Average latency seconds']];for(const s of ['naive','all-in-one','zero-shot']){state.schema=s;const m=modelMetrics();rows.push(['SIMULATED DATA',s,m.tp,m.fp,m.fn,m.tn,m.p,m.r,m.f,m.a,m.lat]);}state.schema=prev;filename='model-evaluation';}else{const t=totals(),sum=buildings.reduce((a,b)=>a+b.scale,0);rows=[['Data','Snapshot date','Period','Building','Energy kWh','Expected kWh','Estimated t CO2e','Carbon factor kg CO2e per kWh','Meter count','Prior period change percent'],...scopedBuildings().map(b=>{const entry=totals(String(b.id));return [...context.slice(0,3),b.name,entry.energy.toFixed(2),entry.expected.toFixed(2),entry.carbon.toFixed(4),.23,b.meters,b.change];})];filename='energy-report';}const safe=v=>{let s=String(v??'');if(/^[=+@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};const blob=new Blob(['\uFEFF'+rows.map(r=>r.map(safe).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`derconnect-dashboard-${filename}-${state.date}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Your demo report has been downloaded.');}
window.addEventListener('hashchange',()=>{state.view=navs.some(n=>n[0]===location.hash.slice(1))?location.hash.slice(1):'overview';state.query='';render({transition:true,focus:true});});
$('#notifications').onclick=()=>{state.burgosCategory='all';state.eventCause='all';state.eventStatus='open';state.eventType='all';state.eventSeverity='all';navigate('anomalies');};
$('#about-button').onclick=()=>{setMenu(false);$('#about-dialog').showModal();};
$('#close-about').onclick=()=>$('#about-dialog').close();
$('#menu-button').onclick=()=>setMenu(!$('#sidebar').classList.contains('open'));
$('#menu-backdrop').onclick=()=>setMenu(false);
$('#drawer-backdrop').onclick=closeDrawer;
$('.skip-link').onclick=e=>{e.preventDefault();$('#main').focus({preventScroll:true});$('#main').scrollIntoView({behavior:reducedMotion()?'instant':'smooth'});};
window.addEventListener('resize',()=>{if(window.innerWidth>680&&$('#sidebar').classList.contains('open'))setMenu(false);renderNav();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#drawer').hidden)closeDrawer();setMenu(false);}if(e.key==='Tab'&&$('#sidebar').classList.contains('open')){const items=$('#sidebar').querySelectorAll('a,button');const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}if(e.key==='Tab'&&!$('#drawer').hidden){const focusable=$('#drawer').querySelectorAll('button,select,textarea,a[href]'),first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
const categoryLabels={Global:'Sudden spike',Contextual:'Unusual timing',Shapelet:'Unusual pattern',Seasonal:'Schedule change',Trend:'Gradual drift'};
const statusLabel=status=>status==='Investigating'?'Under review':status==='open'?'Open events':status;
function priorityBanner() {
  const open=activeEvents(),high=open.filter(e=>e.severity==='High'),priority=high[0]||open[0];
  return `<section class="priority-banner"><div class="priority-message"><span class="priority-icon">${icon(open.length?'alert':'check')}</span><div><strong>${high.length?`${high.length} high-priority ${high.length===1?'event needs':'events need'} a review`:open.length?`${open.length} ${open.length===1?'event is':'events are'} ready for review`:'No open events in this selection'}</strong><p>${priority?`Start with ${escapeHTML(priority.title.toLowerCase())} at ${buildings[priority.building].name}.`:'Compare demand with expected use to keep track of building performance.'}</p></div></div>${open.length?`<button class="button" id="review-priority">Review ${high.length?'priority ':''}events ${icon('arrowRight')}</button>`:`<button class="button" data-view="analytics">Explore energy use ${icon('arrowRight')}</button>`}</section>`;
}
function setMenu(open) {
  const wasOpen=$('#sidebar').classList.contains('open');
  $('#sidebar').classList.toggle('open',open);$('#menu-backdrop').hidden=!open;
  $('#menu-button').setAttribute('aria-expanded',String(open));$('#menu-button').setAttribute('aria-label',open?'Close navigation':'Open navigation');
  if(open){document.body.style.overflow='hidden';$('.shell').inert=true;$('#navigation .active')?.focus();}
  else if(wasOpen){document.body.style.overflow='';$('.shell').inert=false;$('#menu-button').focus({preventScroll:true});}
}
hydrate();state.view=navs.some(n=>n[0]===location.hash.slice(1))?location.hash.slice(1):'overview';render();
