import { controlTable } from "./data/controlTable";
import { StudyContext } from "./components/StudyContext";
import { RandomizationStudy, PolicyControlStudy } from "./components/ResearchExplorers";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  controllerSetups,
  embodiments,
  exp1Policies,
  exp3Embodiments,
  exp3VideoByEmbodiment,
  taskGroups,
  type Task,
} from "./data/benchmark";
import {
  effectPanels,
  effectDescriptions,
  effectInterpretations,
  effectSources,
  type EffectPanelId,
  type EffectSource,
} from "./data/effectSources";
import { experiment1RolloutSources, experiment2RolloutSources } from "./data/rolloutSources";
import { releaseResources } from "./data/media";

const navItems = [
  { id: "tasks", label: "Tasks" },
  { id: "embodiments", label: "Embodiments" },
  { id: "policy-control", label: "Policy + control" },
  { id: "physical-effects", label: "Physical effects" },
  { id: "results", label: "Results" },
] as const;

const authors = [
  { name: "Yutong Wang", affiliation: "1,*", href: "https://www.linkedin.com/in/yutong-w-957636201/" },
  { name: "Dongjae Lee", affiliation: "1,3,*", href: "https://dongjaelee95.github.io/" },
  { name: "Xiaofeng Guo", affiliation: "1,*", href: "https://xiaofeng-guo.github.io/" },
  { name: "Yuanzhu Zhan", affiliation: "2", href: "https://ari-psu.github.io/team/yuanzhu_zhan/" },
  { name: "Yufei Jiang", affiliation: "2", href: "https://jiang-yufei.github.io/" },
  { name: "Bavin Saravanan", affiliation: "1", href: "https://bavin-hub.github.io/" },
  { name: "Muqing Cao", affiliation: "1", href: "https://caomuqing.github.io/" },
  { name: "Jia Xie", affiliation: "1", href: "https://jia-xie.com/" },
  { name: "Chenyang Mao", affiliation: "1", href: "https://www.linkedin.com/in/chenyangmao" },
  { name: "Sebastian Scherer", affiliation: "1", href: "https://theairlab.org/team/sebastian/" },
  { name: "Junyi Geng", affiliation: "2", href: "https://ari-psu.github.io/team/junyi_geng/" },
  { name: "Guanya Shi", affiliation: "1", href: "https://www.gshi.me/" },
];


function useUrlChoice<const T extends string>(
  key: string,
  allowedValues: readonly T[],
  fallback: T,
) {
  const [value, setValue] = useState<T>(() => {
    const requested = new URLSearchParams(window.location.search).get(key);
    return requested && allowedValues.includes(requested as T) ? requested as T : fallback;
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    if (value === fallback) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [fallback, key, value]);

  return [value, setValue] as const;
}

function useInitialHashTarget() {
  useEffect(() => {
    let frame: number | null = null;
    const scrollToHash = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = null;
        const hash = window.location.hash.slice(1);
        if (!hash) return;
        const target = document.getElementById(decodeURIComponent(hash));
        if (!target) return;

        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        target.scrollIntoView({ block: "start" });
        root.style.scrollBehavior = previousScrollBehavior;
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.removeEventListener("hashchange", scrollToHash);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);
}

function useNearViewport<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setIsNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isNear };
}

function VideoFrame({
  src,
  label,
  className = "",
}: {
  src: string;
  label: string;
  className?: string;
}) {
  const { ref, isNear } = useNearViewport<HTMLDivElement>();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return (
    <div ref={ref} className={`video-frame ${className}`}>
      {isNear ? (
        <video key={src} onError={() => setFailedSrc(src)} muted loop playsInline controls preload="none" poster={src.replace(/\.mp4$/, ".jpg")} aria-label={label}>
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div className="video-skeleton" aria-hidden="true" />
      )}
      {failedSrc === src && <p className="video-error" role="status">Video unavailable. <a href={src}>Open the clip directly</a>.</p>}
    </div>
  );
}

function SectionIntro({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-intro">

      <div className="section-intro-grid">
        <h2>{title}</h2>
        <div className="section-intro-copy">{children}</div>
      </div>
    </div>
  );
}

function TaskCard({ task, number }: { task: Task; number: string }) {
  return (
    <article className="task-card">
      <VideoFrame src={task.video} label={`${task.name} task rollout`} />
      <div className="task-card-copy">
        <span>{number}</span>
        <div>
          <h3><a href="/docs/configure/tasks-and-scenes/">{task.name}</a></h3>
          <p>{task.description}</p>
        </div>
      </div>
    </article>
  );
}

function TaskCatalog() {
  const [openGroups, setOpenGroups] = useState(() => new Set(taskGroups.map((group) => group.id)));
  let taskOffset = 0;

  const toggleGroup = (groupId: string) => {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  return (
    <div className="task-catalog">
      {taskGroups.map((group) => {
        const isOpen = openGroups.has(group.id);
        const start = taskOffset;
        taskOffset += group.tasks.length;
        return (
          <article className={`task-group ${isOpen ? "is-open" : ""}`} key={group.id}>
            <button
              className="task-group-trigger"
              type="button"
              aria-expanded={isOpen}
              aria-controls={`task-group-${group.id}`}
              onClick={() => toggleGroup(group.id)}
            >
              <span className="task-group-index">{group.index}</span>
              <span className="task-group-heading">
                <strong>{group.title}</strong>
                <small>{group.description}</small>
              </span>
              <span className="task-group-meta">
                <span>{group.count} tasks</span>
              </span>
              <span className="task-group-toggle" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="task-group-panel" id={`task-group-${group.id}`}>
                <div className={`task-grid ${group.tasks.length === 2 ? "task-grid-pair" : ""}`}>
                  {group.tasks.map((task, index) => (
                    <TaskCard
                      task={task}
                      number={String(start + index + 1).padStart(2, "0")}
                      key={task.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

const effectPanelIds = effectPanels.map((panel) => panel.id);
const effectSourceIds = effectSources.map((source) => source.id);

function EffectMediaFrame({ source }: { source: EffectSource }) {
  if (source.mediaPath) {
    return <VideoFrame src={source.mediaPath} label={`${source.label} physical-effect capture`} />;
  }
  return (
    <div
      className="effect-stage-placeholder"
      role="img"
      aria-label={`${source.label}: video capture planned`}
    >
      <div className="effect-stage-grid" aria-hidden="true" />
      <div className="effect-stage-copy">
        <span>Capture planned</span>
        <strong>{source.label}</strong>
        <small>{source.scenario}</small>
      </div>
    </div>
  );
}

function PhysicalEffectsExplorer() {
  const [panelId, setPanelId] = useUrlChoice<EffectPanelId>(
    "fx",
    effectPanelIds,
    "ground-effect",
  );
  const [sourceId, setSourceId] = useUrlChoice(
    "fxState",
    effectSourceIds,
    "ground-effect-100",
  );
  const panel = effectPanels.find((candidate) => candidate.id === panelId) ?? effectPanels[0];
  const panelSources = effectSources.filter((source) => source.panelId === panel.id);
  const selectedSource = panelSources.find((source) => source.id === sourceId) ?? panelSources[0];
  const evidenceSource = selectedSource;
  const description = effectDescriptions[panel.id];

  useEffect(() => {
    if (selectedSource.id !== sourceId) setSourceId(selectedSource.id);
  }, [selectedSource.id, setSourceId, sourceId]);

  const selectPanel = (nextPanelId: EffectPanelId) => {
    const firstSource = effectSources.find((source) => source.panelId === nextPanelId);
    setPanelId(nextPanelId);
    if (firstSource) setSourceId(firstSource.id);
  };

  const selectAdjacentPanel = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    currentPanelId: EffectPanelId,
  ) => {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0;
    if (direction === 0 && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const currentIndex = effectPanelIds.indexOf(currentPanelId);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? effectPanelIds.length - 1
        : (currentIndex + direction + effectPanelIds.length) % effectPanelIds.length;
    const nextPanelId = effectPanelIds[nextIndex];
    selectPanel(nextPanelId);
    window.requestAnimationFrame(() =>
      document.getElementById(`effect-panel-tab-${nextPanelId}`)?.focus(),
    );
  };

  const sourceGroups = [{ label: panel.id === "wind" ? "Force" : panel.id === "ground-effect" ? "Altitude" : panel.id === "near-wall-effect" ? "Standoff" : "Actuator model", sources: panelSources }];

  return (
    <div className="effect-explorer">
      <div className="effect-panel-tabs" role="tablist" aria-label="Physical-effect category">
        {effectPanels.map((candidate) => (
          <button
            id={`effect-panel-tab-${candidate.id}`}
            className={candidate.id === panel.id ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={candidate.id === panel.id}
            aria-controls="effect-panel"
            tabIndex={candidate.id === panel.id ? 0 : -1}
            onClick={() => selectPanel(candidate.id)}
            onKeyDown={(event) => selectAdjacentPanel(event, candidate.id)}
            key={candidate.id}
          >
            <span>{candidate.index}</span>
            <strong>{candidate.label}</strong>

          </button>
        ))}
      </div>

      <div
        id="effect-panel"
        className="effect-workbench"
        role="tabpanel"
        aria-labelledby={`effect-panel-tab-${panel.id}`}
        tabIndex={0}
      >
        <div className={`effect-viewer ${panel.id === "actuator-constraints" ? "actuator-comparison" : ""}`} aria-live="polite">
          <div className="effect-stage has-media">
            <EffectMediaFrame source={selectedSource} />
          </div>
          <div className="effect-evidence">
            {description && <>
              <p className="effect-explanation">{description.explanation}</p>
              <p className="effect-caption">{description.caption}</p>
            </>}
        {sourceGroups.some(group => group.sources.length > 1) && <div className="effect-variant-bar">
          {sourceGroups.map((group) => (
            <div className="effect-variant-group" key={group.label}>
              <span>{group.label}</span>
              <div>
                {group.sources.map((source) => (
                  <button
                    className={source.id === selectedSource.id ? "is-active" : ""}
                    type="button"
                    aria-pressed={source.id === selectedSource.id}
                    onClick={() => setSourceId(source.id)}
                    key={source.id}
                  >
                    {source.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

        </div>}

            <p className="effect-evidence-copy">
              {description ? effectInterpretations[selectedSource.id] : evidenceSource.evidence}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

function ExperimentOne() {
  const [policyId, setPolicyId] = useUrlChoice("e1Policy", ["act", "dp", "pi05"] as const, "dp");
  const source = experiment1RolloutSources.find(item => item.policyId === policyId)!;
  const labels = { act: "ACT", dp: "Diffusion Policy", pi05: "π₀.₅" };
  return <div className="policy-results">
    <div>
      <div className="policy-plot-heading"><h3>Adaptation across the task suite</h3><span><i /> π₀ <i /> π₀.₅</span></div>
      <div className="policy-trends">
        {([{ key: "macroSuccess", label: "Success" }, { key: "macroSubtask", label: "Subtask completion" }] as const).map(metric => <div key={metric.key}>
          <svg className="policy-plot" viewBox="0 0 300 310" role="img" aria-label={`${metric.label} by adaptation stage. ${exp1Policies.map(p => `${p.label}: ${p[metric.key]}%`).join("; ")}`}>
            <text x="36" y="18" fontSize="14" fontWeight="600" fill="#24364b">{metric.label} (%)</text>
            {[0, 25, 50, 75, 100].map(value => <g key={value}>
              <line x1="36" x2="270" y1={225 - value * 1.7} y2={225 - value * 1.7} stroke="#e5e8ea" />
              <text x="28" y={229 - value * 1.7} textAnchor="end" fill="#69727a" fontSize="12">{value}</text>
            </g>)}
            {exp1Policies.slice(0, 2).map((baseline, index) => <g key={baseline.id}>
              <line x1="36" x2="270" y1={225 - baseline[metric.key] * 1.7} y2={225 - baseline[metric.key] * 1.7} stroke={index === 0 ? "#8b9197" : "#526b61"} strokeWidth="1.2" strokeDasharray={index === 0 ? "3 4" : "7 4"} />
              <line x1={36 + index * 122} x2={51 + index * 122} y1="282" y2="282" stroke={index === 0 ? "#8b9197" : "#526b61"} strokeDasharray={index === 0 ? "3 4" : "7 4"} />
              <text x={56 + index * 122} y="286" fill={index === 0 ? "#747b82" : "#526b61"} fontSize="12">{baseline.label} {baseline[metric.key].toFixed(2)}%</text>
            </g>)}
            {([{ prefix: "pi0", color: "#24364b" }, { prefix: "pi05", color: "#a13c52" }] as const).map(series => {
              const values = ["zs", "mt", "mt-st"].map(stage => exp1Policies.find(p => p.id === `${series.prefix}-${stage}`)![metric.key]);
              return <g key={series.prefix}>
                <polyline points={values.map((v, i) => `${48 + i * 105},${225 - v * 1.7}`).join(" ")} fill="none" stroke={series.color} strokeWidth="2.5" />
                {values.map((value, index) => <g key={index}>
                  <circle cx={48 + index * 105} cy={225 - value * 1.7} r="4" fill={series.color} />
                  <text x={48 + index * 105} y={225 - value * 1.7 + ((series.prefix === "pi0") === (index === 0) ? -10 : 18)} textAnchor="middle" fill={series.color} fontSize="12">{value.toFixed(2)}</text>
                </g>)}
              </g>;
            })}
            {["ZS", "MT-FT", "MT→ST-FT"].map((stage, index) => <text key={stage} x={48 + index * 105} y="253" textAnchor="middle" fill="#69727a" fontSize="12">{stage}</text>)}
          </svg>
        </div>)}
      </div>
      <p className="policy-plot-note">ZS: zero-shot · MT-FT: multi-task fine-tuning · MT→ST-FT: then single-task fine-tuning. ACT and DP are single-task baselines.</p>
    </div>
    <div className="policy-demo">
      <h3>Lemon Harvesting</h3>
      <div className="research-switches control-task-choice" aria-label="Demo policy">{(["act", "dp", "pi05"] as const).map(id => <button type="button" key={id} aria-pressed={policyId === id} onClick={() => setPolicyId(id)}>{labels[id]}</button>)}</div>
      <div className="experiment-video">
        <VideoFrame src={source.mediaPath} label={`${labels[policyId]} Lemon Harvesting demo`} />
        <p><strong>{labels[policyId]}</strong><span className={`demo-status ${source.success ? "is-success" : "is-failed"}`}>{source.success ? "Success" : "Failed"}</span></p>
      </div>
    </div>
  </div>;
}

function ExperimentTwo() {
  const [taskId, setTaskId] = useUrlChoice("e2Task", ["press-button", "push-slider"] as const, "press-button");
  const [controllerId, setControllerId] = useUrlChoice("e2Control", controllerSetups.map(setup => setup.id), "ee-mpc");
  const selectedSetup = controllerSetups.find(setup => setup.id === controllerId)!;
  const source = experiment2RolloutSources.find(item => item.taskId === taskId && item.controllerId === controllerId)!;
  const taskIndex = taskId === "press-button" ? 0 : 1;
  const columns = [
    { index: 0, label: "Success ↑", unit: "%" },
    { index: 3, label: "Tilt ↓", unit: " rad" },
    { index: 4, label: "Saturation ↓", unit: "%" },
  ];
  const bestValues = columns.map(column => {
    const values = controllerSetups.map((_, index) => parseFloat(controlTable[taskIndex * 5 + index][column.index].text));
    return (column.index === 0 ? Math.max : Math.min)(...values.filter(Number.isFinite));
  });
  return <div className="experiment-three-layout comparison-layout">
    <div className="embodiment-comparison-panel">
      <div className="research-switches control-task-choice" aria-label="Comparison task">
        {(["press-button", "push-slider"] as const).map(task => <button type="button" key={task} aria-pressed={taskId === task} onClick={() => setTaskId(task)}>{task === "press-button" ? "Press Button" : "Push Slider"}</button>)}
      </div>
      <div className="embodiment-metric-table control-metric-table">
        <div className="embodiment-metric-header" aria-hidden="true"><span>Control interface</span>{columns.map(column => <span key={column.index} title={column.index === 4 ? "Fraction of timesteps with any rotor at a thrust limit" : column.index === 3 ? "Maximum roll-pitch tilt magnitude per rollout, in radians; averaged over successful rollouts" : "Task success rate over all evaluation rollouts"}>{column.label}</span>)}</div>
        {controllerSetups.map((setup, index) => <button type="button" key={setup.id} className={`embodiment-metric-row ${controllerId === setup.id ? "is-active" : ""}`} aria-pressed={controllerId === setup.id} aria-label={`${setup.interface}, ${setup.controller}`} onClick={() => setControllerId(setup.id)}>
          <strong>{setup.controller}<small>{setup.interface}</small></strong>
          {columns.map((column, columnIndex) => {
            const value = controlTable[taskIndex * 5 + index][column.index].text.split("±")[0].trim();
            return <span className={parseFloat(value) === bestValues[columnIndex] ? "is-best" : ""} key={column.index}>{value === "N/A" ? "—" : value + column.unit}</span>;
          })}
        </button>)}
      </div>
    </div>
    <div className="embodiment-video-panel"><div className="experiment-video"><VideoFrame src={source.mediaPath} label={`${taskId}: ${selectedSetup.controller} DP rollout`} /><p><strong>{taskId === "press-button" ? "Press Button" : "Push Slider"} · {selectedSetup.controller}</strong></p></div></div>
  </div>;
}

function ExperimentThree() {
  const [embodimentId, setEmbodimentId] = useUrlChoice(
    "e3Embodiment",
    exp3Embodiments.map((item) => item.id),
    "fa-hexa",
  );
  const selected = exp3Embodiments.find((item) => item.id === embodimentId)!;
  const metricColumns = [
    { key: "eeError", label: "EE error¹", unit: "" },
    { key: "baseError", label: "Base error¹", unit: "" },
    { key: "tilt", label: "Tilt (rad)", unit: "" },
    { key: "saturation", label: "Saturation", unit: "%" },
  ] as const;
  const bestValues = Object.fromEntries(
    metricColumns.map((metric) => [metric.key, Math.min(...exp3Embodiments.map((item) => item[metric.key]))]),
  );

  return (
    <div className="experiment-three-layout comparison-layout">
      <div className="embodiment-comparison-panel">
        <div className="chart-heading">
          <div>
            <h3>Tracking and actuation metrics</h3>
          </div>
          <span>Lower is better</span>
        </div>
        <p className="evaluation-context">¹ Position error divided by arm reach, in units of 10⁻². Saturation: fraction of timesteps with any rotor at a thrust limit.</p>
        <div className="embodiment-metric-table">
          <div className="embodiment-metric-header" aria-hidden="true">
            <span>Embodiment</span>
            {metricColumns.map((metric) => <span key={metric.key}>{metric.label}</span>)}
          </div>
          {exp3Embodiments.map((item) => (
            <button
              className={`embodiment-metric-row ${item.id === embodimentId ? "is-active" : ""}`}
              type="button"
              aria-pressed={item.id === embodimentId}
              aria-label={`${item.label}: EE error ${item.eeError}, base error ${item.baseError}, tilt ${item.tilt}, saturation ${item.saturation}%`}
              onClick={() => setEmbodimentId(item.id)}
              key={item.id}
            >
              <strong>{item.label}</strong>
              {metricColumns.map((metric) => {
                const value = item[metric.key];
                return (
                  <span className={value === bestValues[metric.key] ? "is-best" : ""} key={metric.key}>
                    {value.toFixed(value < 1 ? 3 : 2)}{metric.unit}
                  </span>
                );
              })}
            </button>
          ))}
        </div>
      </div>

      <div className="embodiment-video-panel">
        <div className="experiment-video">
          <VideoFrame
            src={exp3VideoByEmbodiment[selected.id]}
            label={`${selected.label} Push Slider embodiment comparison`}
          />
          <p><strong>{selected.label}</strong></p>
        </div>
      </div>
    </div>
  );
}

function ResultsExplorer() {
  const experimentTabsRef = useRef<HTMLDivElement>(null);
  const [experimentParam, setExperimentParam] = useUrlChoice(
    "exp",
    ["1", "2", "3"] as const,
    "1",
  );
  const experiment = Number(experimentParam) as 1 | 2 | 3;
  const setExperiment = (next: 1 | 2 | 3) => setExperimentParam(String(next) as typeof experimentParam);
  const experimentTabs = [
    [1, "High-level policies", "12 tasks · 8 configurations"],
    [2, "Policy × control", "DP · 2 tasks · 5 control stacks"],
    [3, "Embodiments", "Push Slider · 4 platforms"],
  ] as const;

  useEffect(() => {
    const tabs = experimentTabsRef.current;
    const activeTab = document.getElementById(`experiment-tab-${experiment}`);
    if (!tabs || !activeTab) return;
    const targetLeft = activeTab.offsetLeft - (tabs.clientWidth - activeTab.offsetWidth) / 2;
    tabs.scrollTo({ left: targetLeft, behavior: "auto" });
  }, [experiment]);

  const selectAdjacentExperiment = (event: ReactKeyboardEvent<HTMLButtonElement>, current: 1 | 2 | 3) => {
    const keyDirection = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0;
    if (keyDirection === 0 && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next = event.key === "Home"
      ? 1
      : event.key === "End"
        ? 3
        : ((((current - 1 + keyDirection + 3) % 3) + 1) as 1 | 2 | 3);
    setExperiment(next);
    window.requestAnimationFrame(() => document.getElementById(`experiment-tab-${next}`)?.focus());
  };

  return (
    <div className="results-explorer">
      <div
        ref={experimentTabsRef}
        className="experiment-tabs"
        role="tablist"
        aria-label="Demonstration category"
      >
        {experimentTabs.map(([number, label, scope]) => (
          <button
            id={`experiment-tab-${number}`}
            className={experiment === number ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={experiment === number}
            aria-controls="experiment-panel"
            tabIndex={experiment === number ? 0 : -1}
            onClick={() => setExperiment(number as 1 | 2 | 3)}
            onKeyDown={(event) => selectAdjacentExperiment(event, number)}
            key={number}
          >

            <strong>{label}</strong>
            <small>{scope}</small>
          </button>
        ))}
      </div>
      <div
        className="experiment-panel"
        id="experiment-panel"
        role="tabpanel"
        aria-labelledby={`experiment-tab-${experiment}`}
        tabIndex={0}
      >
        <StudyContext experiment={experiment} />
        {experiment === 1 && <ExperimentOne />}
        {experiment === 2 && <ExperimentTwo />}
        {experiment === 3 && <ExperimentThree />}
      </div>
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -68%", threshold: [0, 0.1, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="nav-shell">
        <a className="wordmark" href="#top" onClick={() => setMenuOpen(false)}>
          <img className="wordmark-mark" src="/static/images/ambench-logo.svg" alt="" width="34" height="34" />
          <span>AM-Bench</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <nav id="primary-navigation" className={menuOpen ? "is-open" : ""} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              className={activeSection === item.id ? "is-active" : ""}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              key={item.id}
            >
              {item.label}
            </a>
          ))}
          <a className="nav-docs" href="/docs/">Docs ↗</a>
        </nav>
      </div>
    </header>
  );
}

const bibtex = `@article{wang2026ambench,
  title  = {{AM-Bench}: A Modular Simulation Suite and Benchmark for Aerial Manipulation Policy Learning},
  author = {Wang, Yutong and Lee, Dongjae and Guo, Xiaofeng and Zhan, Yuanzhu and
            Jiang, Yufei and Saravanan, Bavin and Cao, Muqing and Xie, Jia and
            Mao, Chenyang and Scherer, Sebastian and Geng, Junyi and Shi, Guanya},
  year   = {2026},
  journal = {arXiv preprint arXiv:2609.00641},
  eprint = {2609.00641},
  archivePrefix = {arXiv},
  primaryClass = {cs.RO},
  url = {https://arxiv.org/abs/2609.00641}
}`;

function App() {
  useInitialHashTarget();
  const [copied, setCopied] = useState(false);

  const copyCitation = async () => {
    await navigator.clipboard.writeText(bibtex);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="hero" id="top">
          <div className="page-shell hero-layout">
            <div className="hero-kicker"><span>CoRL 2026</span></div>
            <h1>
              <span className="hero-title-prefix">AM-Bench:</span>
              A Modular Simulation Suite and Benchmark for
              <span className="hero-topic"> Aerial Manipulation</span> Policy Learning
            </h1>
            <p className="hero-contribution">Task success depends jointly on learned actions, low-level control, and robot embodiment. AM-Bench makes these choices independently configurable.</p>
            <div className="author-list" aria-label="Authors">
              {authors.map((author) => (
                <a href={author.href} target="_blank" rel="noreferrer" key={author.name}>
                  {author.name}<sup>{author.affiliation}</sup>
                </a>
              ))}
            </div>
            <div className="affiliation-list">
              <span><sup>1</sup> Carnegie Mellon University</span>
              <span><sup>2</sup> Pennsylvania State University</span>
              <span><sup>3</sup> Kyung Hee University</span>
              <span><sup>*</sup> Equal contribution</span>
            </div>
            <div className="resource-row">
              {releaseResources.map((resource) => resource.href ? (
                <a className="button button-primary" href={resource.href} key={resource.id}>
                  {resource.label} <span>↗</span>
                </a>
              ) : (
                <span className="button button-pending" aria-disabled="true" key={resource.id}>
                  {resource.label} <small>{resource.status.replace("-", " ")}</small>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Overview video reserved for the final hardware-inclusive edit.
        <section className="overview-video section-block">
          <div className="page-shell">
            <div className="overview-stage" role="img" aria-label="Overview video in preparation">
              <div className="overview-stage-label"><span>Overview video</span><small>Coming soon</small></div>
            </div>
          </div>
        </section>
        */}

        <section className="architecture-section section-block" id="architecture">
          <div className="page-shell">

            <h2>Task success is a whole-system problem.</h2>
            <p className="architecture-intro">An aerial manipulator must support its own weight and withstand contact forces while flying. Base motion changes the end-effector pose; arm motion and payload changes disturb the base. Wind and actuator limits further constrain what a learned action can achieve. A failed task can therefore originate in the policy, controller, or robot itself. AM-Bench makes these components independently configurable, so shared tasks can reveal which design choices improve performance—and which constraints cause failures.</p>
            <figure className="architecture-figure">
              <a href="/static/images/system-architecture.png" target="_blank" rel="noreferrer" aria-label="Enlarge AM-Bench system diagram"><img src="/static/images/system-architecture.png" width="2000" height="1126" loading="lazy" alt="RGB and proprioceptive observations feed the policy. End-effector or base and joint targets pass through low-level controllers and control allocation. Actuator limits and aerodynamic effects determine the forces applied to the simulated robot, closing the observation loop." /></a>
              <figcaption>System architecture · <a href="https://arxiv.org/html/2609.00641v1#S2.F2">Figure 2 from the paper ↗</a></figcaption>
            </figure>
            <p className="architecture-summary">The policy chooses a manipulation target; the controller turns it into base and arm commands. Control allocation, actuator limits, and aerodynamic effects determine the realized motion. The resulting images and robot state close the loop. Task, embodiment, policy, controller, and disturbances can be varied under the same evaluation setting.</p>
          </div>
        </section>

        <section className="tasks-section section-block" id="tasks">
          <div className="page-shell">
            <SectionIntro title="Task environments">
              <p>
                Twelve tasks grouped by interaction type, with task-specific success and subtask criteria.
              </p>
            </SectionIntro>
            <TaskCatalog />
            <RandomizationStudy />
          </div>
        </section>

        <section className="embodiment-section section-block" id="embodiments">
          <div className="page-shell">
            <SectionIntro title="Robot embodiments">
              <p>
                Four platforms differ in actuation freedom, manipulator reach, and base–arm dynamics.
              </p>
            </SectionIntro>
            <div className="embodiment-grid">
              {embodiments.map((embodiment, index) => (
                <article className="embodiment-card" key={embodiment.id}>
                  <VideoFrame src={embodiment.video} label={`${embodiment.name} embodiment rollout`} />
                  <div className="embodiment-card-head">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className="embodiment-actuation">{embodiment.category}</span>
                  </div>
                  <h3><a href="/docs/configure/robots-and-profiles/">{embodiment.name}</a></h3>
                  <p className="embodiment-spec">{embodiment.spec}</p>
                  <p>{embodiment.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="policy-section section-block" id="policy-control">
          <div className="page-shell">
            <SectionIntro title="Policy and control interfaces">
              <p>
                Two action interfaces assign base–arm coordination to either the policy or the control pipeline.
              </p>
            </SectionIntro>
            <PolicyControlStudy />
          </div>
        </section>

        <section className="effects-section section-block" id="physical-effects">
          <div className="page-shell">
            <SectionIntro title="Physical effects">
              <p>
                Rotor-level proximity models, external wind forces, and identified actuator dynamics.
              </p>
            </SectionIntro>
            <p className="evaluation-context">Rotor commands are limited by available thrust and actuator response before ground and near-wall effects modify the realized forces. Drag and wind add further disturbances to the body wrench.</p>
            <PhysicalEffectsExplorer />
          </div>
        </section>

        <section className="results-section section-block" id="results">
          <div className="page-shell">
            <p className="results-lead">Fine-tuning improves policy transfer; end-effector targets simplify coordination; robot actuation changes how the same task is executed.</p>
            <details className="results-disclosure">
              <summary>
                <span><strong>Results and demonstrations</strong></span>
                <span className="summary-toggle" aria-hidden="true">+</span>
              </summary>
              <ResultsExplorer />
            </details>
          </div>
        </section>

        <section className="abstract-section section-block" id="abstract">
          <div className="page-shell abstract-layout">
            <div className="abstract-heading">

              <h2>Abstract</h2>
            </div>
            <div className="abstract-copy">
              <p>
                Standardized benchmarks have played a central role in advancing robot manipulation learning, yet most focus on ground-supported manipulation systems, which limits their applicability to dynamics-critical domains such as aerial manipulation (AM). AM presents distinct system-level challenges, including environmental disturbances, coupled dynamics between the manipulator and floating base, and constrained degrees of freedom. Consequently, task performance depends jointly on robot embodiment, low-level control, and high-level policy design.
              </p>
              <p>
                We introduce AM-Bench, a modular simulation suite and benchmark for multirotor-based AM policy learning. AM-Bench includes representative embodiments spanning underactuated, fully actuated, and overactuated systems, 12 tasks across contact, transport, and constrained interaction, configurable aerodynamic disturbances and actuator saturation, standard low-level controllers, and baseline policy-learning algorithms. Unlike prior manipulation benchmarks that primarily emphasize end-to-end policy performance, AM-Bench enables system-level evaluation of how embodiment, control, disturbances, and policy choices interact. We demonstrate its diagnostic value through three simulation studies spanning high-level policies, policy–control interfaces, and embodiments, together with real-world validation of modeled effects and a hardware instantiation of the learning pipeline.
              </p>
            </div>
          </div>
          <div className="page-shell limitations">
            <h3>Limitations</h3>
            <ul>
              <li>Current platforms are single-robot multirotor systems with rigid arms; cooperative, cable-suspended, and compliant manipulators are outside the present scope.</li>
              <li>The reported learning studies cover imitation learning and VLAs. Reinforcement-learning infrastructure is available, but RL baselines are not evaluated here.</li>
              <li>Aerodynamics and actuator response use reduced-order models. Full motor–propeller and ESC dynamics, broader disturbances, and comprehensive sim-to-real evaluation remain future work.</li>
            </ul>
          </div>
        </section>
        <section className="citation-section section-block" id="citation">
          <div className="page-shell citation-layout">
            <div>

              <h2>Citation</h2>
              <p>Evaluation protocols and full results are available in the paper.</p><p><a href="https://arxiv.org/abs/2609.00641">Read the paper ↗</a></p>
              <button className="button button-outline" type="button" onClick={copyCitation}>{copied ? "Copied" : "Copy BibTeX"}</button>
            </div>
            <pre><code>{bibtex}</code></pre>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <div className="page-shell footer-grid">
          <div className="footer-brand">
            <img className="wordmark-mark" src="/static/images/ambench-logo.svg" alt="" width="34" height="34" />
            <div><strong>AM-Bench</strong><p>A modular simulation suite for aerial manipulation policy learning.</p></div>
          </div>
          <div className="footer-contact">
            <p className="mini-label">Explore and reproduce</p>
            <a href="https://github.com/ambench">AM-Bench on GitHub ↗</a>
            <a href="/docs/">Documentation ↗</a>
          </div>
        </div>
        <div className="page-shell footer-base">
          <span>© 2026 AM-Bench contributors</span>
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
        </div>
      </footer>
    </>
  );
}

export default App;
