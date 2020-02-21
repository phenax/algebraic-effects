
// const { compose } = require('@algebraic-effects/utils');

function Bencho () {
  const measurements = {};
  let pendingMeasurements = 0;
  let onMeasureComplete = () => {};

  const startMeasurement = () => {
    pendingMeasurements = pendingMeasurements + 1;
  };
  const endMeasurement = () => {
    pendingMeasurements = Math.min(0, pendingMeasurements - 1);
    console.log(pendingMeasurements);

    if (pendingMeasurements === 0) {
      setTimeout(onMeasureComplete, 10);
    }
  };


  const onFinish = fn => {
    onMeasureComplete = fn;
  };


  function getMeasurement(key) {
    if (!measurements[key]) {
      throw new Error(`Invalid measurement key - ${key}`);
    }

    return measurements[key];
  }

  function measure(key, operation) {
    startMeasurement();
    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;

    const onEnd = () => {
      const endTime = performance.now();
      const endMemory = process.memoryUsage().heapUsed;

      measurements[key] = {
        time: {
          start: startTime,
          end: endTime,
          diff: endTime - startTime,
        },
        memory: {
          start: startMemory,
          end: endMemory,
          diff: endMemory - startMemory,
        },
      };

      endMeasurement();
    };

    operation(onEnd);
  }

  function compare(key1, key2) {
    const m1 = getMeasurement(key1);
    const m2 = getMeasurement(key2);

    return {
      time: {
        delta: m1.time.diff - m2.time.diff,
        perc: 100 * (m1.time.diff - m2.time.diff) / Math.max(m1.time.diff, m2.time.diff),
        winner: m1.time.diff < m2.time.diff ? key1 : key2,
      },
      memory: {
        delta: m1.memory.diff - m2.memory.diff,
        perc: 100 * (m1.memory.diff - m2.memory.diff) / Math.max(m1.memory.diff, m2.memory.diff),
        winner: m1.memory.diff < m2.memory.diff ? key1 : key2,
      },
    };
  }

  return { measure, compare, getMeasurement, onFinish };
}



Bencho.benchmark = (label, { repeat = 1, threshold, keys = [], measure, onComplete }) => {
  it(label, done => {

    runTest(repeat);

    function runTest(runsLeft) {
      const b = { label, ...Bencho() };
  
      b.measure('baseline', onEnd => onEnd());
      measure(b);

      b.onFinish(() => {
        onComplete && onComplete(b);

        if (keys.length >= 2 && threshold) {
          const result = b.compare(...keys);
          expect(result.time.perc).toBeLessThan(threshold.time);
          expect(result.memory.perc).toBeLessThan(threshold.memory);
        }

        setTimeout(() => {
          if (runsLeft === 0) done();
          else runTest(runsLeft - 1);
        }, 10);
      });
    }
  });
};

module.exports = Bencho;

