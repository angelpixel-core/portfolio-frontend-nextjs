"use client";

import "./styles.css";

import { motion } from "framer-motion";
import { CONCEPTS, getWeightClass } from "./data";

/**
 * WordCloud Component
 *
 * Displays professional concepts as a word cloud.
 * Visual size is derived from concept weight.
 * Hover reveals related keywords.
 */
const WordCloud = () => {
  return (
    <div className="word-cloud" data-testid="word-cloud">
      <div className="word-cloud__container">
        {CONCEPTS.map((concept, index) => (
          <motion.div
            key={concept.id}
            className={`word-cloud__word ${getWeightClass(concept.weight)}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="word-cloud__label">{concept.label}</span>
            <span className="word-cloud__keywords">
              {concept.relatedKeywords.slice(0, 3).join(" · ")}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WordCloud;
