import { DrawnFlower, FlowerType } from '../types';
import { TRADITIONAL_FLOWERS } from '../data/flowers';

export const generateRandomPattern = (
  canvasWidth: number,
  canvasHeight: number,
  flowerCount: number = 50
): DrawnFlower[] => {
  const flowers: DrawnFlower[] = [];
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const maxRadius = Math.min(canvasWidth, canvasHeight) / 2 - 50;

  // Create concentric circles
  const circles = 5;
  const flowersPerCircle = Math.floor(flowerCount / circles);

  for (let circle = 0; circle < circles; circle++) {
    const radius = (maxRadius / circles) * (circle + 1);
    const flowersInThisCircle = circle === 0 ? 1 : flowersPerCircle * (circle + 1);

    for (let i = 0; i < flowersInThisCircle; i++) {
      if (circle === 0) {
        // Center flower
        flowers.push({
          id: `generated-${Date.now()}-${circle}-${i}`,
          type: TRADITIONAL_FLOWERS[Math.floor(Math.random() * TRADITIONAL_FLOWERS.length)],
          x: centerX,
          y: centerY,
          rotation: Math.random() * 2 * Math.PI,
          scale: 1.2 + Math.random() * 0.3,
        });
      } else {
        const angle = (2 * Math.PI * i) / flowersInThisCircle;
        const radiusVariation = radius + (Math.random() - 0.5) * radius * 0.2;
        
        flowers.push({
          id: `generated-${Date.now()}-${circle}-${i}`,
          type: TRADITIONAL_FLOWERS[Math.floor(Math.random() * TRADITIONAL_FLOWERS.length)],
          x: centerX + Math.cos(angle) * radiusVariation,
          y: centerY + Math.sin(angle) * radiusVariation,
          rotation: angle + Math.PI / 2 + (Math.random() - 0.5) * 0.5,
          scale: 0.7 + Math.random() * 0.6,
        });
      }
    }
  }

  // Add some random scattered flowers
  const scatteredCount = Math.floor(flowerCount * 0.2);
  for (let i = 0; i < scatteredCount; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * maxRadius * 0.8;
    
    flowers.push({
      id: `scattered-${Date.now()}-${i}`,
      type: TRADITIONAL_FLOWERS[Math.floor(Math.random() * TRADITIONAL_FLOWERS.length)],
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      rotation: Math.random() * 2 * Math.PI,
      scale: 0.5 + Math.random() * 0.8,
    });
  }

  return flowers;
};