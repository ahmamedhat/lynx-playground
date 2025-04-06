import { useCallback, useState, useEffect } from '@lynx-js/react';
import './App.css';

// Particle class for additional animation effects
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  angle: number;
  color: string;
}

// Very minimal version to ensure something displays
export function App() {
  // Simple state for testing interactivity
  const [count, setCount] = useState(0);
  const [animationItems, setAnimationItems] = useState<
    { id: number; top: number; opacity: number; fontSize: number }[]
  >([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [listItems, setListItems] = useState<string[]>([]);
  const [lastAnimId, setLastAnimId] = useState(0);
  const [bgColorIntensity, setBgColorIntensity] = useState(0);

  // Generate a random color
  const getRandomColor = () => {
    const colors = ['#4a90e2', '#e24a4a', '#4ae24a', '#e2e24a', '#e24ae2'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Create multiple particles
  const createParticles = (count: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const id = lastAnimId + i;
      newParticles.push({
        id,
        x: 50 + Math.random() * 30 - 15, // centered with some variation
        y: 50,
        size: 5 + Math.random() * 10,
        speed: 1 + Math.random() * 3,
        opacity: 1,
        angle: Math.random() * 360,
        color: getRandomColor(),
      });
    }
    return newParticles;
  };

  // Simple increment function with animation
  const increment = useCallback(() => {
    setCount(count + 1);

    // Add new animation item for the +1 text
    const newAnimId = lastAnimId + 1;
    setLastAnimId(newAnimId + 20); // Reserve IDs for particles

    // Add floating +1 animation
    setAnimationItems((prev) => [
      ...prev,
      { id: newAnimId, top: 0, opacity: 1, fontSize: 40 },
    ]);

    // Add particles
    setParticles((prev) => [...prev, ...createParticles(20)]);

    // Increment list by adding a new item at the top
    setListItems((prev) => [
      `Count: ${count + 1} added at ${new Date().toLocaleTimeString()}`,
      ...prev,
    ]);

    // Flash the background color
    setBgColorIntensity(1);
  }, [count, lastAnimId]);

  // Animation effect for the +1 texts
  useEffect(() => {
    if (animationItems.length === 0) return;

    const timerId = setTimeout(() => {
      setAnimationItems((prevItems) => {
        // Update each animation's position and opacity
        const updatedItems = prevItems.map((item) => ({
          ...item,
          top: item.top - 3, // Move upward
          opacity: Math.max(0, item.opacity - 0.05), // Fade out
          fontSize: item.fontSize - 2, // Decrease font size
        }));

        // Remove finished animations (fully transparent)
        return updatedItems.filter((item) => item.opacity > 0);
      });
    }, 50);

    return () => clearTimeout(timerId);
  }, [animationItems]);

  // Animation effect for particles
  useEffect(() => {
    if (particles.length === 0) return;

    const timerId = setTimeout(() => {
      setParticles((prevParticles) => {
        // Update each particle's position and opacity
        const updatedParticles = prevParticles.map((particle) => ({
          ...particle,
          x:
            particle.x +
            Math.cos(particle.angle * (Math.PI / 180)) * particle.speed,
          y:
            particle.y +
            Math.sin(particle.angle * (Math.PI / 180)) * particle.speed,
          size: Math.max(0, particle.size - 0.2),
          opacity: Math.max(0, particle.opacity - 0.02),
        }));

        // Remove finished particles
        return updatedParticles.filter((particle) => particle.opacity > 0);
      });
    }, 30); // Faster update for smoother particle movement

    return () => clearTimeout(timerId);
  }, [particles]);

  // Animation effect for background color flash
  useEffect(() => {
    if (bgColorIntensity <= 0) return;

    const timerId = setTimeout(() => {
      setBgColorIntensity((prev) => Math.max(0, prev - 0.05));
    }, 30);

    return () => clearTimeout(timerId);
  }, [bgColorIntensity]);

  // Calculate background color based on intensity
  const getBgColor = (baseColor: string, intensity: number) => {
    const lighten = (color: string, amount: number) => {
      // Simple color lightening for demonstration
      return color === '#333333'
        ? `rgb(${51 + amount * 100}, ${51 + amount * 50}, ${51 + amount * 200})`
        : color;
    };
    return lighten(baseColor, intensity);
  };

  return (
    <view className="main-container" style={{ backgroundColor: '#222222' }}>
      <view className="content-area" style={{ flexDirection: 'column' }}>
        <text
          className="title-text"
          style={{ color: '#2196f3', textAlign: 'center' }}
        >
          Lynx.js Demo
        </text>

        <view
          className="counter-container"
          style={{
            backgroundColor: getBgColor('#333333', bgColorIntensity),
            width: '80%',
            overflow: 'hidden',
          }}
        >
          <view
            style={{
              position: 'relative',
              width: '100%',
              alignItems: 'center',
              height: '50px',
            }}
          >
            <text
              className="counter-value"
              style={{ color: 'white', textAlign: 'center' }}
            >
              Count: {count}
            </text>

            {/* Animation elements that stack */}
            {animationItems.map((item) => (
              <view
                key={`anim-${item.id}`}
                style={{
                  position: 'absolute',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: `${item.top}px`,
                  opacity: item.opacity,
                }}
              >
                <text
                  style={{
                    fontSize: `${item.fontSize}px`,
                    color: '#4a90e2',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  +1
                </text>
              </view>
            ))}

            {/* Particle effects */}
            {particles.map((particle) => (
              <view
                key={`particle-${particle.id}`}
                style={{
                  position: 'absolute',
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  borderRadius: '50%',
                  opacity: particle.opacity,
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                }}
              />
            ))}
          </view>

          <view
            className="button"
            bindtap={increment}
            style={{ backgroundColor: '#4a90e2' }}
          >
            <text
              className="button-text"
              style={{ color: 'white', textAlign: 'center' }}
            >
              Increment
            </text>
          </view>
        </view>

        {/* Enhanced list that grows with each increment */}
        <view style={{ width: '100%', flex: 1, marginTop: '20px' }}>
          <list
            className="simple-list"
            scroll-orientation="vertical"
            list-type="single"
            span-count={1}
            style={{ width: '100%', height: '400px' }}
          >
            {listItems.map((item, index) => (
              <list-item
                key={`item-${index}`}
                item-key={`item-${index}`}
                style={{ margin: '5px 0' }}
              >
                <view
                  className="list-item-simple"
                  style={{
                    backgroundColor: '#333333',
                    padding: '15px',
                    margin: '8px',
                    borderRadius: '5px',
                    borderWidth: '1px',
                    borderColor: index === 0 ? '#e24a4a' : '#4a90e2',
                    borderStyle: 'solid',
                  }}
                >
                  <text
                    className="list-item-text"
                    style={{
                      color: index === 0 ? '#e24a4a' : 'white',
                      fontSize: index === 0 ? '18px' : '16px',
                      fontWeight: index === 0 ? 'bold' : 'normal',
                      textAlign: 'left',
                    }}
                  >
                    {item}
                  </text>
                </view>
              </list-item>
            ))}
          </list>
        </view>
      </view>
    </view>
  );
}
