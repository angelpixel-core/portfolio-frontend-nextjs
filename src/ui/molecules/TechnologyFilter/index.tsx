"use client";

import "./styles.css";

interface TechnologyFilterProps {
  technologies: string[];
  selected: string[];
  onToggle: (_tech: string) => void;
  onClearAll: () => void;
}

const TechnologyFilter = ({
  technologies,
  selected,
  onToggle,
  onClearAll,
}: TechnologyFilterProps) => {
  return (
    <div className="tech-filter" role="group" aria-label="Filter by technology">
      <div className="tech-filter__chips">
        {technologies.map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => onToggle(tech)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle(tech);
              }
            }}
            className={`tech-filter__chip ${
              selected.includes(tech) ? "tech-filter__chip--active" : ""
            }`}
            aria-pressed={selected.includes(tech)}
          >
            {tech}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="tech-filter__clear"
        >
          Clear All ({selected.length})
        </button>
      )}
    </div>
  );
};

export default TechnologyFilter;
