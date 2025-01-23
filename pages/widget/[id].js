"use client";
import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

// Brand Colors
const colors = {
  vampireBlack: '#08090A',
  cultured: '#F7F8F8',
  argent: '#C0C0C0',
  gray: {
    400: '#747474',
    500: '#444545',
    600: '#8C8C8C',
  }
};

export default function Widget({ widgetId }) {
  const [activeTab, setActiveTab] = useState('time');

  useEffect(() => {
    function adjustHeight() {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: 'resize', height }, '*');
    }

    window.addEventListener('load', adjustHeight);
    const observer = new MutationObserver(adjustHeight);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('load', adjustHeight);
      observer.disconnect();
    };
  }, []);

  return (
        <div className="min-h-screen bg-gradient-to-b from-vampireBlack to-gray-900" 
        style={{ 
          fontFamily: 'Inter, sans-serif',
          background: 'linear-gradient(to bottom, #08090A, #1a1a1a)',
          minHeight: '100vh',
          padding: '0',
          margin: '0'
        }}>
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
  
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4" 
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  fontWeight: 700,
                  color: colors.cultured,
                  background: `linear-gradient(to right, ${colors.cultured}, ${colors.argent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
              ROI Calculators
            </h1>
            <p style={{ color: colors.argent }} className="max-w-2xl mx-auto font-medium text-lg">
              Calculate potential returns and savings with our interactive calculators
            </p>
          </div>
  
          {/* Custom Tabs */}
          <div className="space-y-8">
            <div className="flex justify-center gap-4">
              {['time', 'pipeline'].map((tab) => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group relative px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105
                            ${activeTab === tab ? 'shadow-lg' : ''}`}
                style={{
                  backgroundColor: activeTab === tab ? colors.cultured : colors.gray[500],
                  color: activeTab === tab ? colors.vampireBlack : colors.cultured,
                  boxShadow: activeTab === tab ? '0 0 15px rgba(247, 248, 248, 0.15)' : 'none'
                }}
              >
                {tab === 'time' ? 'Pipeline Value' : 'Time Savings'} {/* Fixed tab names */}
                
                {/* Active underline */}
                <div 
                  className={`absolute left-0 bottom-0 h-1 rounded-b-lg transition-all duration-500 ease-out
                             ${activeTab === tab ? 'w-full' : 'w-0'}`}
                  style={{ 
                    backgroundColor: activeTab === tab ? colors.argent : 'transparent',
                    transform: 'translateY(0)',
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px'
                  }}
                />
                
                {/* Hover underline */}
                <div 
                  className={`absolute left-0 bottom-0 h-1 rounded-b-lg transition-all duration-500 ease-out
                             ${activeTab === tab ? 'opacity-0' : 'opacity-100'}`}
                  style={{ 
                    backgroundColor: colors.argent,
                    transform: 'translateY(0)',
                    width: '0%',
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px'
                  }}
                />
              </button>
              ))}
            </div>
  
            <div className="mt-6 transform transition-all duration-500">
              {activeTab === 'time' ? <PipelineCalculator /> : <TimeSavingsCalculator />}
            </div>
          </div>
        </div>
  
        <style jsx>{`
          .group:hover div:last-child {
            width: 100%;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .group {
            transform: translateZ(0);
            backface-visibility: hidden;
          }
          
          .group:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease;
          }
          
          .group:active {
            transform: scale(0.95);
            transition: transform 0.1s ease;
          }
        `}</style>
      </div>
    );
  }
  
  function TimeSavingsCalculator() {
    const [hoursPerWeek, setHoursPerWeek] = useState(10);
    const [hourlyRate, setHourlyRate] = useState(400);
  
    const weeklyROI = hoursPerWeek * hourlyRate;
    const monthlyROI = weeklyROI * 4;
    const annualROI = weeklyROI * 52;
  
    return (
      <div style={{ backgroundColor: colors.gray[500], borderColor: colors.argent }} 
           className="rounded-xl shadow-2xl p-8 border border-opacity-20 backdrop-blur-sm transform transition-all duration-300 hover:shadow-3xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-3" style={{ color: colors.cultured, fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Time Savings ROI Calculator
          </h2>
          <p style={{ color: colors.argent }} className="font-medium text-lg">
            See how many hours per week you can reclaim with AI automation, and the direct financial impact.
          </p>
        </div>
  
        <div className="space-y-8">
          <SliderInput
            label="Hours Saved Per Week"
            value={hoursPerWeek}
            onChange={setHoursPerWeek}
            max={40}
            step={1}
            unit=" hours"
            tooltip="These are the estimated hours freed each week by automating repetitive tasks."
          />
  
          <SliderInput
            label="Hourly Billing Rate"
            value={hourlyRate}
            onChange={setHourlyRate}
            min={200}
            max={1000}
            step={50}
            unit="$"
            tooltip="The average hourly fee you charge clients for your services."
          />
  
          <ResultsCard 
            monthlyValue={monthlyROI}
            annualValue={annualROI}
            subtitle="Projected yearly savings based on current rates"
          />
        </div>
      </div>
    );
  }
  
  function PipelineCalculator() {
    const [monthlyCalls, setMonthlyCalls] = useState(10);
    const [callShow, setCallShow] = useState(95);
    const [qualification, setQualification] = useState(80);
    const [lifetimeValue, setLifetimeValue] = useState(50000);
    const [closingRate, setClosingRate] = useState(20);
  
    const pipelineValue = monthlyCalls * (callShow / 100) * (qualification / 100) * lifetimeValue;
    const monthlyPipelineValue = pipelineValue;
    const annualPipelineValue = monthlyPipelineValue * 12;
    const monthlyROI = pipelineValue * (closingRate / 100);
    const annualROI = monthlyROI * 12;
  
    return (
      <div style={{ backgroundColor: colors.gray[500], borderColor: colors.argent }} 
           className="rounded-xl shadow-2xl p-8 border border-opacity-20 backdrop-blur-sm">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-3" style={{ color: colors.cultured, fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Pipeline Value & ROI Calculator
          </h2>
          <p style={{ color: colors.argent }} className="font-medium text-lg">
            Calculate potential revenue from new leads and see how final ROI depends on your closing rate.
          </p>
        </div>
  
        <div className="space-y-12">
          {/* Stage 1: Pipeline Value */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold" style={{ color: colors.cultured }}>
              Stage 1: Pipeline Value
            </h3>
            
            <div className="space-y-6">
              <SliderInput
                label="Monthly Discovery Calls"
                value={monthlyCalls}
                onChange={setMonthlyCalls}
                max={50}
                step={1}
                unit=" calls"
                tooltip="Number of prospective clients who agree to learn about your services."
              />
  
              <SliderInput
                label="Call Show Rate"
                value={callShow}
                onChange={setCallShow}
                min={75}
                max={100}
                step={1}
                unit="%"
                tooltip="The proportion of leads who show up for meetings."
              />
  
              <SliderInput
                label="Qualification Rate"
                value={qualification}
                onChange={setQualification}
                min={50}
                max={100}
                step={1}
                unit="%"
                tooltip="Of those who attend, how many match your target criteria."
              />
  
              <SliderInput
                label="Client Lifetime Value"
                value={lifetimeValue}
                onChange={setLifetimeValue}
                min={10000}
                max={300000}
                step={5000}
                unit="$"
                tooltip="The total revenue expected per client over their entire engagement period."
                format={val => val.toLocaleString()}
              />
            </div>
  
            <ResultsCard 
              monthlyValue={monthlyPipelineValue}
              annualValue={annualPipelineValue}
              subtitle="Projected yearly pipeline value based on current metrics"
              label="Pipeline Value"
            />
          </div>
  
          {/* Stage 2: ROI */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold" style={{ color: colors.cultured }}>
              Stage 2: ROI Calculation
            </h3>
            
            <SliderInput
              label="Closing Rate"
              value={closingRate}
              onChange={setClosingRate}
              max={70}
              step={1}
              unit="%"
              tooltip="The percentage of qualified prospects you successfully convert into paying clients."
            />
  
            <ResultsCard 
              monthlyValue={monthlyROI}
              annualValue={annualROI}
              subtitle="Projected yearly revenue based on closing rate"
              label="ROI"
            />
          </div>
        </div>
      </div>
    );
  }
  
  function ResultsCard({ monthlyValue, annualValue, subtitle, label = '' }) {
    return (
      <div className="rounded-lg p-6 transform transition-all duration-300 hover:scale-105" 
           style={{ backgroundColor: colors.vampireBlack }}>
        <div className="grid grid-cols-1 gap-6">
          <div className="border-b pb-4" style={{ borderColor: colors.gray[500] }}>
            <div style={{ color: colors.argent }} className="text-sm font-medium">
              Monthly {label}
            </div>
            <div className="text-3xl font-bold" style={{ color: colors.cultured }}>
              ${monthlyValue.toLocaleString()}
            </div>
          </div>
          <div className="pt-2">
            <div style={{ color: colors.argent }} className="text-sm font-medium uppercase tracking-wider">
              Annual {label}
            </div>
            <div className="text-4xl font-bold" style={{ color: colors.cultured }}>
              ${annualValue.toLocaleString()}
            </div>
            <div className="mt-2 text-sm" style={{ color: colors.gray[600] }}>
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function SliderInput({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 100, 
    step = 1, 
    unit = '', 
    tooltip = '', 
    format = val => val 
  }) {
    return (
      <div className="group">
        <div className="flex items-center justify-between mb-3">
          <label 
            className="flex items-center text-base font-medium" 
            style={{ color: colors.cultured }}
          >
            {label}
            {tooltip && (
              <div className="relative ml-2">
                <Info className="w-4 h-4 transition-colors duration-200 hover:text-cultured" 
                     style={{ color: colors.argent }} />
                <div 
                  className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 rounded-lg z-10 text-sm"
                  style={{ backgroundColor: colors.vampireBlack, color: colors.cultured }}
                >
                  {tooltip}
                  <div 
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                    style={{ backgroundColor: colors.vampireBlack }}
                  />
                </div>
              </div>
            )}
          </label>
          <span 
            className="font-bold text-lg transition-all duration-200" 
            style={{ color: colors.cultured }}
          >
            {unit === '$' ? `$${format(value)}` : `${format(value)}${unit}`}
          </span>
        </div>
  
        <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all duration-200"
    style={{
      backgroundColor: colors.vampireBlack,
      backgroundImage: `linear-gradient(to right, ${colors.cultured} ${(value - min) / (max - min) * 100}%, ${colors.vampireBlack} ${(value - min) / (max - min) * 100}%)`,
      WebkitAppearance: 'none',
      height: '4px', // Reduced track height
      margin: '10px 0', // Added margin to ensure space for the thumb
    }}
  />
  
  <style jsx>{`
    input[type='range'] {
      position: relative;
      top: 2px; // Fine-tune vertical alignment
    }
  
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: ${colors.cultured};
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      margin-top: -8px; // Centers the thumb relative to track
    }
  
    input[type='range']::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border: none;
      border-radius: 50%;
      background: ${colors.cultured};
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      margin-top: -8px; // Centers the thumb relative to track
    }
  
    input[type='range']::-webkit-slider-runnable-track {
      background: transparent;
      height: 4px; // Match input height
      border-radius: 2px;
    }
  
    input[type='range']::-moz-range-track {
      background: transparent;
      height: 4px; // Match input height
      border-radius: 2px;
    }
  
    input[type='range']::-webkit-slider-thumb:hover,
    input[type='range']::-moz-range-thumb:hover {
      transform: scale(1.2);
      background: ${colors.argent};
    }
  
    input[type='range']:active::-webkit-slider-thumb,
    input[type='range']:active::-moz-range-thumb {
      transform: scale(1.1);
    }
  
    input[type='range']:focus {
      outline: none;
    }
  
    input[type='range']::-ms-track {
      width: 100%;
      cursor: pointer;
      background: transparent; 
      border-color: transparent;
      color: transparent;
      height: 4px; // Match input height
    }
  `}</style>
      </div>
    );
  }