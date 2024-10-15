import React, { useState, useEffect } from 'react';
import './App.scss';

function App() {
  const [tankSize, setTankSize] = useState('');
  const [fuelRemaining, setFuelRemaining] = useState('');
  const [ethanolInTank, setEthanolInTank] = useState('');
  const [ethanolPumpGas, setEthanolPumpGas] = useState('');
  const [ethanolE85, setEthanolE85] = useState('');
  const [targetEthanol, setTargetEthanol] = useState('');
  const [result, setResult] = useState(null);
  const [unit, setUnit] = useState('gallons');
  const [useDistanceToEmpty, setUseDistanceToEmpty] = useState(false);
  const [distanceToEmpty, setDistanceToEmpty] = useState('');
  const [mpg, setMpg] = useState('');

  const handleUnitChange = () => {
    setUnit(unit === 'gallons' ? 'liters' : 'gallons');
  };

  useEffect(() => {
    if (
      tankSize && fuelRemaining && ethanolInTank &&
      ethanolPumpGas && ethanolE85 && targetEthanol
    ) {
      calculateMix();
    }
  }, [tankSize, fuelRemaining, ethanolInTank, ethanolPumpGas, ethanolE85, targetEthanol]);

  useEffect(() => {
    if (useDistanceToEmpty && distanceToEmpty && mpg) {
      const calculatedFuelRemaining = (parseFloat(distanceToEmpty) / parseFloat(mpg)).toFixed(2);
      setFuelRemaining(calculatedFuelRemaining);
    }
  }, [distanceToEmpty, mpg, useDistanceToEmpty]);

  const calculateMix = () => {
    let convertedTankSize = parseFloat(tankSize);
    let convertedFuelRemaining = parseFloat(fuelRemaining);

    if (unit === 'liters') {
      convertedTankSize = convertedTankSize / 3.78541;
      convertedFuelRemaining = convertedFuelRemaining / 3.78541;
    }

    const V_ethanol_current = convertedFuelRemaining * (parseFloat(ethanolInTank) / 100);
    const V_ethanol_target = convertedTankSize * (parseFloat(targetEthanol) / 100);
    const V_remaining = convertedTankSize - convertedFuelRemaining;

    const V_E85 = (V_ethanol_target - V_ethanol_current - V_remaining * (parseFloat(ethanolPumpGas) / 100)) / (parseFloat(ethanolE85) / 100 - parseFloat(ethanolPumpGas) / 100);
    const V_pump_gas = V_remaining - V_E85;

    if (V_E85 >= 0 && V_pump_gas >= 0) {
      setResult({
        V_E85: V_E85.toFixed(2),
        V_pump_gas: V_pump_gas.toFixed(2),
      });
    } else {
      setResult("Invalid input or calculations resulted in negative values.");
    }
  };

  const convertToSelectedUnit = (value) => {
    if (unit === 'liters') {
      return (value * 3.78541).toFixed(2);
    }
    return value;
  };

  return (
    <div className="container">
      <h1>FUEL MIX CALCULATOR</h1>

      <div className="form-group">
        <label>Select Unit:</label>
        <div className="button-group">
          <button
            type="button"
            className={unit === 'gallons' ? 'active' : ''}
            onClick={() => setUnit('gallons')}
          >
            GALLONS
          </button>
          <button
            type="button"
            className={unit === 'liters' ? 'active' : ''}
            onClick={() => setUnit('liters')}
          >
            LITERS
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Fuel Tank Size ({unit}):</label>
        <input
          type="number"
          name="tankSize"
          value={tankSize}
          onChange={(e) => setTankSize(e.target.value)}
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label>Fuel Remaining ({unit}):</label>
        <div className="toggle-fuel-remaining">
          <button
            type="button"
            className={!useDistanceToEmpty ? 'active' : ''}
            onClick={() => setUseDistanceToEmpty(false)}
          >
            Manual entry
          </button>
          <button
            type="button"
            className={useDistanceToEmpty ? 'active' : ''}
            onClick={() => setUseDistanceToEmpty(true)}
          >
            Calculate for me
          </button>
        </div>
        {!useDistanceToEmpty ? (
          <input
            type="number"
            name="fuelRemaining"
            value={fuelRemaining}
            onChange={(e) => setFuelRemaining(e.target.value)}
            step="0.01"
            required
          />
        ) : (
          <div className="distance-mpg-inputs">
            <label>Distance to empty (miles):</label>
            <input
              type="number"
              value={distanceToEmpty}
              onChange={(e) => setDistanceToEmpty(e.target.value)}
              required
            />
            <label>Average MPG:</label>
            <input
              type="number"
              value={mpg}
              onChange={(e) => setMpg(e.target.value)}
              required
            />
            {fuelRemaining && (
              <div className="fuel-remaining-output">
                <p>Fuel Remaining: <strong>{fuelRemaining} {unit}</strong></p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Ethanol % of Current Tank:</label>
        <input
          type="number"
          name="ethanolInTank"
          value={ethanolInTank}
          onChange={(e) => setEthanolInTank(e.target.value)}
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label>Ethanol % of Pump Gas:</label>
        <input
          type="number"
          name="ethanolPumpGas"
          value={ethanolPumpGas}
          onChange={(e) => setEthanolPumpGas(e.target.value)}
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label>Ethanol % of E85:</label>
        <input
          type="number"
          name="ethanolE85"
          value={ethanolE85}
          onChange={(e) => setEthanolE85(e.target.value)}
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label>Desired Ethanol %:</label>
        <input
          type="number"
          name="targetEthanol"
          value={targetEthanol}
          onChange={(e) => setTargetEthanol(e.target.value)}
          step="0.01"
          required
        />
      </div>

      {result && (
        <div className="result">
          {typeof result === 'string' ? (
            <p>{result}</p>
          ) : (
            <>
              <p>Add <strong>{convertToSelectedUnit(result.V_E85)} {unit}</strong> of E85.</p>
              <p>Add <strong>{convertToSelectedUnit(result.V_pump_gas)} {unit}</strong> of Pump Gas.</p>
              <p>Result: <strong>{targetEthanol}% Ethanol</strong> &#40;E{targetEthanol}&#41;</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
