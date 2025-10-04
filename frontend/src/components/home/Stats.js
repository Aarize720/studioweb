'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { value: 200, suffix: '+', label: 'Projets réalisés', color: 'from-blue-500 to-cyan-500' },
  { value: 150, suffix: '+', label: 'Clients satisfaits', color: 'from-purple-500 to-pink-500' },
  { value: 10, suffix: '+', label: 'Années d\'expérience', color: 'from-orange-500 to-red-500' },
  { value: 98, suffix: '%', label: 'Taux de satisfaction', color: 'from-green-500 to-emerald-500' },
];

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {isInView ? value : 0}{suffix}
    </motion.span>
  );
}

export default function Stats() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}