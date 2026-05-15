"use strict";

const path = require("path");

const LAYERS = {
  presentation: ["src/app/", "src/ui/"],
  application: ["src/application/"],
  domain: ["src/domains/"],
  infrastructure: ["src/db/", "src/services/"],
  shared: ["src/shared/"],
  observability: ["src/observability/"],
  config: ["src/config/"],
};

const ALLOWED = {
  presentation: new Set([
    "application",
    "domain",
    "shared",
    "observability",
    "config",
  ]),
  application: new Set([
    "domain",
    "infrastructure",
    "shared",
    "observability",
    "config",
  ]),
  domain: new Set(["shared", "observability", "config"]),
  infrastructure: new Set(["domain", "shared", "observability", "config"]),
  shared: new Set([]),
  observability: new Set(["shared", "config"]),
  config: new Set(["shared", "observability"]),
};

const TEMP_ALLOWLIST = new Set([
  "presentation->infrastructure:@/services/analytics/",
  "presentation->infrastructure:@/services/hireFlow/intent",
  "presentation->infrastructure:@/services/resumeRequest/intent",
]);

const getLayer = (value) => {
  for (const [layer, prefixes] of Object.entries(LAYERS)) {
    if (prefixes.some((prefix) => value.includes(prefix))) {
      return layer;
    }
  }

  return null;
};

const getTargetLayer = (importPath) => {
  if (!importPath.startsWith("@/")) {
    return null;
  }

  if (importPath.startsWith("@/app/") || importPath.startsWith("@/ui/")) {
    return "presentation";
  }

  if (importPath.startsWith("@/application/")) {
    return "application";
  }

  if (importPath.startsWith("@/domains/")) {
    return "domain";
  }

  if (importPath.startsWith("@/db/") || importPath.startsWith("@/services/")) {
    return "infrastructure";
  }

  if (importPath.startsWith("@/shared/")) {
    return "shared";
  }

  if (importPath.startsWith("@/observability/")) {
    return "observability";
  }

  if (importPath.startsWith("@/config/")) {
    return "config";
  }

  return null;
};

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Warn when architectural layers cross forbidden boundaries",
      recommended: false,
    },
    schema: [],
    messages: {
      forbidden:
        "Forbidden layer crossing: {{from}} cannot import {{to}} ({{source}}).",
    },
  },

  create(context) {
    const currentFile = path.normalize(context.getFilename());
    const fromLayer = getLayer(currentFile);

    if (!fromLayer) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        if (typeof source !== "string") {
          return;
        }

        const toLayer = getTargetLayer(source);
        if (!toLayer || toLayer === fromLayer) {
          return;
        }

        const allowKey = `${fromLayer}->${toLayer}:${source}`;
        const allowPrefixKey = `${fromLayer}->${toLayer}:${source}/`;
        if (
          TEMP_ALLOWLIST.has(allowKey) ||
          [...TEMP_ALLOWLIST].some((entry) =>
            allowPrefixKey.startsWith(`${entry}/`)
          )
        ) {
          return;
        }

        const allowed = ALLOWED[fromLayer] ?? new Set();
        if (!allowed.has(toLayer)) {
          context.report({
            node,
            messageId: "forbidden",
            data: {
              from: fromLayer,
              to: toLayer,
              source,
            },
          });
        }
      },
    };
  },
};
