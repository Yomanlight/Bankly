import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

export default function AnimatedNumber({
  value,
  style,
  duration = 800,
  prefix = '',
  suffix = '',
  decimals = 0,
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOut)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOut;
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value]);

  return (
    <Text style={style}>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </Text>
  );
}

// Composant spécialisé pour les pourcentages (style Finary)
export function AnimatedPercentage({ value, style, positiveColor, negativeColor, neutralColor }) {
  const textColor = value > 0 ? positiveColor : value < 0 ? negativeColor : neutralColor;
  const sign = value > 0 ? '+' : '';

  return (
    <AnimatedNumber
      value={value}
      style={[style, { color: textColor }]}
      prefix={sign}
      suffix="%"
      decimals={2}
    />
  );
}

// Composant pour afficher de grandes valeurs (milliers, millions)
export function AnimatedCurrency({ value, style, currency = '€' }) {
  let formattedValue = value;
  let suffix = ` ${currency}`;

  // Formater en K, M, etc. comme Finary
  if (Math.abs(value) >= 1000000) {
    formattedValue = value / 1000000;
    suffix = `M ${currency}`;
  } else if (Math.abs(value) >= 1000) {
    formattedValue = value / 1000;
    suffix = `K ${currency}`;
  }

  return (
    <AnimatedNumber
      value={formattedValue}
      style={style}
      suffix={suffix}
      decimals={formattedValue < 100 ? 2 : 0}
    />
  );
}
